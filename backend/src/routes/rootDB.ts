import { Collection, MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { ConnectRequest, Connections, Info, User, UserStats } from '../types/db_schema';
import { Match } from '../types/types_local';

dotenv.config();

const uri = process.env.MONGO_LOCAL ?? 's';
console.log(uri);

const client = new MongoClient(uri);
client.connect();

const db = client.db('demo');

db.collection('users').createIndex(
    {fullname: 1, username :1},
    {collation: {locale: 'en', strength: 2}}
)

const userCollection: Collection<User> = db.collection('users');
const infoCollection: Collection<Info> = db.collection('info');
const connectionsCollection: Collection<Connections> = db.collection('connections');
const requestCollection: Collection<ConnectRequest> = db.collection('connect_request');
const userStatsCollection: Collection<UserStats> = db.collection('user_stats');

export async function checkCredentials(data: Array<string>) {
    try{
        var user = await userCollection.findOne({username: data[0]});
        if(user && bcrypt.compareSync(data[1], user.password)) return true;
        else return false;
    }catch (err){
        throw err;
    }
}

export async function checkUserNameAvailable(username: string) {
    const user = await userCollection.findOne({username: username.toLowerCase()});
    return user==null;  // username is available
}


export async function signup(data: {username: string, password: string, fullname: string}) {
        const session = client.startSession();
        try {
            session.startTransaction();

            var salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password , salt);

            const user: User = {
                username: data.username.toLowerCase(),
                password: data.password,
                fullname: data.fullname
            }

            const info: Info = {
                username: data.username.toLowerCase(),
                fullname: data.fullname,
                bio: '',
                contact: '',
                contact_privacy: true,
                dob: '',
                email: '',
                gender: '',
                location: '',
                profession: '',
                pfp_uploaded: false
            }

            const connections: Connections = {
                user: data.username.toLowerCase(),
                connections: []
            }

            const userStats: UserStats = {
                username: data.username.toLowerCase(),
                postsCount: 0,
                connectionsCount: 0
            }


            await userCollection.insertOne(user);
            await infoCollection.insertOne(info);
            await connectionsCollection.insertOne(connections);
            await userStatsCollection.insertOne(userStats);
                        
            session.commitTransaction();
        } catch (err) {
            session.abortTransaction();
            throw err;
        } finally {
            session.endSession();
        }
}




/**
 * 
 * @param txt text to match
 * @param user user that requested the search
 * @returns a list of possible matches
 */

export async function search(txt: string, user: string): Promise<Array<Match>> {

    const session = client.startSession();
    try {
        session.startTransaction()
        const resultSet = await userCollection.find(
            {$and: [
                {username: {$ne :user}}, 
                {$or: [
                    {username: { $regex: `.*${(txt)}.*`, $options: 'i'} }, 
                    {fullname: { $regex: `.*${(txt)}.*`, $options: 'i'} }
                ]}
            ]}
        ).toArray()  
        // .collation({locale: 'en', strength: 2});
        
        
        var list: Array<Match>= []

        for(const result of resultSet) {
            let obj: Match = {username: result.username, fullname: result.fullname};
            const connections = (await connectionsCollection.findOne({user}))!.connections;
            
            if(connections.includes(obj.username)) {
                obj.status = 'connected';
                list.push(obj);
                continue;
            }

            const incomingReq = await requestCollection
                .findOne({sender: obj.username, receiver: user});
            
            if(incomingReq) {
                obj.status = 'incoming'
                obj._id = incomingReq._id.toString()
                list.push(obj);
                continue;
            }

            const sentReq = await requestCollection
                .findOne({sender: user, receiver: obj.username});

            if(sentReq) {
                obj.status = 'outgoing';
                obj._id = sentReq._id.toString();
                list.push(obj);
                continue;
            }

            obj.status = 'none';
            list.push(obj);
        }
        await session.commitTransaction();
        return list

    } catch (err) {
        await session.abortTransaction();
        throw err
    } finally {
        await session.endSession()
    }
        
}


export  function sendRequest(sender: string, receiver: string): Promise<object> {
    return new Promise(async (resolve, reject) =>{
        const obj = {
            sender, receiver
        }
        requestCollection.insertOne(obj).then((id)=>{
            console.log(id);
            resolve({success : true, id});
        }).catch((reason)=>{
            reject({success: false, reason})
        })
    })
}

export async function cancelRequest(req_id: string) {
    const collection = db.collection('connect_request');

    await collection.deleteOne({_id: new ObjectId(req_id)});
}




async function connectUsers(u1: string, u2:string) {
    await connectionsCollection.updateOne({user: u1}, {$push: {connections: u2} })
    await connectionsCollection.updateOne({user: u2}, {$push: {connections: u1} })
    await userStatsCollection.updateOne({username: u1}, {$inc: {connectionsCount: 1}})
    await userStatsCollection.updateOne({username: u2}, {$inc: {connectionsCount: 1}})
}


export async function acceptReq(id: string) {
    const oid=new ObjectId(id)
    const request = await requestCollection.findOne({_id: oid});
    
    if(request) {
        await connectUsers(request.sender, request.receiver);
        await requestCollection.deleteOne({_id: oid});
        return {success: true};
    }else {
        throw ({success: false});
    }
} 

export function sendNotification(receiver: string) {
    
}

export  async function getRequestsData(receiver: string)  {
    const requests = await requestCollection.find({receiver}).toArray();
    
    let list = [];

    for(const request of requests) {
        const user = await userCollection.findOne({username: request.sender}, { projection: {_id: 0, password: 0} });
        if(user) list.push({username: user.username, fullname: user.fullname, id: request._id})
    }

    return list;
}

import { Collection, Document, MongoClient, ObjectId, PushOperator, WithId } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { socketSendNoti } from '../handleSocket';
import { Info } from '../routes/profileDB';

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

export async function checkCredentials(data: Array<string>) {
    try{
        console.log(data);
        
        const collection = db.collection('users');
        
        var l = await collection.findOne({username: data[0]});

        if(l) {
            if(bcrypt.compareSync(data[1], l.password)) {
                return true;
            }else return false;
            
        }else return false;
        
        
    }catch{
        return false;
    };
}

type User = {
    _id?: ObjectId
    username: string,
    password: string,
    fullname: string
}

type Connections = {
    _id?: ObjectId
    user: string,
    connections: Array<string>
}

export async function signup(data: {username: string, password: string, fullname: string}) : Promise<void> {
    return new Promise(async (resolve, reject)=>{
        const session = client.startSession();
        try {
            session.startTransaction();
            console.log('new signup data', data);
            
            var userCollection: Collection<User> = db.collection('users');
            var infoCollection: Collection<Info> = db.collection('info');
            const connectionsCollection: Collection<Connections> = db.collection('connections');

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


            await userCollection.insertOne(user);
            await infoCollection.insertOne(info);
            await connectionsCollection.insertOne(connections);
            
            session.commitTransaction();
            resolve();
            
        } catch {
            session.abortTransaction();
            reject();
        } finally {
            session.endSession();
        }
    })
}

export async function checkUserNameAvailable(username: string) {
    try {
        const collection = db.collection('users');
        const user = await collection.findOne({username: username.toLowerCase()});
        return user==null;  // username is available
    }catch{};
}

export async function getprofileData(username: string): Promise<any> {

    return new Promise(async (resolve, reject)=>{
        const collection = db.collection('users');
        const user = await collection.findOne({username: username.toLowerCase()}, {projection: {_id:0, password:0}});
        
        resolve(user!);
    })

}


type Match = {
    username: string, 
    fullname: string, 
    status?: string, 
    id?: ObjectId
}
/**
 * 
 * @param txt text to match
 * @param user user that requested the search
 * @returns a list of possible matches
 */

export async function search(txt: string, user: string): Promise<Array<Match>> {
    return new Promise(async (resolve, reject)=>{
        
        const session = client.startSession();

        try {
            session.startTransaction()
            const collection: Collection<User> = db.collection('users');
            const resultSet: Array<User> = await collection.find(
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
                const connections: Array<string> = (await db.collection('connections').findOne({user}))!.connections;
                console.log(connections);
                
                if(connections.includes(obj.username)) {
                    obj.status = 'connected';
                    list.push(obj);
                    continue;
                }

                const incomingReq = await db.collection('connect_request')
                    .findOne({sender: obj.username, receiver: user});
                
                if(incomingReq) {
                    obj.status = 'incoming'
                    obj.id = incomingReq._id
                    list.push(obj);
                    continue;
                }

                const sentReq = await db.collection('connect_request')
                    .findOne({sender: user, receiver: obj.username});

                if(sentReq) {
                    obj.status = 'outgoing';
                    obj.id = sentReq._id;
                    list.push(obj);
                    continue;
                }

                obj.status = 'none';
                list.push(obj);
            }



            await session.commitTransaction();
            resolve(list)
        } catch (err) {
            console.log('ERR', err);
            
            await session.abortTransaction();
            reject([]);
        } finally {
            await session.endSession()
        }
        
    })
}


export  function sendRequest(sender: string, receiver: string): Promise<object> {
    return new Promise(async (resolve, reject) =>{
        const collection  = db.collection('connect_request');
        const obj = {
            sender, receiver
        }
        collection.insertOne(obj).then((id)=>{
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

type Connection_Request = {

}


export  function getRequestsData(receiver: string) : Promise<object> {
    return new Promise(async (resolve, reject) => {
        const collection = db.collection('connect_request');
        const l = collection.find({receiver});
        // const l = await collection.find({receiver}).toArray();
        
        var list: Array<object> = [];
        // for()
        while(await l.hasNext()) {
            // console.log('test');
            const request = await l.next();
            // console.log(request);
            
            await getprofileData(request!.sender).then((user)=>{
                // console.log(user);
                
                if(typeof user != 'string') {
                    
                    list.push({...user, id: request!._id})
                    // console.log(list);
                    
                }
            })
            

        }
        
        resolve(list);
    })
}


async function connectUsers(u1: string, u2:string) {
    // const db = client.db('demo');

    const collection = db.collection('connections');

    var user;
    user = await collection.findOne({user: u1});
    await collection.updateOne({user: u1}, {$push: {connections: u2} as any})
    user = await collection.findOne({user: u2});
    await collection.updateOne({user: u2}, {$push: {connections: u1} as any})

    
}


export async function acceptReq(id: string) : Promise<object>{
    return new Promise(async (resolve, reject)=>{
        var collection = db.collection('connect_request');
        const oid=new ObjectId(id)
        const r = await collection.findOne({_id: oid});
        
        if(r) {
            await connectUsers(r.sender, r.receiver);
            
            collection = db.collection('connect_request');
        
            await collection.deleteOne({_id: oid});
            resolve({success: true});
        }else {
            reject({success: false});
        }
    })
} 

export function sendNotification(receiver: string) {
    getRequestsData(receiver).then((list: object)=>{
        socketSendNoti(receiver, list);
    })
}


export function getConnections(user: string) {
    return new Promise(async (resolve, reject)=>{
        const collection = db.collection('connections');
        const result = await collection.findOne({user}, {projection: {connections: 1}});
        if(result!=null) {
            const connections: Array<string>  = result.connections

            const usercollection = db.collection('info')
            var list: any = [];
            
            const promises = connections.map(async (username)=>{
                // console.log(username);
                var info = await usercollection.findOne({username}, {projection: {username: 1, fullname: 1}});
                // console.log(username, info);
                
                if(info!=null) {
                    const promise = db.collection('messages').find({$or: [{sender: user, receiver: username}, {sender: username, receiver: user}]}).sort({_id: -1}).limit(1);
                    if(await promise.hasNext()) {
                        const msg = await promise.next();
                        info.lastmsg = msg!.msg;
                        info.ts = msg!.ts;
                        await list.push(info)
                    }else {
                        info.msg=null
                        info.ts = '99999999999999';
                        await list.push(info)
                    }
                }
            })

            await Promise.all(promises);


            // console.log('lemght', list.length);
            list.sort((a: any, b: any)=>parseInt(b.ts)-parseInt(a.ts))
            // console.log('sorted list: ', list);
            

            resolve(list);
        }else reject(null)

    })

      


}
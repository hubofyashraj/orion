import { Document, MongoClient, ObjectId, WithId } from 'mongodb';
import dotenv from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcrypt';
import { socketSendNoti } from '../handleSocket';
import { connection } from 'mongoose';
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

export async function checkCredentials(data: {username: string, password: string}) {
    try{
        const collection = db.collection('users');
        
        var l = await collection.findOne({username: data.username});

        if(l) {
            if(bcrypt.compareSync(data.password, l.password)) {
                return true;
            }else return false;
            
        }else return false;
        
        
    }catch{
        return false;
    };
}

export async function signup(data: {username: string, password: string, fullname: string}) : Promise<string> {
    return new Promise(async (resolve, reject)=>{
        try {
            var collection = db.collection('users');
        
            var salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password , salt);

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
                profile_image: ''
            }

            const result = await collection.insertOne({username: data.username.toLowerCase(), password: data.password, fullname: data.fullname});
            collection = db.collection('info');
            await collection.insertOne(info)
            if (result.acknowledged) {
                await db.collection('connections').insertOne({user: data.username, connections: []})
                resolve(result.insertedId+'');
            } else {
                reject('Could not insert');
            }
        } catch {
            reject('Probable MongoDb issue');
        }
    })
}

export async function checkUserNameAvailable(username: string) {
    try {
        const collection = db.collection('users');
        const user = await collection.findOne({username: username.toLowerCase()});
        // console.log(user);
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

export async function search(txt: string, user: string): Promise<Array<object| null>| null> {
    return new Promise(async (resolve, reject)=>{
        const collection = db.collection('users');
        const resultSet = collection.find(
        {$and: [{username: {$ne :user}}, {$or: [{username: txt }, {fullname: txt}]}]})
        .project({_id: false, password: false})    
        .collation({locale: 'en', strength: 2});
        
        var list: Array<object|null>= []
        while(await resultSet.hasNext()) {
            var ob=await resultSet.next()
            
            var conn = await db.collection('connections').findOne({user});
            if(!conn) {
                await db.collection('connections').insertOne({user: user, connections: []})
            }
            conn = await db.collection('connections').findOne({user});
            const connections: Array<string> = conn!.connections
            // console.log(connections.includes(ob!.username));
            
            
            if(connections.includes(ob!.username)) {
                list.push({...ob, status: 'connected'})
            }
            else {
                
                var incoming_req=await db.collection('connect_request')
                .findOne({sender: ob!.username, receiver: user});
                if(incoming_req) {
                    list.push({...ob, status: 'incoming', id: incoming_req._id})

                }
                else {
                    var outgoing = await db.collection('connect_request')
                    .findOne({sender: user, receiver: ob!.username});
                    if(outgoing) {
                        list.push({...ob, status: 'outgoing', id: outgoing._id})
                    }
                    else {
                        list.push({...ob, status: 'none'})
                    }
                }
                

            }

            
        }
        resolve(list)
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

export  function getRequestsData(receiver: string) : Promise<object> {
    return new Promise(async (resolve, reject) => {
        const collection = db.collection('connect_request');
        const l = collection.find({receiver});
        // console.log(await l.next());
        
        var list: Array<object> = [];
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
            
            
            // list.push(await l.next());
            // console.log(list, 'FFF');

        }
        // l.hasNext();
        // console.log('test');
        
        resolve(list);
    })
}


async function connectUsers(u1: string, u2:string) {
    // const db = client.db('demo');

    const collection = db.collection('connections');

    var user;
    user = await collection.findOne({user: u1});
    await collection.updateOne({user: u1}, {$push: {connections: u2}})

    user = await collection.findOne({user: u2});
    await collection.updateOne({user: u2}, {$push: {connections: u1}})

    
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

            const usercollection = db.collection('users')
            var list: any = [];
            
            for (let i = 0; i < connections.length; i++) {
                const username = connections[i];

                const info = await usercollection.findOne({username}, {projection: {username: 1, fullname: 1}});
                
                if(info!=null)  await list.push(info)
            }

            
            

            resolve(list);
        }else reject(null)

    })



}


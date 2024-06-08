import { Collection, MongoClient } from 'mongodb';
import { Connections, Info, Messages } from '../types/db_schema';
import { ConnectionsInChat } from '../types/types_local';

const uri = process.env.MONGO_LOCAL
const client = new MongoClient(uri!);
client.connect();

const db = client.db('demo');
const messagesCollection: Collection<Messages> = db.collection('messages');
const connectionCollection: Collection<Connections> = db.collection('connections');
const userInfoCollection: Collection<Info> = db.collection('info')


export async function getTexts(user1: string, user2: string) {
    const result = await messagesCollection.find(
        { $or: [{ $and: [{ sender: user1 }, { receiver: user2 }] }, { $and: [{ sender: user2 }, { receiver: user1 }] }] }
    ).project({_id: 0}).toArray();
    return result;
}


export async function sendText(msg: Messages) {
    const result = await messagesCollection.insertOne(msg);
    return result.insertedId.toString();
}


export async function getConnections(user: string) {
    var list: ConnectionsInChat[] = [];
    try {
        const result = await connectionCollection.findOne({user}, {projection: {connections: 1}});
        if(result==null) return list;

        const connections: Array<string>  = result.connections
        const promises = connections.map(async (username)=>{
            var info = await userInfoCollection.findOne({username}, {projection: {username: 1, fullname: 1}});
            if(info) {
                const message = (await messagesCollection.find({$or: [{sender: user, receiver: username}, {sender: username, receiver: user}]}).sort({_id: -1}).limit(1).toArray())[0];
                if(message) {
                    list.push({
                        ...info,
                        lastmsg: message.msg,
                        ts: message.ts
                    })
                }else {
                    list.push({
                        ...info,
                        lastmsg: null,
                        ts: '99999999999999'
                    })
                }
            }
        })

        await Promise.all(promises);
        list.sort((a: any, b: any)=>parseInt(b.ts)-parseInt(a.ts))
        return list;
    } catch (error) {
        return list
    }
}
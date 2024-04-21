
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import { resolve } from 'path';


const uri = process.env.MONGO_LOCAL

const client = new MongoClient(uri!);

client.connect();

const db = client.db('demo');
const collection = db.collection('messages');


export function getTexts(user1: string, user2: string) {
    return new Promise(async (resolve, reject)=>{
        const result = collection.find(
            { $or: [{ $and: [{ sender: user1 }, { receiver: user2 }] }, { $and: [{ sender: user2 }, { receiver: user1 }] }] }
        ).project({_id: 0});
        
        var list = []

        while(await result.hasNext()) {
            list.push(await result.next())
        }
        
        resolve(list);
    })
}


export function sendText(msg: object) {
    return new Promise(async (resolve, reject) => {
        const result = await collection.insertOne(msg);
        resolve(result);
    })
}
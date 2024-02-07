import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config();

const uri = process.env.MONGO_WSL ?? 's';
console.log(uri);

const client = new MongoClient(uri);
client.connect();

export async function checkCredentials(data: {username: string, password: string}) {
    try{
        const collection = client.db('demo').collection('users');
        var l = await collection.findOne(data);

        
        return l!=null;
    }catch{

    };
}

export async function signup(data: {username: string, password: string}) : Promise<string> {
    return new Promise(async (resolve, reject)=>{
        try {
            const collection = client.db('demo').collection('users');
            const result = await collection.insertOne(data);
            if (result.acknowledged) {
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
        const collection = client.db('demo').collection('users');
        const user = await collection.findOne({username});
        // console.log(user);
        return user==null;  // username is available
    }catch{};
}

export async function getprofileData(username: string): Promise<object | string > {

    return new Promise(async (resolve, reject)=>{
        const collection = client.db('demo').collection('users');
        const user = await collection.findOne({username});

        resolve(user??"DBERR");
    })

}
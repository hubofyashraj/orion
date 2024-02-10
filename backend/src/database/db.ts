import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcrypt';

dotenv.config();

const uri = process.env.MONGO_LOCAL ?? 's';
console.log(uri);

const client = new MongoClient(uri);
client.connect();

export async function checkCredentials(data: {username: string, password: string}) {
    try{
        const collection = client.db('demo').collection('users');
        
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

export async function signup(data: {username: string, password: string}) : Promise<string> {
    return new Promise(async (resolve, reject)=>{
        try {
            const collection = client.db('demo').collection('users');
        
            var salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password , salt);


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

export async function search(txt: string): Promise<Array<object| null>| null> {
    return new Promise(async (resolve, reject)=>{
        const collection = client.db('demo').collection('users');
        const resultSet = collection.find({$or: [{username: txt}, {fullname: txt}]}).project({_id: false, password: false});

        var list: Array<object|null>= []
        while(await resultSet.hasNext()) {
            list.push(await resultSet.next())
        }

        resolve(list)
    })
}
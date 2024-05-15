import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_LOCAL as string);

client.connect();
const db = client.db('demo');
const collection = db.collection('info');

export interface Info {
    username: string, fullname: string, dob: string, profession: string, 
    location: string, bio: string, gender: string, 
    email: string, contact: string, contact_privacy: boolean
    profile_image: string | null,
}


export function getInfo(user: string) : Promise<Info> {
    return new Promise(async (resolve, reject)=>{
        var res = await collection.findOne({username: user}, {projection: {_id:0}})

        if(res) {
            resolve(res as unknown as Info)
        }
        else reject('user not found ')
    })
}


export function addConnectionStatus(info: Info, user: string, user1: string): Promise<object> {
    return new Promise(
        async (resolve, reject)=>{
            var collection = db.collection('connections');
            var conn = await collection.findOne({user: user1});
            if(!conn) {
                await collection.insertOne({user: user1, connections: []})
            }
            conn = await collection.findOne({user: user1});
            const connections: Array<string> = conn!.connections
            // console.log(connections.includes(ob!.username));
            
            
            if(connections.includes(user)) {
                resolve({info, status: 'connected', id: ''})
            }
            else {
                collection = db.collection('connect_request')
                var incoming_req=await collection.findOne({sender: user, receiver: user1});
                if(incoming_req) {
                    resolve({info, status: 'incoming', id: incoming_req._id})

                }
                else {
                    var outgoing = await collection.findOne({sender: user1, receiver: user});
                    if(outgoing) {
                        resolve({info, status: 'outgoing', id: outgoing._id})
                    }
                    else {
                        resolve({info, status: 'none', id: ''})
                    }
                }
                

            }
        }
    )

}



export function saveInfo(user: string, updatedInfo: any): Promise<void> {
    return new Promise(async (resolve, reject)=>{
        console.log(updatedInfo, 30);
        if(await collection.findOne({username: user}))
            await collection.updateOne({username: user}, {$set: updatedInfo});
        else
            await collection.insertOne(updatedInfo);

        if(updatedInfo.hasOwnProperty('fullname')) {
            var collection1 = db.collection('users');
            await collection1.updateOne({username: user}, {$set: {fullname: updatedInfo['fullname']}})
        }
        resolve()
    })
}

export function saveImage(user: string, image: string): Promise<void> {
    return new Promise(async (resolve, reject)=>{
        await collection.updateOne({username: user}, {$set: {profile_image: image}});
        resolve()
    })
}


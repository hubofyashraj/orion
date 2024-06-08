import { Collection, MongoClient, ObjectId } from "mongodb";
import { readImage } from "../readFile";
import { Info } from '../types/db_schema'
const client = new MongoClient(process.env.MONGO_LOCAL as string);

client.connect();
const db = client.db('demo');
const infoCollection: Collection<Info> = db.collection('info');


export async function getInfo(user: string) {
    var info = await infoCollection.findOne({username: user})
    if(info) return info;
    else throw 'User not found'
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



export async function saveInfo(user: string, updatedInfo: any) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await infoCollection.updateOne({username: user}, {$set: updatedInfo});
        if(updatedInfo.hasOwnProperty('fullname')) {
            await db.collection('users').updateOne({username: user}, {$set: {fullname: updatedInfo.fullname}})
        }
        session.commitTransaction()
    } catch (error) {
        session.abortTransaction();
    } finally {
        session.endSession();
    }
}

export function saveImage(user: string): Promise<void> {
    return new Promise(async (resolve, reject)=>{
        await infoCollection.updateOne({username: user}, {$set: {pfp_uploaded: true}});
        resolve()
    })
}

export type Post = {
    _id?: ObjectId,
    post_user: string,
    post_id: string,
    post_type: 'image' | 'video' | 'text',
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string
}

export async function getUserPosts(user: string) {
    const session = client.startSession();
    type Thumbnail = {
        post_id: string,
        thumbnail: string
    }
    try {
        session.startTransaction();
        const postCollection: Collection<Post> = db.collection('post')
        const posts = await postCollection.find({post_user: user}).toArray();
        const result: Array<Thumbnail> = []
        const promises = posts.map(async (post)=>{
            const thumbnail = await readImage(post.post_id+'-0')
            result.push({post_id: post.post_id, thumbnail})
        })

        await Promise.all(promises);
        session.commitTransaction();

        return result;
    } catch (error) {
        session.abortTransaction();
        throw error
    } finally {
        session.endSession();
    }
}
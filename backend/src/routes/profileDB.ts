import { Collection, MongoClient, ObjectId } from "mongodb";
import { readImage } from "../readFile";
import { ConnectRequest, Connections, Info, UserStats } from '../types/db_schema'
const client = new MongoClient(process.env.MONGO_LOCAL as string);

client.connect();
const db = client.db('demo');
const infoCollection: Collection<Info> = db.collection('info');
const userStatsCollection: Collection<UserStats> = db.collection('user_stats');
const connectionsCollection: Collection<Connections> = db.collection('connections');
const requestsCollection: Collection<ConnectRequest> = db.collection('connect_request');

export async function getInfo(user: string) {
    var info = await infoCollection.findOne({username: user})
    if(info){
        const userStats = await userStatsCollection.findOne({username: user});
        return {
            ...info,
            ...userStats
        }
    }
    else throw 'User not found'
}


export async function addConnectionStatus(info: Info, user: string, user1: string) {
    var conn = await connectionsCollection.findOne({user: user1});
    
    if(!conn) await connectionsCollection.insertOne({user: user1, connections: []})
    conn = await connectionsCollection.findOne({user: user1});
    
    const connections = conn!.connections
    
    if(connections.includes(user)) return ({info, status: 'connected', id: ''})
    else {
        var incoming_req=await requestsCollection.findOne({sender: user, receiver: user1});
        if(incoming_req) return ({info, status: 'incoming', id: incoming_req._id.toString()})
        else {
            var outgoing = await requestsCollection.findOne({sender: user1, receiver: user});
            if(outgoing) return ({info, status: 'outgoing', id: outgoing._id.toString()})
            else return ({info, status: 'none', id: ''})
        }
    }
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
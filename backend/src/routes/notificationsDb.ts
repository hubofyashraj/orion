import {Collection, MongoClient} from 'mongodb';
import { resolve } from 'path';
import { getInfo } from './profileDB';
import { ConnectRequest } from '../types/db_schema';

const client = new MongoClient(process.env.MONGO_LOCAL!);
client.connect()

const db = client.db('demo')
const requestsCollection: Collection<ConnectRequest> = db.collection('connect_request');


interface request {
    req_id: string,
    sender: string
}

export async function getReqObjs(user: string) {
    const requests = await requestsCollection.find({receiver: user}).toArray();
    
    var list = requests.map((request)=>{
        return {
            req_id: request._id.toString(),
            sender: request.sender
        }
    })

    return list
}

export async function getRequests(user: string) {
    const requests = await getReqObjs(user)
    const list = requests.map(async (request)=>{
        try {
            const userInfo = await getInfo(request.sender);
            return {
                ...request,
                fullname: userInfo.fullname,
                user,
                pfp_uploaded: userInfo.pfp_uploaded
            }
        } catch(err) {
            
        }
    })
    await Promise.all(list);
    return (list);
}
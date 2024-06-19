'use server'
import { Match } from "@/backend/src/types/types_local";
import { ObjectId } from "mongodb";
import { collections } from './collections';

const client  = collections.client;
const infoCollection = collections.infoCollection;
const userStatsCollection = collections.userStatsCollection;
const usersCollection = collections.userCollection;
const connectionsCollection = collections.connectionsCollection;
const requestsCollection = collections.connectRequestCollection;


export async function searchUser(keyword: string, user: string) {
    const session = client.startSession();
    try {
        session.startTransaction()
        const resultSet = await usersCollection.find(
            {$and: [
                {username: {$ne :user}}, 
                {$or: [
                    {username: { $regex: `.*${(keyword)}.*`, $options: 'i'} }, 
                    {fullname: { $regex: `.*${(keyword)}.*`, $options: 'i'} }
                ]}
            ]}
        ).toArray()  
        
        var list: Array<Match>= []

        for(const result of resultSet) {
            let obj: Match = {username: result.username, fullname: result.fullname};
            const connections = (await connectionsCollection.findOne({user}))!.connections;
            
            if(connections.includes(obj.username)) {
                obj.status = 'connected';
                list.push(obj);
                continue;
            }

            const incomingReq = await requestsCollection
                .findOne({sender: obj.username, receiver: user});
            
            if(incomingReq) {
                obj.status = 'incoming'
                obj._id = incomingReq._id.toString()
                list.push(obj);
                continue;
            }

            const sentReq = await requestsCollection
                .findOne({sender: user, receiver: obj.username});

            if(sentReq) {
                obj.status = 'outgoing';
                obj._id = sentReq._id.toString();
                list.push(obj);
                continue;
            }

            obj.status = 'none';
            list.push(obj);
        }
        await session.commitTransaction();
        return list

    } catch (err) {
        await session.abortTransaction();
        throw err
    } finally {
        await session.endSession()
    }
}


// server actions to handle connection requests
/**
 * 
 * @param sender 
 * @param receiver 
 * @returns insert id for request document if successfully inserted else false
 */
export async function saveRequestInDb(sender: string, receiver: string) {
    const document = { sender, receiver };
    try {
        const result = await requestsCollection.insertOne(document);
        return result.insertedId.toString()
    } catch (error) {
        console.log('Error while trying to insert request docuemnt', document);
        console.log(error);
    }
    return false        
}

/**
 * 
 * @param req_id request id { insertId for request document }
 * @returns return true or false depending on if the transaction was success
 */
export async function deleteRequestFromDb(req_id: string) {
    try {
        const result = await requestsCollection.deleteOne({_id: new ObjectId(req_id)});
        console.log({result});
        
        return result.acknowledged
    } catch (error) {
        console.log('error while deleting a record from requests collection with _id', req_id);
        console.log(error);
    }
    return false
}

async function connectUsers(u1: string, u2:string, _id: ObjectId) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await connectionsCollection.updateOne({user: u1}, {$push: {connections: u2} })
        await connectionsCollection.updateOne({user: u2}, {$push: {connections: u1} })
        await userStatsCollection.updateOne({username: u1}, {$inc: {connectionsCount: 1}})
        await userStatsCollection.updateOne({username: u2}, {$inc: {connectionsCount: 1}})
        await requestsCollection.deleteOne({_id});
        await session.commitTransaction();
        return true;
    } catch (error) {
        await session.abortTransaction();
        console.log('error occured while trying to connect users', u1, u2);
        console.log(error);
    } finally {
        await session.endSession();
    }
    return false;
}

/**
 * 
 * @param id request id
 * @returns success of transaction
 */
export async function resolveRequestInDb(id: string) {
    const oid=new ObjectId(id)
    try {
        const request = await requestsCollection.findOne({_id: oid});
        if(request) {
            const connected = await connectUsers(request.sender, request.receiver, oid);
            return connected
        }        
    } catch (error) {
        console.log('error while accepting a connection request', id);
        console.log(error);
    }
    return false;
} 

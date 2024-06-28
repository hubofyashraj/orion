'use server'
import { Collection, ObjectId } from "mongodb";
import { collections } from './collections';
const client  = collections.client;
const userStatsCollection = collections.userStatsCollection;
const connectionsCollection: Collection<Connections> = collections.connectionsCollection;
const requestsCollection = collections.connectRequestCollection;
const infoCollection = collections.infoCollection;



export async function getConnectionStatus(username: string, user1: string) {
    try {
        const connections = (await connectionsCollection.findOne({username}))!.connections;
        if(connections.includes(user1)) return {status: 'connected'};

        const incomingReq = await requestsCollection.findOne({sender: user1, receiver: username});
        if(incomingReq) return {status: 'incoming', id: incomingReq._id.toString()}

        const sentReq = await requestsCollection.findOne({sender: username, receiver: user1});
        if(sentReq) return {status: 'outgoing', id: sentReq._id.toString()};

    } catch (error) {

    }
    return  {status: 'none'};

}

export async function searchUser(keyword: string, user: string) {
    const session = client.startSession();
    try {
        session.startTransaction()
        const resultSet = await infoCollection.find(
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
            let obj: Match = {username: result.username, fullname: result.fullname, status: '', hasPFP: result.pfp_uploaded};
            const {status} = await getConnectionStatus(user, result.username)
            obj.status=status;
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
        const u1Cons = (await connectionsCollection.findOne({username: u1}))!.connections
        const u2Cons = (await connectionsCollection.findOne({username: u2}))!.connections
        await connectionsCollection.updateOne({username: u1}, {$set: {connections: [...u1Cons, u2]} })
        await connectionsCollection.updateOne({username: u2}, {$set: {connections: [...u2Cons, u1]} })
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


export async function getRequestsFromDB(receiver: string) {
    try {
        const requests = await requestsCollection.find({receiver}).toArray();
        return requests;
    } catch (error) {
        
        console.log('error while accepting a connection request', receiver);
        console.log(error);
        return [];
    }
}
'use server'
import assert from "assert";
import { collections } from './collections';


const infoCollection         = collections.infoCollection;
const connectionsCollection  = collections.connectionsCollection;
const messagesCollection     = collections.messagesCollection;

export type Connection = {
    username: string,
    fullname: string,
    pfp_uploaded?: boolean,
    lastmsg: Messages | null,
}

export async function getConnections(username: string) {
    try {
        const user = await connectionsCollection.findOne({username: username})
        
        const connections = user?.connections ?? [];
        const list = connections.map( async (connection)=>{
            const info = await infoCollection.findOne({username: connection});
            assert(info);

            let ob: Connection = {
                username: info.username,
                fullname: info.fullname,
                pfp_uploaded: info?.pfp_uploaded,
                lastmsg: null,
            }

            const lastmsg = await messagesCollection
            .find({ 
                $or: [ {sender: username, receiver: connection}, 
                    {sender: connection, receiver: username} ]
                }, {projection: {_id: 0}, sort: { ts: -1 }, limit: 1}
            ).toArray();
            
            

            if(lastmsg.length) ob.lastmsg = lastmsg[0];
            return ob;
        })
        if(!list) return [];
        const result = await Promise.all(list)
        return result;

    } catch (error) {
        console.log('error while reading connections of user', username);
        console.log(error);
        return []
    }
}


export async function getMessagesFromDb(user1: string, user2: string) {
    try {
        const messages = await messagesCollection.find({
            $or: [
                {sender: user1, receiver: user2},
                {sender: user2, receiver: user1}
            ]
        }, { projection: { _id : 0} }).toArray();

        return messages;
    } catch (error) {
        console.log('error while reading messages for users ', user1, user2);
        console.log(error);
        return []
    }
}


export async function insertMessage(message: Messages) {
    try {
        const inserted = await messagesCollection.insertOne(message);
        return inserted.acknowledged;
    } catch (error) {
        console.log('error while inserting message, ', message);
        console.log(error); 
        return false;   
    }
}

export async function readMessages(sender: string, receiver: string) {
    try {
        const result = await messagesCollection.updateMany({sender, receiver, unread: true}, {$set: {unread: false}});
        return result.modifiedCount;
    } catch (error) {
        console.log('error when setting messages to read', sender, receiver);
        console.log(error);
        return 0;
    }
}
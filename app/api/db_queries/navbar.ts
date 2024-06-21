'use server'
import { collections } from "./collections"

const requestsCollection = collections.connectRequestCollection;

export async function readConnectRequestsFromDb(user: string) {
    try {
        const requests = await requestsCollection.find({receiver: user}).toArray();
        const requestAlerts = requests.map(request => {return {from: request.sender, fullname: 'Placeholder'}})
        return requestAlerts;
    
    } catch (error) {
        console.error('while reading requests from db for user:', user);
        console.error(error);
    }
    return [];
}


export async function readRequestId(sender: string, receiver: string) {
    try {
        const request = await requestsCollection.findOne({sender, receiver});
        return request?._id.toString();
    
    } catch (error) {
        console.error('while reading request id from db for :', {sender, receiver});
        console.error(error);
    }
}
'use server'

import { connectRequestRepository } from "../repositories/connectrequest.repository";

export async function readConnectRequestsFromDb(user: string) {
    return await connectRequestRepository.findIncomingRequests(user);
}


export async function readRequestId(sender: string, receiver: string) {
    return await connectRequestRepository.getRequestID(sender, receiver);
}
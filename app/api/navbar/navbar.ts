'use server'
import { validSession } from "../auth/authentication";
import { readConnectRequestsFromDb, readRequestId } from "../db_queries/navbar";
import { acceptRequest, cancelRequest } from "../search/search";


export async function fetchConnectRequests() {
    const {user, status} = await validSession();
    if(status==401) return [];

    const requests = await readConnectRequestsFromDb(user!);
    return requests;
}


export async function acceptRequestFromUser(sender: string) {
    const {user, status} = await validSession();
    if(status==401) return false;

    const req_id = await readRequestId(sender, user!);
    if(!req_id) return false;

    const result = await acceptRequest(req_id);
    return result;
}

export async function rejectRequestFromUser(sender: string) {
    const {user, status} = await validSession();
    if(status==401) return false;

    const req_id = await readRequestId(sender, user!);
    if(!req_id) return false;

    const result = await cancelRequest(req_id);
    return result;
}


'use server';

import { validSession } from "../auth/authentication";
import { deleteRequestFromDb, resolveRequestInDb, saveRequestInDb, searchUser } from "../db_queries/search";
import { fetchInfo } from "../profile/profile";
import { sendEvent } from "@/app/utils/server-only";


export async function searchUsers(keyword: string) {
    const {status, user} = await validSession();
    if(status==401) return;
    try {
        const users = await searchUser(keyword, user!);

        return users;
    } catch(error) {
        return [];
    }
}

export async function sendRequest(receiver: string) {
    const {status, user} = await validSession();
    if(status==401) return false;
    const req_id = await saveRequestInDb(user!, receiver);
    if(req_id) {
        const info = JSON.parse((await fetchInfo())!) as ProfileInfo
        const event = {
            type: 'alert',
            payload: {
                from: user,
                fullname: info.fullname,
            }
        }
        sendEvent(receiver, event)
    
    }
    return req_id;
}

export async function cancelRequest(req_id: string) {
    const {status} = await validSession();
    if(status==401) return false;
    const result = await deleteRequestFromDb(req_id);
    return result;
}

export async function acceptRequest(req_id: string) {
    const {status}= await validSession();
    if(status==401) return false;
    const result = await resolveRequestInDb(req_id);
    return result;
}
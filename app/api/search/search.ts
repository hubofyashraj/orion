'use server';

import axios from "axios";
import { validSession } from "../actions/authentication";
import { deleteRequestFromDb, resolveRequestInDb, saveRequestInDb, searchUser } from "../db_queries/search";
import { fetchInfo } from "../profile/profile";

const address = process.env.express_uri as string;

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
        axios.post(address+'/sse/sendAlert?user='+user, {alert: {
            type: 'request',
            content: {
                from: user,
                fullname: info.fullname,
                to: receiver,
            }
        }})
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
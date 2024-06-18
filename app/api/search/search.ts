'use server';

import axios from "axios";
import { validSession } from "../actions/authentication";
import { deleteRequestFromDb, resolveRequestInDb, saveRequestInDb, searchUser } from "../db_queries/search";
import { address } from "../api";
import { fetchInfo } from "../profile/profile";

export async function searchUsers(keyword: string) {
    const username = await validSession();
    if(!username) return;
    try {
        const users = await searchUser(keyword, username);
        return users;
    } catch(error) {
        return [];
    }
}

export async function sendRequest(user: string) {
    const self = await validSession();
    if(self) {
        const req_id = await saveRequestInDb(self, user);
        if(req_id) {
            const info = JSON.parse((await fetchInfo())!) as ProfileInfo
            axios.post(address+'/sse/sendAlert?user='+self, {alert: {
                type: 'request',
                content: {
                    from: self,
                    fullname: info.fullname,
                    to: user,
                }
            }})        }
        return req_id;
    }
    return false;
}

export async function cancelRequest(req_id: string) {
    const self = await validSession();
    if(self) {
        const result = await deleteRequestFromDb(req_id);
        return result;
    }
    return false;
}

export async function acceptRequest(req_id: string) {
    const self = await validSession();
    if(self) {
        const result = await resolveRequestInDb(req_id);
        return result;
    }
    return false;
}
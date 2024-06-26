'use server';

import { getInfo, hasPFP, saveInfo } from "@/app/api/db_queries/profile";
import { getToken } from "../auth/cookie_store";
import axios from "axios";
import { validSession } from "../auth/authentication";
import redis, { redisInit } from "../redis/redis_client";
import { savePFP } from "@/app/utils/imageUploads";
import { getConnectionStatus } from "../db_queries/search";


/**
 * 
 * @param user passed only when searching for another user
 * @returns info, fetches info from database and returns undefined if info not present
 */
export async function fetchInfo(searchUser?: string | null) {
    const {user, status} = await validSession();
    if(status==401) return;
    {
    const info = await getInfo(searchUser??user!)
    const {status, id} = await getConnectionStatus(user!, info!.username)
    return JSON.stringify({...info, status, id})}
}

/**
 * 
 * @param updatedInfo info that has changed
 * @returns true or false depending on success of update operation
 */
export async function updateInfo(  updatedInfo: {
    [key: string]: string | Blob | boolean | null 
}) {
    const {user, status} = await validSession();
    if(status==401) return false;
    const result = await saveInfo(user!, updatedInfo);
    return result;
}



export async function uploadPFP(formData: FormData) {
    const token = await getToken();
    const {status, user} = await validSession();
    if(token) {
        try {
            const updatedInfo = { pfp_uploaded: true }
            const result = await savePFP(formData.get('file') as File, user!)
            if(result) {
                updateInfo(updatedInfo)
                return true;
            } else return false;
        } catch ( error ) { throw error }
    } else {
        return false;
    }
}
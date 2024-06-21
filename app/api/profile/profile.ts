'use server';

import { getInfo, hasPFP, saveInfo } from "@/app/api/db_queries/profile";
import { getToken } from "../actions/cookie_store";
import axios from "axios";
import { validSession } from "../actions/authentication";
import redis from "../redis/redis_client";

const address = process.env.express_uri as string

/**
 * 
 * @param user passed only when searching for another user
 * @returns info, fetches info from database and returns undefined if info not present
 */
export async function fetchInfo(searchUser?: string) {
    const {user, status} = await validSession();
    if(status==401) return;
    const info = getInfo(searchUser??user!)
    return info
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

/**
 * fetches profilepicture from express server
 * @param username 
 * @returns base64 image if present else empty string
 */
export async function fetchPFP(username?: string) {

    try {
        const {user, status} = await validSession();
        if(status==401) return '';
        
        if(!hasPFP(username??user!)) return '';

        const cachedPfp = await redis.hget('pfp', username??user!);
        if(cachedPfp) return cachedPfp;

        axios.defaults.headers.common['Authorization'] = `Bearer ${await getToken()}`
        const result: {data: {success: boolean, image: string}} = await axios.get( address + '/profile/fetchPFP'+(username?'?user='+username:'') )
        if(result.data.success) {
            await redis.hset('pfp', username??user!, result.data.image);
            return result.data.image;
        }
    } catch (error) {
        console.log('error while fetching pfp ',error);
    }
    
    return ''

}


export async function uploadPFP(formData: FormData) {
    const token = await getToken();
    if(token) {
        try {
            const updatedInfo = { pfp_uploaded: true }
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            const result = await axios.post( address + '/profile/savePFP', formData )
            
            if(result.data.success) {
                updateInfo(updatedInfo)
                return true;
            } else return false;
        } catch ( error ) { throw error }
    } else {
        return false;
    }
}
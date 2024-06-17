'use server';

import { getInfo, saveInfo } from "@/app/api/db_queries/profile";
import { getToken } from "../actions/cookie_store";
import { verify, JwtPayload } from 'jsonwebtoken'
import axios from "axios";
import { address } from "../api";
import { validSession } from "../actions/authentication";
import { redirect } from "next/navigation";
import redis from "../redis/redis_client";

/**
 * 
 * @param user passed only when searching for another user
 * @returns info, fetches info from database and returns undefined if info not present
 */
export async function fetchInfo(user?: string) {
    const username = user??await validSession();
    if(username) {
        try {
            const info = getInfo(username)
            return info
        } catch ( error ) { }
    }
}

/**
 * 
 * @param updatedInfo info that has changed
 * @returns true or false depending on success of update operation
 */
export async function updateInfo(  updatedInfo: {
    [key: string]: string | Blob | boolean | null 
}) {
    const username = await validSession();
    if(username) {
        const result = await saveInfo(username, updatedInfo);
        return result;
    }
    return false;
}

/**
 * fetches profilepicture from express server
 * @param username 
 * @returns base64 image if present else empty string
 */
export async function fetchPFP(username?: string) {

    try {
        const self = await validSession();
        if(!self) return '';
        
        const cachedPfp = await redis.hget('pfp', username??self);
        if(cachedPfp) return cachedPfp;

        axios.defaults.headers.common['Authorization'] = `Bearer ${await getToken()}`
        const result: {data: {success: boolean, image: string}} = await axios.get( address + '/profile/fetchPFP'+(username?'?user='+username:'') )
        if(result.data.success) {
            await redis.hset('pfp', username??self, result.data.image);
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
        redirect('/auth')
    }
}
import axios from "axios";
import { address } from "../api";
import { getToken } from "../actions/cookie_store";

export async function getMyPosts(user: string) {
    try {
        const token = await getToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        const result = await axios.get( address+'/profile/fetchUserPosts' )
        if(result.data.success) return result.data.posts
    } catch (error) {    
        console.log(error);
        
    }
    return false
}
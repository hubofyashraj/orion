'use server';
import { validSession } from "../actions/authentication";
import { getToken } from "../actions/cookie_store";
import { address } from "../api";
import { uploadPostData } from "../db_queries/create";


export async function createPost(formData: FormData) {
    const user = await validSession();
    if(!user) return false;
    const token = await getToken();
    try {
        const post_id = user+Date.now();
        formData.append('post_id', post_id);
        const result = await fetch( address+'/post/upload', 
        { 
            body: formData, 
            method: 'POST', 
            headers: { 
                'Authorization': token!
            } 
        })
        
        const json = await result.json();
        console.log(json);
        
        if(json.success) {
            const result = await uploadPostData({
                post_id, 
                post_user: user, 
                post_type: formData.get('type')!.toString(), 
                post_caption: formData.get('caption')!.toString(), 
                post_length: parseInt(formData.get('length')!.toString()) })
            return true;
        }
        else console.error('Server Issue', json.reason);

    } catch (error) {
        console.log('error while uploading post photot');
        console.log(error);
    }
    return false;
}
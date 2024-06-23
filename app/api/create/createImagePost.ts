'use server';
import { validSession } from "../auth/authentication";
import { getToken } from "../auth/cookie_store";
import { deletePostData, uploadPostData } from "../db_queries/create";


const address = process.env.express_uri as string

export async function createPost(formData: FormData) {
    const {user, status} = await validSession();
    if(status==401) return false;
    
    const token = await getToken();
    try {
        const post_id = user!+Date.now();
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
                post_user: user!, 
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


export async function deletePost(post_id: string) {
    const token = await getToken();
    if(token) {
        const result  = await deletePostData(post_id);
        if(result) {
            fetch(address+'/post/deletePost?post_id='+post_id,
                { 
                    headers: { 
                        'Authorization': token!
                    } 
                }
            )
            return true;
        }
    
    } else return false;
}
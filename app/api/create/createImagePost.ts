'use server';
import { deleteImage, saveImages } from "@/app/utils/imageUploads";
import { validSession } from "../auth/authentication";
import { getToken } from "../auth/cookie_store";
import { deletePostData, uploadPostData } from "../db_queries/create";
import { getPostFromDb } from "../db_queries/feed";



export async function createPost(formData: FormData) {
    const {user, status} = await validSession();
    if(status==401) return false;
    
    const token = await getToken();
    try {
        const post_id = user!+Date.now();
        formData.append('post_id', post_id);

        const result = await saveImages(formData);

        
        if(result) {
            try {
                await uploadPostData({
                    post_id, 
                    post_user: user!, 
                    post_type: formData.get('type')!.toString(), 
                    post_caption: formData.get('caption')!.toString(), 
                    post_length: parseInt(formData.get('length')!.toString()) }
                )
                return true;
            } catch (error) {
                return false;                
            }
        }
        else console.error('Server Issue');

    } catch (error) {
        console.log('error while uploading post photot');
        console.log(error);
    }
    return false;
}


export async function deletePost(post_id: string) {
    const token = await getToken();
    if(token) {
        const post = await getPostFromDb(post_id);
        if(!post) return true;
        for(var i=0; i<post.post_length; i++) {
            deleteImage(post_id+'-'+i);
        }

        const result  = await deletePostData(post_id);
        return result;
    } else return false;
}
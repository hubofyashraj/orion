'use server'
import { validSession } from "../auth/authentication";
import { getCommentsFromDb, getPostFromDb, getPostStats, getPostsFromDB, removeCommentFromDb, saveCommentToDB, toggleLikeInDB, toggleSaveInDB } from "../db_queries/feed";
import { sendEvent } from "@/app/utils/server-only";


export async function fetchPosts() {
    const {status} = await validSession();
    if(status==401) return; 

    const posts = await getPostsFromDB();
    if(!posts) return;
    return JSON.stringify({posts});

}

export async function fetchPost(post_id: string) {
    const post = await getPostFromDb(post_id);    
    if(post) return JSON.stringify(post);
    else return false;
} 

export async function fetchPostStats(post_id: string) {
    const {status} = await validSession();
    if(status==401) return;
    const stats = await getPostStats(post_id);
    if(!stats) return;
    return JSON.stringify(stats);
} 

type Notification = {
    post_id: string;
    post_user: string;
    liked_by?: string;
    comment_by?: string;
};

type ConnectionRequest = {
    sender: string;
    sender_name: string;
    receiver: string;
}

type Alert = {
    type: string;
    content: Notification | ConnectionRequest;
}

export async function togglePostLike(post_id: string, post_user: string, current: boolean) {
    const {user, status} = await validSession();
    if(status==401) return false;
    const result =  await toggleLikeInDB(post_id, user!, current);
    if(result && !current && user!=post_user) {

        const event = {
            type: 'alert', 
            payload: {
                from: user,
                post_id: post_id,
                type: 'like'
            }
        }

        sendEvent(post_user, event)
        
    }
    return result;
}  



export async function togglePostSave(post_id: string, current: boolean) {
    const {user, status} = await validSession();
    if(status==401) return false;
    return await toggleSaveInDB(post_id, user!, current);
}  


export async function fetchComments(post_id: string) {
    await validSession();
    const comments = await getCommentsFromDb(post_id);
    return JSON.stringify({comments});
}


export async function sendComment(comment: PostComments) {
    const {user, status} = await validSession();
    if(status==401) return false;
    const comment_id = user+comment.post_id+Date.now();

    const obj: PostComments = {
        ...comment,
        comment_id: comment_id,
        comment_by: user!,
        sending: false
    }

    const result  = await saveCommentToDB(obj);
    if(result && user!=comment.post_user) {
        const event = {
            type: 'alert', 
            payload: {
                from: user,
                post_id: comment.post_id,
                type: 'comment'
            }
        }

        sendEvent(comment.post_user, event)

    }
    return result?JSON.stringify(obj):false;

}


export async function deleteComment(comment_id: string, comment_by: string, post_user: string) {
    const {user, status} = await validSession();
    if(status==401) return false;

    if(user==post_user || user==comment_by) {
        const result   = removeCommentFromDb(comment_id);
        return result;
    }
    return false;
}
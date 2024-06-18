'use server'
import axios from "axios";
import { validSession } from "../actions/authentication";
import { getCommentsFromDb, getPostStats, getPostsFromDB, removeCommentFromDb, saveCommentToDB, toggleLikeInDB, toggleSaveInDB } from "../db_queries/feed";
import { fetchPFP } from "../profile/profile";
import { address } from "../api";







export async function fetchPosts() {
    const user = await validSession();
    if(!user) return; 

    const posts = await getPostsFromDB();
    if(!posts) return;
    return JSON.stringify({posts});

}


export async function fetchPostStats(post_id: string) {
    const user = await validSession();
    if(!user) return;
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
    const user = await validSession();
    if(user) {
        const result =  await toggleLikeInDB(post_id, user, current);
        if(result) {
            axios.post(address+'/sse/sendAlert?user='+user, {alert: {
                type: 'notification',
                content: {
                    post_id,
                    post_user,
                    liked_by: user
                }
            }})
        }
        return result;
    }
    return false;
}  



export async function togglePostSave(post_id: string, current: boolean) {
    const user = await validSession();
    if(user) {
        return await toggleSaveInDB(post_id, user, current);
    }
    return false;
}  


export async function fetchComments(post_id: string) {
    await validSession();
    const comments = await getCommentsFromDb(post_id);
    return JSON.stringify({comments});
}


export async function sendComment(comment: PostComments) {
    const self = await validSession();
    if(!self) return false;
    const comment_id = self+comment.post_id+Date.now();

    const obj: PostComments = {
        ...comment,
        comment_id: comment_id,
        comment_by: self,
        sending: false
    }

    const result  = await saveCommentToDB(obj);
    if(result && self!=comment.post_user) {
        axios.post(address+'/sse/sendAlert?user='+self, {alert: {
            type: 'notification',
            content: {
                post_id: comment.post_id,
                post_user: comment.post_user,
                comment_by: self
            }
        }})
    }
    return result?JSON.stringify(obj):false;

}


export async function deleteComment(comment_id: string, comment_by: string, post_user: string) {
    const self = await validSession();
    if(!self) return false;

    if(self==post_user || self==comment_by) {
        const result   = removeCommentFromDb(comment_id);
        return result;
    }
    return false;
}
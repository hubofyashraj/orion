'use server'
import { validSession } from "../actions/authentication";
import { getCommentsFromDb, getPostStats, getPostsFromDB, saveCommentToDB, toggleLikeInDB, toggleSaveInDB } from "../db_queries/feed";
import { fetchPFP } from "../profile/profile";







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


export async function togglePostLike(post_id: string, current: boolean) {
    const user = await validSession();
    if(user) {
        return await toggleLikeInDB(post_id, user, current);
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
    return result?JSON.stringify(obj):false;

}

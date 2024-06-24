'use server';
import { PullOperator, PushOperator } from "mongodb";
import { validSession } from "../auth/authentication";
import { collections } from './collections';


const client = collections.client;
const postCollection = collections.postCollection;
const postStatsCollection = collections.postStatsCollection;
const postOptions = collections.postOptionsCollection;
const connectionsCollection = collections.connectionsCollection;
const commentsCollection = collections.postCommentsCollection;


const postSortComparator = (a: Post,b: Post) => {
    const tsa = parseInt(a.post_id.replace(a.post_user, ''));
    const tsb = parseInt(b.post_id.replace(b.post_user, ''));
    return tsa-tsb;
}

export async function getPostsFromDB() {
    const {user, status} = await validSession();
    if(status==401) return;

    const document = await connectionsCollection.findOne({username: user})
    const connections = document?.connections;

    const posts: Post[] = [];

    const promises  = connections?.map(async (connection) => {
        const userposts = await getPostsOfUser(connection, false);
        posts.push(...userposts);
    })

    if(promises) await Promise.all(promises);

    posts.sort(postSortComparator)

    return posts;
}

export async function getPostFromDb(post_id: string) {
    try {
        const post = await postCollection.findOne({post_id});
        return post;
    } catch (error) {
        console.log('error while reading post data from db, postid: ',post_id);
        console.log(error);
    }
    return false;
}

export async function getPostsOfUser(user: string, sorted: boolean) {
    const posts = await postCollection.find({post_user: user}).toArray();
    if(!sorted) return posts;

    posts.sort(postSortComparator)

    return posts;
}



export async function getPostStats(post_id: string) {
    const {user, status} = await validSession();
    if(status==401) return;
    const stats = await postStatsCollection.findOne({post_id});
    const options = await postOptions.findOne({post_id});
    const selfStats = {
        liked: options?.post_liked_by.indexOf(user!)!=-1,
        saved: options?.post_saved_by.indexOf(user!)!=-1
    }
    return {
        stats,
        selfStats,
    }
}

export async function toggleLikeInDB(post_id: string, user: string, current: boolean) {
    const session = client.startSession();
    try {
        session.startTransaction();

        if(current) {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_likes_count: -1}}, {session});
            const likedby = (await postOptions.findOne({post_id: post_id}))!.post_liked_by;
            await postOptions.updateOne({post_id}, {$set: {post_saved_by: likedby.filter((userInArray) => userInArray!=user)}});
        } else {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_likes_count: 1}}, {session});
            const likedby = (await postOptions.findOne({post_id: post_id}))!.post_liked_by;
            await postOptions.updateOne({post_id}, {$set: {post_saved_by: likedby.filter((userInArray) => userInArray!=user)}});
        }
        await session.commitTransaction();
        return true;
    } catch (error) {
        console.log({error});
        
        await session.abortTransaction();        
        return false;
    } finally {
        await session.endSession();
    }
    
}

export async function toggleSaveInDB(post_id: string, user: string, current: boolean) {
    const session = client.startSession();
    try {
        session.startTransaction();
        if(current) {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_save_count: -1}});
            const savedby = (await postOptions.findOne({post_id: post_id}))!.post_saved_by;
            await postOptions.updateOne({post_id}, {$set: {post_saved_by: savedby.filter((userInArray) => userInArray!=user)}});
        } else {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_save_count: 1}});
            const savedby = (await postOptions.findOne({post_id: post_id}))!.post_saved_by;
            await postOptions.updateOne({post_id}, {$set: {post_saved_by: [...savedby, user]}});
        }
        await session.commitTransaction();
        return true;
    } catch (error) {
        await session.abortTransaction();        
        return false;
    } finally {
        await session.endSession();
    }
    
}


export async function getCommentsFromDb(post_id: string) {
    try {
        const comments = await commentsCollection.find({post_id}).toArray();
        return comments;
    } catch (error) {
        console.error('while fetching comments for post', post_id);
        console.error(error);
    }
}

export async function saveCommentToDB(comment: PostComments) {
    try {
        const result = await commentsCollection.insertOne(comment);
        return result.acknowledged;
    } catch (error) {
        console.error('while inserting comment ', comment);
        console.error(error);
    }

    return false;
}

export async function removeCommentFromDb(comment_id: string) {
    try {
        const result = await commentsCollection.deleteOne({comment_id});
        if(result.acknowledged && result.deletedCount==1) return true;
    } catch (error) {
        console.error('while deleting comment from db:', comment_id);
        console.error(error);
    }
    return false;
}
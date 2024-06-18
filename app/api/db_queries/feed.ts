'use server';
import { validSession } from "../actions/authentication";
import { collections } from './collections';


const client = collections.client;
const postCollection = collections.postCollection;
const postStatsCollection = collections.postStatsCollection;
const postOptions = collections.postOptionsCollection;
const userCollection = collections.userCollection;
const connectionsCollection = collections.connectionsCollection;
const commentsCollection = collections.postCommentsCollection;


const postSortComparator = (a: Post,b: Post) => {
    const tsa = parseInt(a.post_id.replace(a.post_user, ''));
    const tsb = parseInt(b.post_id.replace(b.post_user, ''));
    return tsa-tsb;
}

export async function getPostsFromDB() {
    const self = await validSession();
    if(!self) return;

    const document = await connectionsCollection.findOne({user: self})
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


export async function getPostsOfUser(user: string, sorted: boolean) {
    const posts = await postCollection.find({post_user: user}).toArray();
    if(!sorted) return posts;

    posts.sort(postSortComparator)

    return posts;
}



export async function getPostStats(post_id: string) {
    const self = await validSession();
    if(!self) return;
    const stats = await postStatsCollection.findOne({post_id});
    const options = await postOptions.findOne({post_id});
    const selfStats = {
        liked: options?.post_liked_by.indexOf(self)!=-1,
        saved: options?.post_saved_by.indexOf(self)!=-1
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
            await postStatsCollection.updateOne({post_id}, {$inc: {post_likes_count: -1}});
            await postOptions.updateOne({post_id}, {$pull: {post_liked_by: user}});
        } else {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_likes_count: 1}});
            await postOptions.updateOne({post_id}, {$push: {post_liked_by: user}});
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

export async function toggleSaveInDB(post_id: string, user: string, current: boolean) {
    const session = client.startSession();
    try {
        session.startTransaction();
        if(current) {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_save_count: -1}});
            await postOptions.updateOne({post_id}, {$pull: {post_saved_by: user}});
        } else {
            await postStatsCollection.updateOne({post_id}, {$inc: {post_save_count: 1}});
            await postOptions.updateOne({post_id}, {$push: {post_saved_by: user}});
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
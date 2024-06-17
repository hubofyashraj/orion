import getCollections from "./collections";
import { collections } from './collections';

const client = collections.client;
const postsCollection = collections.postCollection;
const postStatsCollection = collections.postStatsCollection;
const postOptionsCollection = collections.postOptionsCollection;
const postCommentsCollection = collections.postCommentsCollection;
const userStatsCollection = collections.userStatsCollection;
const connectionsCollection = collections.connectionsCollection;

interface PostProps {
    post_id: string, 
    post_user: string, 
    post_type: string, 
    post_length: number, 
    post_caption: string, 
}

export async function uploadPostData({ post_id, post_user, post_type, post_length, post_caption }: PostProps){
    const session = client.startSession()
    try{
        session.startTransaction();

        const post: Post = {
            post_user,
            post_id,
            post_type,
            post_length,
            post_caption
        }

        const post_stats: PostStats = {
            post_id,
            post_comments_count: 0,
            post_likes_count: 0,
            post_save_count: 0,
        }

        const post_options: PostOptions = {
            post_id,
            post_liked_by: [],
            post_saved_by: []
        }

        await postsCollection.insertOne(post);
        await postStatsCollection.insertOne(post_stats);
        await postOptionsCollection.insertOne(post_options);
        await userStatsCollection.updateOne({username: post_user}, {$inc: {postsCount: 1}});

        await session.commitTransaction();
        return ({post_id})
    } catch (err) {
        console.error(err);
        await session.abortTransaction();
        throw ({err: 'DBMS err'})
    } finally {
        session.endSession();
    }
    
}


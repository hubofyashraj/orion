import {  getPostCollection, getPostOptionsCollection, getPostStatsCollection, getUserStatsCollection, get_client } from './collections';


interface PostProps {
    post_id: string, 
    post_user: string, 
    post_type: string, 
    post_length: number, 
    post_caption: string, 
}

export async function uploadPostData({ post_id, post_user, post_type, post_length, post_caption }: PostProps){
    const client = await get_client();
    const postsCollection = await getPostCollection();
    const postStatsCollection = await getPostStatsCollection();
    const postOptionsCollection = await getPostOptionsCollection();
    const userStatsCollection = await getUserStatsCollection();

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

export async function deletePostData(post_id: string) {
    const client = await get_client();
    const postsCollection = await getPostCollection();
    const postStatsCollection = await getPostStatsCollection();
    const postOptionsCollection = await getPostOptionsCollection();
    const userStatsCollection = await getUserStatsCollection();
    
    const session  = client.startSession();
    try {
        session.startTransaction();
        const post = await postsCollection.findOne({post_id});
        if(post) {
            await postsCollection.deleteOne({post_id});
            await postStatsCollection.deleteOne({post_id});
            await postOptionsCollection.deleteOne({post_id});
            await userStatsCollection.updateOne({username: post.post_user}, {$inc: {postsCount: -1}});    
        }
        await session.commitTransaction();
        return true;
    } catch(error) {
        await session.abortTransaction();
        console.error('while deleting post data from db, post_id:', post_id);
        console.error(error);
        
    } finally {
        await session.endSession();
    }
    return false;
}
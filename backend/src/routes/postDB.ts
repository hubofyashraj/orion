import { MongoClient } from "mongodb";
import { Collection } from "mongodb";
import { readImage } from "../readFile";
import { Connections, Post, PostComments, PostOptions, PostStats, User, UserStats } from "../types/db_schema";

const client = new MongoClient(process.env.MONGO_LOCAL as string);

client.connect();

const db = client.db('demo');
const collection: Collection<Post> = db.collection('post');
const postStatsCollection: Collection<PostStats> = db.collection('post_stats');
const postOptionsCollection: Collection<PostOptions> = db.collection('post_options');
const postCommentsCollection: Collection<PostComments> = db.collection('post_comments');
const userStatsCollection: Collection<UserStats> = db.collection('user_stats');
const connectionsCollection: Collection<Connections> = db.collection('connections');

interface Data {post_user: string, type: 'image' | 'video' | 'text', length: number, caption: string, ts: number}

export async function upload(body: Data){
    const session = client.startSession()
    try{
        session.startTransaction();
        const post_id = body.post_user+body.ts;

        const post: Post = {
            post_user: body.post_user,
            post_id,
            post_type: body.type,
            post_length: body.length,
            post_caption: body.caption
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

        await collection.insertOne(post);
        await postStatsCollection.insertOne(post_stats);
        await postOptionsCollection.insertOne(post_options);
        await userStatsCollection.updateOne({username: body.post_user}, {$inc: {postsCount: 1}});

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


export async function fetchRecentPosts(user: string, sorted: boolean){
    let posts = await collection.find({post_user: user}).project({post_id: 1, post_user: 1, post_type: 1}).toArray()
    
    var list = posts.map((post)=>{
        return {post_id: post.post_id, post_user: post.post_user, post_type: post.post_type}
    })

    if(!sorted) return (list)
 
    list.sort((a,b)=>{
        let id1 = a.post_id.replace(user,'')
        let id2 = b.post_id.replace(user,'')
        return parseInt(id1)-parseInt(id2)
    })

    return (list)
}


export async function fetchPosts(user: string) {
    
        const connections = (await connectionsCollection.findOne({user}))!.connections
        if(connections.length) {
            let list: {
                post_id: any;
                post_user: any;
                post_type: any;
            }[] = []
            let promises = connections.map(async (connection)=>{
                const usersPosts = await fetchRecentPosts(connection, false);
                list.push(...usersPosts)
            })
            
            await Promise.all(promises)
            list.sort((a,b)=>{
                let id1 = a.post_id.replace(a.post_user,'')
                let id2 = b.post_id.replace(b.post_user,'')
                return parseInt(id1)-parseInt(id2)
            })

            return list

        }else {
            return []
        }
}

export async function likePost(post_id: string, liked_by: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_likes_count: 1}},
            {session}
        )
        await postOptionsCollection.findOneAndUpdate(
            {post_id},
            {$push: { post_liked_by: liked_by} },
            {session}
        )
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

export async function unlikePost(post_id: string, liked_by: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_likes_count: -1}},
            {session}
        )
        await postOptionsCollection.findOneAndUpdate(
            {post_id},
            {$pull: { post_liked_by: liked_by} },
            {session}
        )
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

export async function savePost(post_id: string, saved_by: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_save_count: 1}},
            {session}
        )

        await postOptionsCollection.findOneAndUpdate(
            {post_id},
            {$push: { post_saved_by: saved_by} },
            {session}
        )
        await session.commitTransaction();
    } catch (err) {
        console.log(err);
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
    
}

export async function unsavePost(post_id: string, saved_by: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_save_count: -1}},
            {session}
        )

        await postOptionsCollection.findOneAndUpdate(
            {post_id},
            {$pull: { post_saved_by: saved_by} },
            {session}
        )
        await session.commitTransaction();

    } catch (err) {
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

export async function addNewComment(post_id: string, comment_by: string, comment: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_comments_count: 1}},
            {session}
        )
        
        await postCommentsCollection.insertOne(
            {comment_id: post_id+Date.now(), post_id, post_comment_by: comment_by, post_comment: comment }
        )
        await session.commitTransaction();

    } catch (err) {
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

export async function deleteComment(post_id: string, comment_id: string, comment_by: string) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await postStatsCollection.findOneAndUpdate(
            {post_id}, 
            {$inc: {post_comments_count: -1}},
            {session}
        )
        
        await postCommentsCollection.deleteOne(
            { post_id, comment_id , post_comment_by: comment_by }
        )
        await session.commitTransaction();
    } catch (err) {
        await session.abortTransaction()
    } finally {
        await session.endSession()
    }
}

export async function fetchComments(post_id: string) {
    let list =  await postCommentsCollection.find({post_id}).toArray()
    list.sort((a,b)=>parseInt(b.comment_id.replace(a.post_id, ''))-parseInt(a.comment_id.replace(a.post_id, '')))
    return (list)
}


export async function fetchPost(post_id: string, cur_user: string) {
    const session = client.startSession()
    try {
        session.startTransaction();
        
        const post = await collection.findOne({post_id})
        if(!post) throw new Error("Incorrect Post ID");
        post.post_content=new Array<string>();
        const promises=[]
        for(let i =0; i<post.post_length; i++) {
            const file_name = post.post_id+'-'+i
            promises.push(readImage(file_name).then((imgsrc)=>post.post_content?.push(imgsrc))
                .catch((err)=>{}))
            
        }

        const stats = (await postStatsCollection.findOne({post_id}))!;
        
        const options = (await postOptionsCollection.findOne({post_id}))!;

        const secondaryStats = {
            liked: options.post_liked_by.includes(cur_user),
            saved: options.post_saved_by.includes(cur_user)
        }
        
        const pfp = await readImage(post.post_user, 'pfp')

        await session.commitTransaction();
        await Promise.all(promises)
        return {success: true, post, stats, secondaryStats, pfp}
    } catch (err) {
        session.abortTransaction();
        throw ({success: false, reason: 'DBMS err'})
    } finally {
        session.endSession();
    }
}

export async function deletePost(post_id: string) {
    const session = client.startSession()
    try {
        session.startTransaction();
        
        const post = await collection.findOne({post_id});

        await collection.deleteOne({post_id});
        await postStatsCollection.deleteOne({post_id});
        await postOptionsCollection.deleteOne({post_id});
        await postCommentsCollection.deleteMany({post_id})
        await userStatsCollection.updateOne({username: post!.post_user}, {$inc: {postsCount: -1}});

        session.commitTransaction();

    } catch (err) {
        session.abortTransaction();
    } finally {
        session.endSession();
    }
}




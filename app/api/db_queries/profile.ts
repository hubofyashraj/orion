'use server'
import { collections } from './collections';

const client = collections.client;
const infoCollection = collections.infoCollection;
const userStatsCollection = collections.userStatsCollection;
const usersCollection = collections.userCollection;
const postCollection = collections.postCollection;

/**
 * 
 * @param user username 
 * @returns true if username has profile picture uploaded
 */
export async function hasPFP(user: string) {
    try {
        var info = await infoCollection.findOne({username: user});
        if(info && info.pfp_uploaded) return true;
    } catch (error) {
        console.error('while cheking if user', user, ' has pfp, ');
        console.error(error);
    }
    return false;
}

export async function getInfo(user: string) {
    var info = await infoCollection.findOne({username: user})
    const userStats = await userStatsCollection.findOne({username: user});
    if(info && userStats) return JSON.stringify({ ...info, ...userStats })
    else return
}   


export async function saveInfo(user: string, updatedInfo: InfoUpdate) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await infoCollection.updateOne({username: user}, {$set: updatedInfo});
        if(updatedInfo.hasOwnProperty('fullname')) {
            await usersCollection.updateOne({username: user}, {$set: {fullname: updatedInfo.fullname}})
        }
        session.commitTransaction();
        return true;
    } catch (error) {
        session.abortTransaction();
        return false;
    } finally {
        session.endSession();
    }
}


export async function readUserPostFromDb(user: string) {
    try {
        const posts = await postCollection.find({post_user: user}).toArray();
        return posts.map(post=>post.post_id);
    } catch (error) {
        console.error('while reading users posts for user:', user);
        console.error(error);
    }
    return [];
}
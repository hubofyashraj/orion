'use server'

import { getInfoCollection, getPostCollection, getUserCollection, getUserStatsCollection, get_client } from "./collections";


/**
 * 
 * @param user username 
 * @returns true if username has profile picture uploaded
 */
export async function hasPFP(user: string) {
    const infoCollection = await getInfoCollection();
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
    const userStatsCollection = await getUserStatsCollection();
    const infoCollection = await getInfoCollection();
    var info = await infoCollection.findOne({username: user})
    const userStats = await userStatsCollection.findOne({username: user});
    if(info && userStats) return { ...info, ...userStats }
    else return
}   


export async function saveInfo(user: string, updatedInfo: InfoUpdate) {
    const usersCollection = await getUserCollection();
    const client = await get_client();
    const infoCollection = await getInfoCollection();
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
    const postCollection = await getPostCollection();
    try {
        const posts = await postCollection.find({post_user: user}).toArray();
        return posts.map(post=>post.post_id);
    } catch (error) {
        console.error('while reading users posts for user:', user);
        console.error(error);
    }
    return [];
}
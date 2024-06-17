'use server'
import { collections } from './collections';

const client = collections.client;
const infoCollection = collections.infoCollection;
const userStatsCollection = collections.userStatsCollection;
const usersCollection = collections.userCollection;

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


export async function getUserPosts(user: string) {

}
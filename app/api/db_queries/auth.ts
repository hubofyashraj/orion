'use server';
import { compareSync } from 'bcrypt';
import { collections } from './collections';

const client = collections.client;
const userCollection =collections.userCollection;
const sessions = collections.sessions;

export async function checkCredentials({
    username, password
}: {
    username: string, password: string
}) {
    const result = await userCollection.findOne({username});
    if(result && compareSync(password, result.password)) return true;
    else return false;
}



/**
 * Session Management Code { Currently Unused }
 */
export async function addSession({
    user, token
}: {
    user: string, token: string
}) {
    const session = client.startSession();
    try {
        session.startTransaction();
        await sessions.deleteOne({user});
        await sessions.insertOne({user, token});
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession()
    }
}


export async function retrieveSession({
    user
}: {
    user: string
}) {
    const session = client.startSession();
    let token;
    try {
        session.startTransaction();
        const exists = await sessions.findOne({user});
        if(exists) {
            token = exists.token;
        }
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
    } finally {
        session.endSession()
        return token;
    }

}

export async function endSession({
    user 
}: {
    user: string
}) {
    try {
        await sessions.deleteOne({user});
        return true;
    } catch (error) {
        return false;
    } finally {
    }
}
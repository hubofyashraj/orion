'use server';
import { compareSync } from 'bcrypt';
import { collections } from './collections';
import { genSaltSync, hashSync} from 'bcrypt';

const client = collections.client;
const userCollection =collections.userCollection;
const infoCollection =collections.infoCollection;
const userStatsCollection = collections.userStatsCollection;
const connectionCollection  = collections.connectionsCollection;

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



export async function userExists(username: string) {
    try {
        const result  =await userCollection.findOne({username});
        if(result) return true;
        else return false;
    } catch (error) {
        console.error('while checking if username exists,', username);
        console.error(error);
    }
    return true;
}

export async function userSignup(data: User) {

    var salt = genSaltSync(10);
    data.password = hashSync(data.password , salt);
    
    const session = client.startSession();
    try {
        const info: Info = {
            username: data.username,
            fullname: data.fullname,
            bio: '',
            contact: '',
            contact_privacy: false,
            dob: '',
            email: '',
            gender: '',
            location: '',
            pfp_uploaded: false,
            profession: '',
        }

        const stats: UserStats = {
            username: data.username,
            postsCount: 0,
            connectionsCount: 0
        }

        const connections: Connections = {
            username: data.username,
            connections: []
        }

        session.startTransaction();

        await userCollection.insertOne(data);
        await infoCollection.insertOne(info);
        await userStatsCollection.insertOne(stats);
        await connectionCollection.insertOne(connections);

        await session.commitTransaction();
        return true;
    } catch (error) {
        await session.abortTransaction();
        console.error('while inserting signup data', data);
        console.error(error);
    } finally {
        await session.endSession();
    }
    return false;
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
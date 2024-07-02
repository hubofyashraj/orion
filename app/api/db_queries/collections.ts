import 'server-only';

import { Db, MongoClient } from "mongodb";
import { Collection } from "mongodb";

declare global {
    var mongoClient: MongoClient;
}


let client : MongoClient | null = null

let db: Db | null = null;
let userCollection: Collection<User> | null = null;
let infoCollection: Collection<Info> | null = null;
let connectionsCollection: Collection<Connections> | null = null;
let messagesCollection: Collection<Messages> | null = null;
let connectRequestCollection: Collection<ConnectRequest> | null = null;

let postCollection: Collection<Post> | null = null;
let postStatsCollection: Collection<PostStats> | null = null;
let postOptionsCollection: Collection<PostOptions> | null = null;
let postCommentsCollection: Collection<PostComments> | null = null;
let userStatsCollection: Collection<UserStats> | null = null;


let sessions: Collection<UserSession> | null = null


const connect = async () => {
    if(client ) return client;
    if(global.mongoClient) return global.mongoClient;

    try {

        const db_name = process.env.db_name as string
        const mongodb_uri = process.env.mongodb_uri as string
        client = new MongoClient(mongodb_uri);
        global.mongoClient = client;

        await client.connect();

        process.on('SIGINT', async () => {
            try {
                await client?.close();
                console.log('mongo connection closed');
                process.exit(0);
            }catch(err) {
                console.error('while closing mongodb connection!');
                console.error(err);
            }
            
        })
        process.on('SIGTERM', async () => {
            try {
                await client?.close();
                console.log('mongo connection closed');
                process.exit(0);
            }catch(err) {
                console.error('while closing mongodb connection!');
                console.error(err);
            }
            
        })

        return client;
    }  catch(err)  {
        console.error('while trying to connect to mongodb');
        console.error(err);
        throw 'couldn\'t initialize client'
    }

}

// export default connect;


export const get_client = async () => {
    if (!client) {
        client = await connect();
    }
    return client;
};

export const getDb = async () => {
    const db_name = process.env.db_name as string
    if (!db) {
        const client = await get_client();
        db = client.db(db_name);
    }
    return db;
};

export const getUserCollection = async () => {
    if (!userCollection) {
        const db = await getDb();
        userCollection = db.collection('users');
    }
    return userCollection;
};

export const getInfoCollection = async () => {
    if (!infoCollection) {
        const db = await getDb();
        infoCollection = db.collection('info');
    }
    return infoCollection;
};

export const getConnectionsCollection = async () => {
    if (!connectionsCollection) {
        const db = await getDb();
        connectionsCollection = db.collection('connections');
    }
    return connectionsCollection;
};

export const getMessagesCollection = async () => {
    if (!messagesCollection) {
        const db = await getDb();
        messagesCollection = db.collection('messages');
    }
    return messagesCollection;
};

export const getConnectRequestCollection = async () => {
    if (!connectRequestCollection) {
        const db = await getDb();
        connectRequestCollection = db.collection('connect_requests');
    }
    return connectRequestCollection;
};

export const getPostCollection = async () => {
    if (!postCollection) {
        const db = await getDb();
        postCollection = db.collection('post');
    }
    return postCollection;
};

export const getPostStatsCollection = async () => {
    if (!postStatsCollection) {
        const db = await getDb();
        postStatsCollection = db.collection('post_stats');
    }
    return postStatsCollection;
};

export const getPostOptionsCollection = async () => {
    if (!postOptionsCollection) {
        const db = await getDb();
        postOptionsCollection = db.collection('post_options');
    }
    return postOptionsCollection;
};

export const getPostCommentsCollection = async () => {
    if (!postCommentsCollection) {
        const db = await getDb();
        postCommentsCollection = db.collection('post_comments');
    }
    return postCommentsCollection;
};

export const getUserStatsCollection = async () => {
    if (!userStatsCollection) {
        const db = await getDb();
        userStatsCollection = db.collection('user_stats');
    }
    return userStatsCollection;
};

export const getSessionsCollection = async () => {
    if (!sessions) {
        const db = await getDb();
        sessions = db.collection('sessions');
    }
    return sessions;
};

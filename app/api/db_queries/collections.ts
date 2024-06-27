import 'server-only';

import { MongoClient } from "mongodb";
import { Collection } from "mongodb";

declare global {
    var mongoClient: MongoClient;
}

const mongo_uri = process.env.MONGODB_URI as string;
const db_name = process.env.db_name as string
const client = global.mongoClient || new MongoClient(mongo_uri);
global.mongoClient = client;

client.connect().then(async () => {
    process.on('SIGINT', async () => {
        try {
            await client.close();
            console.log('mongo connection closed');
            process.exit(0);
        }catch(err) {
            console.error('while closing mongodb connection!');
            console.error(err);
        }
        
    })
    process.on('SIGTERM', async () => {
        try {
            await client.close();
            console.log('mongo connection closed');
            process.exit(0);
        }catch(err) {
            console.error('while closing mongodb connection!');
            console.error(err);
        }
        
    })
}).catch((err) => {
    console.error('while trying to connect to mongodb');
    console.error(err);
})

const db = client.db(db_name);
const userCollection: Collection<User> = db.collection('users');
const infoCollection: Collection<Info> = db.collection('info');
const connectionsCollection: Collection<Connections> = db.collection('connections');
const messagesCollection: Collection<Messages> = db.collection('messages');
const connectRequestCollection: Collection<ConnectRequest> = db.collection('connect_requests');

const postCollection: Collection<Post> = db.collection('post');
const postStatsCollection: Collection<PostStats> = db.collection('post_stats');
const postOptionsCollection: Collection<PostOptions> = db.collection('post_options');
const postCommentsCollection: Collection<PostComments> = db.collection('post_comments');
const userStatsCollection: Collection<UserStats> = db.collection('user_stats');

const sessions: Collection<UserSession> = db.collection('sessions')


export const collections = 
{
    client, 
    userCollection, 
    infoCollection, 
    connectionsCollection, 
    messagesCollection, 
    connectRequestCollection,
    postCollection,
    postStatsCollection,
    postOptionsCollection,
    postCommentsCollection,
    userStatsCollection,
    sessions
};


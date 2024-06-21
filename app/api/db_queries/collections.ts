import { MongoClient } from "mongodb";
import { Collection } from "mongodb";

const mongo_uri = process.env.mongo_uri as string;
const client = new MongoClient(mongo_uri);

client.connect();

const db = client.db('userscollection');
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

export default async function placeholder() {
}

// setInterval(()=>{
//     process.stdout.write('\x1B[2J\x1B[0f');
// }, 60000)
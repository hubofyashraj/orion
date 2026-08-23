import 'server-only';

import { Db, MongoClient } from "mongodb";
import { Collection } from "mongodb";

declare global {
    var mongoClient: MongoClient;
}


let client: MongoClient | null = null

let db: Db | null = null;
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


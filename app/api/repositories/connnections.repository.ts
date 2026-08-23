import { getConnection } from "../config/db";
import { User, Profile, Stats, Connection, ConnectRequest, Messages, Post, PostStats, PostOptions, PostComments, UserSession } from "../models/user";


class ConnectionsRepository {
    constructor() {
        getConnection();
    }


}

export const connectionsRepository = new ConnectionsRepository();
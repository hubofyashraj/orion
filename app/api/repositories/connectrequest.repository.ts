import { getConnection } from "../config/db";
import { User, Stats, Connection, ConnectRequest, Messages, Post, PostStats, PostOptions, PostComments, UserSession } from "../models/user";
class ConnectRequestRepository {
    constructor() {
        getConnection();
    }

    async findIncomingRequests(receiver: string) {
        const requests = await ConnectRequest.find({ receiver });
        return requests.map(r => r.sender);
    }

    async getRequestID(sender: string, receiver: string) {
        const request = await ConnectRequest.findOne({ sender, receiver });
        return request._id;
    }


}

export const connectRequestRepository = new ConnectRequestRepository();

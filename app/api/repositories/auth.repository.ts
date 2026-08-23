import { getConnection } from "../config/db";
import { User, Stats, Connection, ConnectRequest, Messages, Post, PostStats, PostOptions, PostComments, UserSession } from "../models/user";
class AuthRepository {
    constructor() {
        getConnection();
    }

    async getUser({ username }: { username: string; }, projection?: any) {
        return await User.findOne({ username }, projection).lean();
    }

    async deleteSession(user: string) {
        await UserSession.deleteOne({ user });
    }

    async createSession(user: string) {
        if (!!UserSession.findOne({ user })) await this.deleteSession(user);
        return await UserSession.create({ user });
    }

    async getUserSession({ user }: { user: string }) {
        return await UserSession.findOne({ user });
    }

    async register(data: UserType) {
        await User.create(data);
        await Stats.create({ username: data.username, postsCount: 0, connectionsCount: 0 });
        return
    }
}

export const authRepository = new AuthRepository();

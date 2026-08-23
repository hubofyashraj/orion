import { getConnection } from "../config/db";
import { User, Profile, Stats, Connection, ConnectRequest, Messages, Post, PostStats, PostOptions, PostComments, UserSession } from "../models/user";

class ProfileRepository {
    constructor() {
        getConnection();
    }

    async hasPFP(username: string) {
        const profile = await Profile.findOne({ username });
        return profile?.pfp_uploaded;
    }

    async getProfile(username: string) {
        const profile = await Profile.findOne({ username }, { _id: 0 }).lean();
        let stats = await Stats.findOne({ username }, { _id: 0 }).lean();
        console.log({ stats });

        return { ...profile, ...stats };
    }

    async getPostIds(username: string) {
        const post_ids = await Post.find({ post_user: username }, { post_id: 1 });
        const ids = post_ids.flatMap(id => id.post_id);
        return ids;
    }

    async update(username: string, data: any) {
        if (data.hasOwnProperty('fullname')) {
            await User.updateOne({ username }, { fullname: data.fullname });
        }
        await Profile.updateOne({ username }, { ...data });
        return true;
    }
}

export const profileRepository = new ProfileRepository();

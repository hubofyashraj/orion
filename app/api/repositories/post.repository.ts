import { getConnection } from "../config/db";
import { User, Profile, Stats, Connection, ConnectRequest, Messages, Post, PostStats, PostOptions, PostComments, UserSession } from "../models/user";

class PostRepository {
    async getPost(post_id: string) {
        const post = await Post.findOne({ post_id });
        return post;
    }
    constructor() {
        getConnection();
    }
}
export const postRepository = new PostRepository();
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true }
});

const profileSchema = new mongoose.Schema({
    username: String,
    dob: Date,
    profession: String,
    location: String,
    bio: String,
    gender: String,
    email: String,
    contact: String,
    contact_privacy: Boolean,
    pfp_uploaded: Boolean
});

const statsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    postsCount: { type: Number, required: true },
    connectionsCount: { type: Number, required: true }
});

const connectionSchema = new mongoose.Schema({
    username: String,
    connections: Array<String>
});

const connectRequestSchema = new mongoose.Schema({
    sender: String,
    receiver: String
});

const messagesSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    msg: String,
    ts: Date,
    id: String,
    unread: Boolean
});

const postSchema = new mongoose.Schema({
    post_user: String,
    post_id: String,
    post_type: String,
    post_length: Number,
    post_content: Array<String>,
    post_caption: String
});

const postStatsSchema = new mongoose.Schema({
    post_id: String,
    post_likes_count: Number,
    post_comments_count: Number,
    post_save_count: Number
});

const postOptionsSchema = new mongoose.Schema({
    post_id: String,
    post_liked_by: Array<String>,
    post_saved_by: Array<String>
});

const postCommentsSchema = new mongoose.Schema({
    comment_id: String,
    post_id: String,
    post_user: String,
    comment: String,
    comment_by: String,
    sending: Boolean
});


const userSessionSchema = new mongoose.Schema({
    user: String,
});


export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export const Stats = mongoose.models.Stats || mongoose.model('Stats', statsSchema);
export const Connection = mongoose.models.Connection || mongoose.model('Connection', connectionSchema);
export const ConnectRequest = mongoose.models.ConnectRequest || mongoose.model('ConnectRequest', connectRequestSchema);
export const Messages = mongoose.models.Messages || mongoose.model('Messages', messagesSchema);
export const Post = mongoose.models.Post || mongoose.model('Post', postSchema);
export const PostStats = mongoose.models.PostStats || mongoose.model('PostStats', postStatsSchema);
export const PostOptions = mongoose.models.PostOptions || mongoose.model('PostOptions', postOptionsSchema);
export const PostComments = mongoose.models.PostComments || mongoose.model('PostComments', postCommentsSchema);
export const UserSession = mongoose.models.UserSession || mongoose.model('UserSession', userSessionSchema);
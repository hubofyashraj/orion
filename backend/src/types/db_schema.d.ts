import { SchemaType } from "mongoose";

export type User = {
    _id?: ObjectId,
    username: string,
    password: string,
    fullname: string
}


export type Info = {
    _id?: ObjectId,
    username: string, 
    fullname: string, 
    dob: string, 
    profession: string, 
    location: string, 
    bio: string, 
    gender: string, 
    email: string, 
    contact: string, 
    contact_privacy: boolean
    pfp_uploaded: boolean,
}

export type UserStats = {
    username: string,
    postsCount: number,
    connectionsCount: number
}


export type Connections = {
    _id?: ObjectId
    user: string,
    connections: Array<string>
}

export type ConnectRequest = {
    _id?: ObjectId,
    sender: string,
    receiver: string
}

export type Messages = {
    sender: string,
    receiver: string,
    msg: string,
    ts: string,
    id?: string
}


export type Post = {
    _id?: ObjectId,
    post_user: string,
    post_id: string,
    post_type: 'image' | 'video' | 'text',
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string
}

export type PostStats = {
    _id?: ObjectId,
    post_id: string,
    post_likes_count: number,
    post_comments_count: number,
    post_save_count: number,
}

export type PostOptions = {
    _id?: ObjectId,
    post_id: string,
    post_liked_by: Array<string>,
    post_saved_by: Array<string>
}

export type PostComments = {
    _id?: ObjectId,
    comment_id: string,
    post_id: string,
    post_comment: string,
    post_comment_by: string
}

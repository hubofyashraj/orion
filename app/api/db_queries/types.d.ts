type User = {
    _id?: ObjectId,
    username: string,
    password: string,
    fullname: string
}

type Info = {
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


type InfoUpdate = {
    _id?: ObjectId,
    fullname?: string, 
    dob?: string, 
    profession?: string, 
    location?: string, 
    bio?: string, 
    gender?: string, 
    email?: string, 
    contact?: string, 
    contact_privacy?: boolean
    pfp_uploaded?: boolean,
}


type UserStats = {
    _id?: ObjectId,
    username: string,
    postsCount: number,
    connectionsCount: number
}


type Connections = {
    _id?: ObjectId
    username: string,
    connections: Array<string>
}

type ConnectRequest = {
    _id?: ObjectId,
    sender: string,
    receiver: string
}

type Messages = {
    _id?: ObjectId,
    sender: string,
    receiver: string,
    msg: string,
    ts: string,
    id?: string,
    unread?: boolean
}


type Post = {
    _id?: ObjectId,
    post_user: string,
    post_id: string,
    post_type: string,
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string
}

type PostStats = {
    _id?: ObjectId,
    post_id: string,
    post_likes_count: number,
    post_comments_count: number,
    post_save_count: number,
}

type PostOptions = {
    _id?: ObjectId,
    post_id: string,
    post_liked_by: Array<string>,
    post_saved_by: Array<string>
}

type PostComments = {
    _id?: ObjectId,
    comment_id: string,
    post_id: string,
    post_user: string,
    comment: string,
    comment_by: string,
    sending?: undefined | boolean
}


type UserSession = { 
    _id?: ObjectId, 
    user: string, 
    token: string 
}


type Match = {
    username: string, 
    fullname: string, 
    status: string, 
    _id?: string
}
import { Request } from "express"

export interface RequestExtended extends Request {
    user?: string
} 


interface Match {
    username: string, 
    fullname: string, 
    status?: string, 
    id?: ObjectId
}


interface ConnectionsInChat {
    username: string,
    fullname: string,
    lastmsg: string | null,
    ts: string
}



interface Info {
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
    pfp?: string,
    postsCount?: number,
    connectionsCount?: number
}



interface SecondaryStats {
    liked: boolean,
    saved: boolean
}
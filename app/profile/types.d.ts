type Info = {
    username: string, fullname: string, dob: string, profession: string,
    location: string, bio: string, gender: string,
    email: string, contact: string, contact_privacy: boolean
    pfp_uploaded: boolean,
}

type ProfileInfo = Info & {
    connectionsCount: number,
    postsCount: number,
    [key: string]: string | Blob | boolean | null
}
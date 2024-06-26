'use client'
import { useEffect, useState } from "react"
import CircularLoader from "../Loader/Loader"
import Image from "next/image"
import { getPostThumbnails } from "../api/profile/user_posts"

export default function UserPosts({
    user
}:{
    user: string
}) {
    
    const [posts, setPosts] = useState<Array<string>>([]);

    useEffect(()=>{
        getPostThumbnails(user).then((jsonString)=>{
            if(jsonString.length) setPosts((JSON.parse(jsonString)).post_ids);                
            else setPosts([])
        })
    }, [user])

    if(posts==null) return (
        <CircularLoader />
    )

    if(posts.length==0) return (
        <div className="h-full w-full flex justify-center text-slate-200 items-center ">
            <p className="text-slate-700 text-3xl">No Posts</p>
        </div>
    )

    return (
        <div className={` w-full flex flex-wrap justify-start overflow-y-auto `}>
            {posts.map((post, idx)=>{
                return (
                    <div key={idx} className={`p-0.5 aspect-square min-w-[calc(12.5svw)]  max-w-[calc(33.33svw-0.33333rem)] sm:max-w-[calc(25svw-0.25rem)] md:max-w-[calc(20svw-0.2rem)]  `}  > 
                        <Image alt="" src={'/api/images?type=post-asset&asset-id='+post+'-0'} width={400} height={400} className="aspect-square h-auto w-auto" />
                    </div>
                )
            })}
        </div>
    )
}
'use client'
import { useEffect, useState } from "react"
import CircularLoader from "../Loader/Loader"
import Image from "next/image"
import { getPostThumbnails } from "../api/profile/user_posts"
import { fetchPost, fetchPostStats } from "../api/feed/feed"
import PostView from "./post"

export default function MyPosts({
    user
}:{
    user: string
}) {


    const [posts, setPosts] = useState<Array<string>>([]);
    const [postDisplay, setPostToDisplay] = useState<Post | null>(null);

    useEffect(()=>{
        getPostThumbnails(user).then((usersPosts)=>{
            if(usersPosts) setPosts(usersPosts);                
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

    async function fetchPostData(post_id: string) {
        fetchPost(post_id).then((jsonString)=>{
            console.log({jsonString});
            
            if(jsonString) {
                const post = JSON.parse(jsonString) as Post;
                setPostToDisplay(post)
            }
        })
    }

    function deletedPost(post_id: string) {
        setPosts(prev=>prev.filter(post=>post!=post_id))
    }

    return (
        <div className={` w-full flex flex-wrap justify-start overflow-y-auto`}>
            {posts.map((post, idx)=>{
                return (
                    <div onClick={()=>fetchPostData(post)} key={idx} className={`p-0.5 aspect-square min-w-[calc(12.5svw)]  max-w-[calc(33.33svw-0.33333rem)] sm:max-w-[calc(25svw-0.25rem)] md:max-w-[calc(20svw-0.2rem)]  `}  > 
                        <Image priority alt="" src={'/api/images?type=post-asset&asset-id='+post+'-0'} width={250} height={250} className="aspect-square h-auto w-auto" />
                    </div>
                )
            })}
            {postDisplay && <PostView post={postDisplay} post_type="image" close={(deleted?: string)=>{
                if(deleted) {
                    deletedPost(postDisplay.post_id);
                } 
                setPostToDisplay(null)}} />}
        </div>
    )
}
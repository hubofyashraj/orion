import { useEffect, useState } from "react";
import FloatingActionButton from "./floatingActionButton";
// import ImagePost from "./imagepost";
import { ObjectId } from "mongoose";
import axios from "axios";
import { address } from "../api/api";
import dynamic from "next/dynamic";


export type Post = {
    _id?: ObjectId,
    post_user: string
    post_id: string,
    post_type: 'image' | 'video' | 'text',
    post_length: number, 
    post_content: Array<string>,
    post_caption: string
}


export default function Feed( { setPage } : { setPage: Function } ) {
    const [posts, setPost] = useState(new Array<{post_id: string, post_user: string, post_type: 'image' | 'video'}>())

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.post(
            address+'/post/fetchPosts', 
        ).then((result)=>{
            if(result.data.success) {
                setPost(result.data.posts);
                
            }
        })
    }, [])


    const ImagePost = dynamic(()=>import('./imagepost'), {ssr: false})

    return (
        <div className="bg-slate-700 relative h-full w-full flex flex-col items-center">
            <div className="w-full max-w-[calc(560px)] h-full flex flex-col justify-start gap-0 overflow-y-auto scrollbar-none">
                {posts.map(post=>{
                    if(post.post_type=='image') return <ImagePost key={post.post_id} post={post} />
                })}
            </div>

            <FloatingActionButton setShowSelectComponent={()=>setPage('create')} />
            {/* {!showCreatePost && <SelectImagesComponent
                curState={showSelectComponent} toggleState={()=>setShowSelectComponent(false)} 
                fnCreatePost={setShowCreatePostPage} />}
            {showCreatePost && <CreatePost fileList={images} cancel={()=>{setShowCreatePost(false); setShowSelectComponent(false)}} />} */}
        </div>
    );
}
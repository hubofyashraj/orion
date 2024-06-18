import { useEffect, useState } from "react";
import FloatingActionButton from "./floatingActionButton";
// import ImagePost from "./imagepost";
import { ObjectId } from "mongoose";
import axios from "axios";
import { address } from "../api/api";
import dynamic from "next/dynamic";
import useSSE from "../sseProvider/sse";
import { fetchPosts } from "../api/feed/feed";
import ImagePost from "./imagepost";


export type Post = {
    _id?: ObjectId,
    post_user: string
    post_id: string,
    post_type: 'image' | 'video' | 'text',
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string
}


export default function Feed( { setPage } : { setPage: Function } ) {
    const [posts, setPost] = useState<Post[]>([]);
    const {newPosts, setNewPosts} = useSSE();

    useEffect(()=>{
        console.log('hhhhh');
        
        fetchPosts().then((jsonString) => {
            if(jsonString) {
                const posts = JSON.parse(jsonString).posts as Post[];
                setPost(posts);
            }
        })
    }, [])

    function refresh() {
        
    }



    return (
        <div className="bg-slate-800 relative h-full w-full flex flex-col items-center">
            { newPosts && <div className="w-full">
                <p>New Posts</p>
                <button onClick={refresh}>Refresh</button>
                </div> }
            <div className="drop-shadow-lg w-full max-w-xl h-full flex flex-col justify-start gap-0 overflow-y-auto scrollbar-none">
                {posts.map(post=>
                    post.post_type=='image'
                    ? <ImagePost key={post.post_id} post={post} />
                    : <></>
                )}
            </div>

            <FloatingActionButton setShowSelectComponent={()=>setPage('create')} />
        </div>
    );
}
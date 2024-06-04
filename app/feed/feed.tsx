import { useEffect, useState } from "react";
import FloatingActionButton from "./floatingActionButton";
// import ImagePost from "./imagepost";
import SelectImagesComponent from "./selectImageComponent";
import CreatePost from "./createpost";
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


export default function Feed() {
    

    const [showSelectComponent, setShowSelectComponent] = useState(false);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [images, setImages] = useState(new Array<File>())

    const [posts, setPost] = useState(new Array<{post_id: string, post_user: string, post_type: 'image' | 'video'}>())

    // var images: Array<string> = [];


    function setShowCreatePostPage(img: Array<File>) {
        console.log('img',img);
        
        setImages(img);
        setShowCreatePost(true);
    }

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
        <div className=" relative h-full w-full flex flex-col items-center">
            <div className="w-full max-w-[calc(640px)] h-full flex flex-col justify-start gap-0 overflow-y-auto scrollbar-none">
                {posts.map(post=>{
                    if(post.post_type=='image') return <ImagePost key={post.post_id} post={post} />
                })}
            </div>

            <FloatingActionButton setShowSelectComponent={()=>setShowSelectComponent(true)} />
            {!showCreatePost && <SelectImagesComponent
                curState={showSelectComponent} toggleState={()=>setShowSelectComponent(false)} 
                fnCreatePost={setShowCreatePostPage} />}
            {showCreatePost && <CreatePost fileList={images} cancel={()=>{setShowCreatePost(false); setShowSelectComponent(false)}} />}
        </div>
    );
}
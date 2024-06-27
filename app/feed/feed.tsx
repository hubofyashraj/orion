import { useEffect, useOptimistic, useRef, useState } from "react";
import FloatingActionButton from "./floatingActionButton";
import { deleteComment, fetchComments, fetchPosts, sendComment } from "../api/feed/feed";
import ImagePost from "./imagepost";
import { ObjectId } from "mongodb";
import usePostsAlert from "../state-store/newPostsStore";
import { Close, Send, Delete } from "@mui/icons-material";
import CommentSection from "./commentSection";


export type Post = {
    _id?: ObjectId,
    post_user: string
    post_id: string,
    post_type: string,
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string
}


export default function Feed() {
    const [posts, setPost] = useState<Post[]>([]);
    const {newPosts} = usePostsAlert();

    const [commentSection, setValue] = useState<Post | null>(null);

    useEffect(()=>{
        document.title = 'Home | YASMC'
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
        <div className="bg-slate-900 relative h-full w-full flex flex-col items-center">
            { newPosts &&  <div className="w-full">
                <p>New Posts</p>
                <button onClick={refresh}>Refresh</button>
                </div> }
            <div className="drop-shadow-lg relative w-full max-w-xl h-full bg-slate-900 flex flex-col justify-start gap-0 overflow-y-auto scrollbar-none">
                {posts.length==0 && (
                    <p className="text-slate-300 text-xl font-sans font-light text-center mt-52">Feels so empty lets connect to people</p>
                )}
                {posts.map(post=>
                    post.post_type=='image'
                    ? <ImagePost key={post.post_id} post={post} openCommentSection={(post) => setValue(post)} />
                    : <></>
                )}
            </div>
            {commentSection && <CommentSection post={commentSection} close={() => setValue(null)}  />}
            <FloatingActionButton />
        </div>
    );
}



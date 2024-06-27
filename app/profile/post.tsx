import ImagePost from "../feed/imagepost"
import { useState } from "react"
import { deletePost } from "../api/create/createImagePost";
import { Close } from "@mui/icons-material";
import CommentSection from "../feed/commentSection";

export default function PostView({
    post, post_type, close
}: {
    post: Post, post_type: string, close: (deleted?: string)=>void
}) {

    const [deleteWarning, setWarning] = useState(false);
    const [commentSection ,setValue] = useState<Post | null>(null)
    async function deletePostAction() {
        const result = await deletePost(post.post_id);
        setWarning(false);
        close('deleted');
    }

    if(post_type=='image') return (
        <div className="absolute z-30 h-full top-0 left-0 w-full  flex  backdrop-blur-md rounded-md justify-center items-start">
            <div className=" flex justify-center items-center w-full h-full  ">
                <Close onClick={()=>close()} className="m-4 h-8 w-8 hover:scale-105 absolute right-0 self-start" />
                <div className=" w-[calc(30rem)] max-w-full h-full bg-slate-800 rounded-md py-2 flex flex-col items-center justify-start ">
                    <ImagePost post={post} openCommentSection={(post) => setValue(post)} />
                    <button onClick={()=>setWarning(true)} className="self-end m-6 p-2 rounded-xl border border-slate-700 hover:bg-slate-700 hover:shadow-lg">Delete Post</button>
                    {deleteWarning && <DeleteWarning post_id={post.post_id} cancel={()=>setWarning(false)} deletePost={deletePostAction} />}
                </div>
                {commentSection && <div className="absolute sm:relative h-full w-full rounded-md max-w-xl  bg-slate-800">
                    <CommentSection post={commentSection} close={() => setValue(null)}/>
                </div>}
            </div>
        </div>
    )
    else return (<></>)
}


function DeleteWarning({post_id, cancel ,deletePost}: {post_id: string, cancel: ()=>void, deletePost: ()=>void}) {

   
    return (
        <div className="bg-slate-900 absolute w-60 h-32 rounded-xl">
            <div className=" w-full h-full relative flex flex-col gap-2 justify-center items-center ">
                <Close onClick={cancel} className="absolute right-0 top-0 m-3" />
                <p>Confirm Deletion</p>
                <button className=" border border-slate-700 rounded-xl px-2 py-1  hover:bg-slate-700" onClick={deletePost}>Delete</button>
            </div>
        </div>
    )
}
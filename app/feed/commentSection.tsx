import { Close, Send, Delete } from "@mui/icons-material";
import { useState, useRef, useOptimistic, useEffect } from "react";
import { fetchComments, sendComment, deleteComment } from "../api/feed/feed";

export default function CommentSection({
    post, close
}: {
    post: Post, close: () => void
}) {

    const [comments, setComments] = useState<Comment[]>([]);


    const divRef=useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [optimisticComments, addOptimisticComment] = useOptimistic<Comment[], Comment>(
        comments, (state: Comment[], comment: Comment) => [comment, ...state]
    )

    const commentsRef = useRef<Comment[]>([]);


    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        setTimeout(()=>{
            if(ref.current) ref.current.style.height='100%';
        }, 50)
        fetchComments(post.post_id).then((jsonString)=>{
            const {comments} = JSON.parse(jsonString) as {comments: Comment[]};
            commentsRef.current=comments.sort((a,b) => -1);
            setComments(commentsRef.current);
        })
    },[post.post_id])

    
    function addComment(comment: Comment) {
        setComments(prev=>[ comment, ...prev])
        commentsRef.current=comments;
    }


    function delete_comment(comment_id: string) {
        setComments(prev => prev.filter(comment => comment.comment_id!=comment_id))
    }


    async function action(formData: FormData) {
        const text = formData.get('commentbox')?.toString();
        if(!text) return;
        let comment: Comment | false = {
            comment: text,
            comment_by: 'me',
            comment_id: 'me'+Date.now(),
            post_id: post.post_id,
            post_user: post.post_user,
            sending: true
        }

        addOptimisticComment(comment);
        const result = await sendComment(comment);
        
        if(result) {
            if(inputRef.current) inputRef.current.value='';
            addComment(JSON.parse(result) as Comment)
        }
    }


    return (
        <div ref={ref} style={{height: '3rem'}} className=" text-slate-300 absolute bottom-0  z-50  transition-all  overflow-hidden   w-full max-w-xl flex flex-col bg-inherit rounded-t-2xl  ">
            <p className="w-full p-2 text-center text-lg underline-offset-8 underline ">Comments <Close onClick={close} className="float-right hover:scale-105 "/></p>
            <div ref={divRef} className="flex grow w-full  flex-col overflow-y-auto scrollbar-none">
                {optimisticComments.map(comment => <CommentComponent comment={comment} post_user={post.post_user} delete_comment={()=>delete_comment(comment.comment_id)} key={comment.comment_id} />)}
            </div>
            <form action={action} autoComplete="off" className="w-full  p-2 select-none bg-inherit  flex gap-2 justify-center items-center">
                <input ref={inputRef} name="commentbox" placeholder="Comment" className="bg-inherit outline-none grow shrink border rounded-full p-1 hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700 px-5"/>
                <button><Send className="" /></button>
            </form>
        </div>
    )
}

function CommentComponent({comment, post_user, delete_comment}: {comment: Comment, post_user: string, delete_comment: Function}){
    const self = sessionStorage.getItem('user');
    if(!self) window.location.href='/auth';

    async function attemptDelete() {
        const result = await deleteComment(comment.comment_id, comment.comment_by, post_user);
        if(result) {
            delete_comment();
        }
    }

    return (
        <div className="p-2">
            <div className="flex gap-2 text-wrap justify-start items-start">
                <p className="font-semibold">{comment.comment_by}</p>
                <p className="grow">{comment.comment}</p>
                {!comment.sending && (comment.comment_by==self || self==post_user) && <Delete onClick={attemptDelete} className="text-slate-400 hover:text-slate-300 hover:scale-105"/>}
            </div>
            {comment.sending && <p className="text-sm animate-pulse">Posting</p>}
        </div>
    )
}


export type Comment = {
    post_id: string,
    post_user: string,
    comment_id: string,
    comment_by: string,
    comment: string,
    sending?: boolean| undefined
}
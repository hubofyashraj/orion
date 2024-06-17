import { cilBookmark, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { MouseEvent, Suspense, TouchEvent, UIEvent, useEffect, useOptimistic, useRef, useState } from "react"
import { address } from "../api/api"
import { ArrowLeft, ArrowRight, Bookmark, BookmarkAddOutlined, BookmarkOutlined, BookmarkSharp, Close, Comment, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, RateReviewOutlined, Send, SendSharp, Share, ShareSharp } from "@mui/icons-material"
import assert from "assert"
import { fetchComments, fetchPostStats, sendComment, togglePostLike, togglePostSave } from "../api/feed/feed"
import { Skeleton } from "@mui/material"
import ProfilePictureComponent from "../components/pfp"

type PostIdentifier = {
    post_id: string,
    post_user: string,
    post_type: 'image' | 'video'
}


export type Post = {
    post_user: string,
    post_id: string,
    post_type: 'image' | 'video' | 'text',
    post_length: number, 
    post_content?: Array<string>,
    post_caption: string,
}

export type PostStats = {
    post_id: string,
    post_likes_count: number,
    post_comments_count: number,
    post_save_count: number,
}

export type PostOptions = {
    post_id: string,
    post_liked_by: Array<string>,
    post_saved_by: Array<string>
}

export type PostComments = {
    comment_id: string,
    post_id: string,
    post_comment: string,
    post_comment_by: string
}


export type SelfStats = {
    liked: boolean,
    saved: boolean,
}

export type Comment = {
    post_id: string,
    comment_id: string,
    comment_by: string,
    comment: string,
    sending?: boolean| undefined
}


export default function ImagePost({ post }: {post: Post}) {

    const [stats, setStats] = useState<PostStats>({post_id: '-1', post_comments_count: 0, post_likes_count: 0, post_save_count: 0})
    const [selfStats, setSelfStats] = useState<SelfStats>({liked: false, saved: false})
    const [comments, setComments] = useState<Comment[]>([]);
    const commentsRef = useRef<Comment[]>([{comment: 'demo', comment_by: 'test', comment_id: '22', post_id: post.post_id}]);
    const [displayComments, toggleCommentSection] = useState(false);
    type Stats = {
        stats: PostStats | null;
        selfStats: {
            liked: boolean;
            saved: boolean;
        };
    }

    useEffect(()=>{
        fetchPostStats(post.post_id).then(
            jsonString => {
                if(jsonString) {
                    const data = JSON.parse(jsonString) as Stats;
                    if(data.stats) setStats(data.stats);
                    if(data.selfStats) setSelfStats(data.selfStats);
                }
            }
        )
    }, [post]);

    useEffect(()=>{
        if(comments.length) commentsRef.current=comments
    }, [comments])

    function toggleLike() {
        const cur = selfStats.liked;
        setSelfStats(prev => {return {...prev, liked: !prev.liked}})
        togglePostLike(post.post_id, cur)
        .then((success) => { 
            if(!success) setSelfStats(prev => {return {...prev, liked: cur}});
            else setStats(prev => {return {...prev, post_likes_count: prev.post_likes_count+(cur?-1:1)}})
        })

    }

    function toggleSave() {
        const cur = selfStats.saved;
        setSelfStats(prev => {return {...prev, saved: !prev.saved}})
        togglePostSave(post.post_id, cur)
        .then((success) => { 
            if(!success) setSelfStats(prev => {return {...prev, saved: cur}}) 
        })
    }


    function openCommentSection() {
        fetchComments(post.post_id).then((jsonString)=>{
            const {comments} = JSON.parse(jsonString) as {comments: Comment[]};
            commentsRef.current=comments;
            setComments(commentsRef.current);
        })
        toggleCommentSection(true);
    }

    function closeComments() {
        toggleCommentSection(false);
    }
    function addComment(comment: Comment) {
        setComments(prev=>[...prev, comment])
        commentsRef.current=comments;
    }
    let currentImgInView=0;

    function swipe(direction: 'left' | 'right') {
        const div: HTMLDivElement = document.getElementById('imageContainer'+post?.post_id) as HTMLDivElement; 
        const progressDots: HTMLDivElement = document.getElementById('progressDots'+post?.post_id) as HTMLDivElement
        
        if(direction=='left' && currentImgInView>0) {
            div.scrollTo({behavior: 'smooth', left: (currentImgInView-1)*(div.clientWidth+4)})
            progressDots.children.item(currentImgInView)?.setAttribute('style', '')
            currentImgInView--;
            progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            return;
        }
        if(direction=='right' && currentImgInView<div.children.length-1) {
            div.scrollTo({behavior: 'smooth', left: (currentImgInView+1)*(div.clientWidth+4)})
            progressDots.children.item(currentImgInView)?.setAttribute('style', '');
            currentImgInView++;
            progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            return;
        }

    }

    

    return (
        <div className={"flex w-full   border-r border-l  border-slate-600 text-slate-200  bg-slate-800"}>
            { screen.width>0 && <button onClick={()=>swipe('left')}  className={post.post_length==1?"invisible":"  "}><ArrowLeft /></button>}
            <div className={(displayComments?"blur ":"")+"w-full "}>
                <div className="flex items-center  w-full gap-3 py-2 ">
                    <div className="  rounded-full overflow-hidden bg-gray-400">
                        <ProfilePictureComponent user={post.post_user} size={40}/>
                    </div>
                    <div className="flex flex-col  justify-center">
                        <div className="shrink">
                            <p style={{fontSize: 'clamp(0.5rem, 10vh, 1rem)'}} className="  ">{post.post_user}</p>
                        </div>
                    </div>
                </div>
                <div className=" w-full flex select-none border-b-slate-500  border-t-slate-500 border-b border-t">
                    <PostAssets post={post} swipe={swipe} key={post.post_id}/>
                </div>
                {post && post.post_length>1 && 
                    <div id={"progressDots"+post?.post_id} className="h-3 flex gap-1  items-center justify-center">
                        { Array.from({length: post.post_length})
                          .map((_, index) => <div style={index==0?{height: '8px', width: '8px'}:{}} className="h-1.5 w-1.5 transition-all bg-slate-200 rounded-full" key={index}></div>
                        )}
                    </div>
                }
                <div className="flex bg-inherit py-2 text-slate-400   justify-between">
                    <div className="h-full flex gap-2">
                        {selfStats && selfStats.liked ? <Favorite onClick={toggleLike} className="  text-red-600 drop-shadow-md" />: <FavoriteBorderOutlined onClick={toggleLike} /> }
                        <RateReviewOutlined onClick={openCommentSection} />
                        {/* <CIcon className="w-[calc(25%)] "  icon={cilPaperPlane}/> */}
                        
                    </div>
                    <div className=" flex justify-end">
                        { selfStats && selfStats.saved?<BookmarkSharp onClick={toggleSave} className=" text-slate-500 drop-shadow-md" />: <BookmarkAddOutlined onClick={toggleSave} /> }
                    </div>

                </div>
                <div>
                    {stats && <p className="mr-4">{stats.post_likes_count} {stats.post_likes_count==1?'like':'likes'}</p>}
                </div>
                <div className=" my-2 ">
                    <p className="flex gap-2 text-base items-center"><span className="font-bold ">{post.post_user}</span> {post!.post_caption}</p>
                </div>

            </div>
            { screen.width>0  && <button onClick={()=>swipe('right')} className={post.post_length==1?"invisible":""}><ArrowRight /></button>}
            { displayComments && <CommentSection post={post} comments={comments} close={closeComments} addComment={addComment} />}
        </div>
    )
}


function PostAssets({
    post, swipe
}: {
    post: Post, swipe: Function
}) {

    let touchStart: number = 0;
    let touchEnd: number = 0;

    function touchStartHandler(event: TouchEvent<HTMLDivElement>): void {
        touchStart = event.touches[0].clientX;
        
    }


    function touchEndHandler(event: TouchEvent<HTMLDivElement>): void {
        touchEnd = event.changedTouches[0].clientX;
        const div: HTMLDivElement = document.getElementById('imageContainer'+post?.post_id) as HTMLDivElement; 
        
        if(touchEnd-touchStart>div.clientWidth/4) {
            swipe('left')
        }
        else if(touchStart-touchEnd>div.clientWidth/4) {
            swipe('right')
        }
    }


    return (
        <div id={"imageContainer"+post?.post_id} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler} className="w-full aspect-square shrink-0 flex gap-1 overflow-hidden">
            {post && Array.from({length: post.post_length})
            .map((_, idx) => 
                <Suspense key={idx} fallback={<ImageFallBack />}>
                    <Image loading={idx==0?"eager":"lazy"} priority={idx==0} className="w-full h-full aspect-square shrink-0 select-none" alt="" width={640} height={640} src={`/api/images?type=post-asset&asset-id=${post.post_id}-${idx}`}  />
                </Suspense>
            )}
        </div>
    )

}
// src={`data:image/jpg;base64,${image}`}
function ImageFallBack() {
    return (
        <div className=" bg-slate-900 w-full shrink-0 aspect-square flex justify-center items-center">
            <Skeleton className="w-full h-full bg-slate-800" variant="rectangular" title="Loading" animation="pulse"  />
        </div>
    )
}

function PfpFallback() {
    return <CIcon className="w-full h-full" icon={cilUser} />
}


function CommentSection({
    post, comments, addComment, close
}: {
    post: Post, comments: Comment[], addComment: (comment: Comment)=>void, close: () => void
}) {

    const divRef=useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [optimisticComments, addOptimisticComment] = useOptimistic<Comment[], Comment>(
        comments, (state: Comment[], comment: Comment) => [...state, comment]
    )

    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(()=>{
        setTimeout(()=>{
            if(ref.current) ref.current.style.height='80%';
        }, 50)
    },[])


    async function action(formData: FormData) {
        const text = formData.get('commentbox')?.toString();
        if(!text) return;
        let comment: Comment | false = {
            comment: text,
            comment_by: 'me',
            comment_id: 'me'+Date.now(),
            post_id: post.post_id,
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
        <div ref={ref} style={{height: '3rem'}} className="absolute z-50  transition-all bottom-0 overflow-hidden   w-full max-w-xl flex flex-col bg-slate-800 rounded-t-2xl drop-shadow-lg border border-b-0 border-slate-950">
            <p className="w-full p-2 text-center text-lg underline-offset-8 underline ">Comments <Close onClick={close} className="float-right hover:scale-105 "/></p>
            <div ref={divRef} className="flex grow w-full  flex-col-reverse overflow-y-auto scrollbar-none">
                {optimisticComments.map(comment => <CommentComponent comment={comment} key={comment.comment_id} />)}
            </div>
            <form action={action} autoComplete="off" className="w-full p-2 select-none bg-inherit  flex gap-2 justify-center items-center">
                <input ref={inputRef} name="commentbox" placeholder="Comment" className="bg-inherit outline-none grow shrink border rounded-full p-1 hover:bg-slate-700 focus:bg-slate-700 active:bg-slate-700 px-5"/>
                <button><Send className="" /></button>
            </form>
        </div>
    )
}

function CommentComponent({comment}: {comment: Comment}){
    return (
        <div className="p-2">
            <div className="flex gap-2 text-wrap justify-start items-start">
                <p className="font-semibold">{comment.comment_by}</p>
                <p>{comment.comment}</p>
            </div>
            {comment.sending && <p className="text-sm animate-pulse">Posting</p>}
        </div>
    )
}
import { cibStyleshare, cilArrowThickRight, cilBookmark, cilChatBubble, cilCommentBubble, cilHeart, cilPaperPlane, cilSave, cilShare, cilShareAll, cilShareAlt, cilShareBoxed, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { MouseEvent, TouchEvent, UIEvent, useEffect, useState } from "react"
import { address } from "../api/api"
import { ArrowLeft, ArrowRight, Bookmark, BookmarkBorder, BookmarkSharp, ChatBubbleOutline, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, SendSharp, Share, ShareSharp } from "@mui/icons-material"
import { Italiana } from "next/font/google"
import images from "../images"
import assert from "assert"

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
    post_content: Array<string>,
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


export type SecondaryStats = {
    liked: boolean,
    saved: boolean,
}

export async function getServerSideProps() {
    axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`
    
    
}

export default function ImagePost(props: {post: PostIdentifier}) {

    const [post, setPost] = useState<Post | null>(null)
    const [stats, setStats] = useState<PostStats | null>(null)
    const [secStats, setSecStats] = useState<SecondaryStats | null>(null)
    const [pfp, setPfp] = useState<string | null>(null)
    
    // type PostContext =  {
    //     post: Post,
    //     stats: PostStats,
    //     secStats: SecondaryStats,
    //     pfp: string
    // }

    // const [ context , setContext ] = useState< PostContext | null >(null)

    useEffect(()=>{
        axios.get(
            address+'/post/fetchPost?post_id='+props.post.post_id,
        ).then((result)=>{
            if(result.data.success) {
                const post: Post = result.data.post;
                const stats: PostStats = result.data.stats;
                const secondaryStats: SecondaryStats = result.data.secondaryStats;
                const pfp: string = result.data.pfp;

                setPost(post);
                setStats(stats);
                setSecStats(secondaryStats);
                setPfp(pfp)    
                // setContext({post, stats, secStats: secondaryStats, pfp})
            }
        })
    }, [props.post.post_id])

    if(post==null || stats==null || secStats==null) return (<></>)

    function toggleLike() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        assert(secStats!=null)
        if(!secStats.liked) {
            axios.post(
                address+'/post/like',
                {post_id: props.post.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    const newStats = {
                        ...stats!,
                        post_likes_count: stats!.post_likes_count+1
                    }
                    const newSecStats = {
                        ...secStats!,
                        liked: true
                    }
                    setStats(newStats)
                    setSecStats(newSecStats)
                    // setContext({
                    //     ...context,
                    //     stats: newStats,
                    //     secStats: newSecStats
                    // })
                    // setStats(newStats)
                    // setSecStats()
                }
                
            }).catch((reason)=>{
                // setSecStats({
                //     ...secStats!,
                //     liked: false
                // })            
            })
        }else {
            axios.post(
                address+'/post/unlike',
                {post_id: props.post.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    const newStats = {
                        ...stats!,
                        post_likes_count: stats!.post_likes_count-1
                    }
                    const newSecStats = {
                        ...secStats!,
                        liked: false
                    }

                    setStats(newStats)
                    setSecStats(newSecStats)
                    // setContext({
                    //     ...context,
                    //     stats: newStats,
                    //     secStats: newSecStats
                    // })
                    // setStats(newStats)
                    // setSecStats({
                    //     ...secStats!,
                    //     liked: false
                    // })
                }
                
            }).catch((reason)=>{
                // setSecStats({
                //     ...secStats!,
                //     liked: true
                // })
            })
        }

    }

    function toggleSaved() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        assert(secStats!=null)
        if(!secStats.saved) {
            axios.post(
                address+'/post/save',
                {post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    const newStats = {
                        ...stats!,
                        post_save_count: stats!.post_save_count+1
                    }
                    const newSecStats = {
                        ...secStats!,
                        saved: true
                    }

                    setStats(newStats)
                    setSecStats(newSecStats)
                    // setContext({
                    //     ...context,
                    //     stats: newStats,
                    //     secStats: newSecStats
                    // })
                    // setStats(newStats)
                    // setSecStats({
                    //     ...secStats!,
                    //     saved: true
                    // })
                }
                
            }).catch((reason)=>{
                // setSecStats({
                //     ...secStats!,
                //     saved: false
                // })
            })
        }else {
            axios.post(
                address+'/post/unsave',
                {post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    const newStats = {
                        ...stats!,
                        post_save_count: stats!.post_save_count-1
                    }
                    const newSecStats = {
                        ...secStats!,
                        saved: false
                    }

                    setStats(newStats)
                    setSecStats(newSecStats)
                    // setContext({
                    //     ...context,
                    //     stats: newStats,
                    //     secStats: newSecStats
                    // })
                    // setStats(newStats)
                    // setSecStats({
                    //     ...secStats!,
                    //     saved: false
                    // })
                }
                
            }).catch((reason)=>{
                // setSecStats({
                //     ...secStats!,
                //     saved: true
                // })
            })
        }

    }

    let currentImgInView=0;

    let touchStart: number = 0;
    let touchEnd: number = 0;

    function touchStartHandler(event: TouchEvent<HTMLDivElement>): void {
        touchStart = event.touches[0].clientX;
        
    }


    function touchEndHandler(event: TouchEvent<HTMLDivElement>): void {
        touchEnd = event.changedTouches[0].clientX;
        const div: HTMLDivElement = document.getElementById('imageContainer'+props.post?.post_id) as HTMLDivElement; 
        
        if(touchEnd-touchStart>div.clientWidth/4) {
            swipe('left')
        }
        else if(touchStart-touchEnd>div.clientWidth/4) {
            swipe('right')
        }
    }

    function swipe(direction: 'left' | 'right') {
        const div: HTMLDivElement = document.getElementById('imageContainer'+props.post?.post_id) as HTMLDivElement; 
        const progressDots: HTMLDivElement = document.getElementById('progressDots'+props.post?.post_id) as HTMLDivElement
        
        if(direction=='left' && currentImgInView>0) {
            div.scrollTo({behavior: 'smooth', left: (currentImgInView-1)*(div.clientWidth+4)})
            // div.scrollBy({top: 0, left: -1*(div.clientWidth+4), behavior: 'smooth'})
            progressDots.children.item(currentImgInView)?.setAttribute('style', '')
            currentImgInView--;
            progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            return;
        }
        if(direction=='right' && currentImgInView<div.children.length-1) {
            div.scrollTo({behavior: 'smooth', left: (currentImgInView+1)*(div.clientWidth+4)})
            // div.scrollBy({top: 0, left: div.clientWidth+4, behavior: 'smooth'});
            progressDots.children.item(currentImgInView)?.setAttribute('style', '');
            currentImgInView++;
            progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            return;
        }

    }

    

    return (
        <div className="flex w-full relative border-r border-l border-b border-slate-600 text-slate-200  bg-slate-800">
            { screen.width>0 && <button onClick={()=>swipe('left')}  className="  "><ArrowLeft /></button>}
            <div className="">
                <div className="flex items-center  w-full gap-3 p-1 ">
                    <div className="w-[calc(10%)]  rounded-full overflow-hidden bg-gray-400">
                        { pfp ==null
                        ? <CIcon className="w-full h-full" icon={cilUser} /> 
                        : <Image className="w-full h-full " alt="img" width={0} height={0} src={`data:image/jpg;base64,${pfp}`}/>}
                    </div>
                    <div className="flex flex-col  justify-center">
                        <div className="shrink">
                            <p style={{fontSize: 'clamp(0.5rem, 10vh, 1rem)'}} className="  ">{props.post.post_user}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-inherit flex select-none border-b-slate-50 border-t-slate-50 border-b border-t">
                    <div id={"imageContainer"+props.post?.post_id} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler} className="flex gap-1 overflow-hidden">
                        
                        {post && post.post_content.map((image, idx)=>
                            <Image loading="lazy" key={idx}  className="w-full h-full select-none" alt="" width={0} height={0} src={`data:image/jpg;base64,${image}`} />

                        )}
                    </div>
                </div>
                {post && post.post_content.length>1 && 
                    <div id={"progressDots"+props.post?.post_id} className="h-3 flex gap-1  items-center justify-center">
                        { post.post_content.map((image, index) => (
                            <div style={index==0?{height: '8px', width: '8px'}:{}} className="h-1.5 w-1.5 transition-all bg-slate-200 rounded-full" key={index}>{}</div>
                        ))}
                    </div>
                }
                <div className="flex bg-inherit    justify-between">
                    <div className="w-1/3 h-full flex gap-2">
                        {/* {secStats &&  <button className={(secStats.liked?" text-blue-500 ": "")+' text-base bg-blue-200 px-2 rounded-lg w-20'} onClick={toggleLike}>{secStats.liked? 'Liked': 'Like'}</button> } */}
                        {secStats && secStats.liked ? <Favorite onClick={toggleLike} className="  text-red-600 drop-shadow-md" />: <FavoriteBorderOutlined onClick={toggleLike} /> }
                        {stats && <p>{stats.post_likes_count} like</p>}
                        {/* <CIcon className="w-[calc(25%)]  "  icon={cilCommentBubble}/> */}
                        {/* <CIcon className="w-[calc(25%)] "  icon={cilPaperPlane}/> */}
                    </div>
                    <div className="w-1/3 flex justify-end">
                        {/* { secStats && secStats.saved?<BookmarkSharp onClick={toggleSaved} className="w-[calc(25%)] h-full text-slate-500 drop-shadow-md" />: <CIcon icon={cilBookmark}  onClick={toggleSaved}  className="w-[calc(22%)]  " />} */}
                    </div>

                </div>
                <div className=" my-2 ">
                    <p className="flex gap-2 text-base items-center"><span className="font-bold ">{props.post.post_user}</span> {post!.post_caption}</p>
                </div>

            </div>
            { screen.width>0 && <button onClick={()=>swipe('right')} className=""><ArrowRight /></button>}
        </div>
    )
}
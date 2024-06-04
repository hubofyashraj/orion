import { cibStyleshare, cilArrowThickRight, cilBookmark, cilChatBubble, cilCommentBubble, cilHeart, cilPaperPlane, cilSave, cilShare, cilShareAll, cilShareAlt, cilShareBoxed, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { MouseEvent, TouchEvent, UIEvent, useEffect, useState } from "react"
import { address } from "../api/api"
import { Bookmark, BookmarkBorder, BookmarkSharp, ChatBubbleOutline, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, SendSharp, Share, ShareSharp } from "@mui/icons-material"
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

    function mousedownHandler(event: MouseEvent<HTMLDivElement>): void {
        
        touchStart = event.clientX;
        // console.log(touchStart);
        
    }

    function touchStartHandler(event: TouchEvent<HTMLDivElement>): void {
        
        touchStart = event.touches[0].clientX;
        // console.log(touchStart);
        
    }

    function mouseupHandler(event: MouseEvent<HTMLDivElement>): void {
        console.log(event.clientX);
        
        touchEnd = event.clientX;
        const div: HTMLDivElement = document.getElementById('imageContainer'+props.post?.post_id) as HTMLDivElement; 
        const progressDots: HTMLDivElement = document.getElementById('progressDots'+props.post?.post_id) as HTMLDivElement
        console.log(progressDots);
        
        if(touchEnd-touchStart>div.clientWidth/4) {

            if(currentImgInView>0) {
                div.scrollBy({top: 0, left: -1*div.clientWidth, behavior: 'smooth'})
                progressDots.children.item(currentImgInView)?.setAttribute('style', '')
                currentImgInView--;
                progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')

            }
            // div.scrollBy({top: 0, left: -1*div.clientWidth, behavior: 'smooth'})
        }
        else if(touchStart-touchEnd>div.clientWidth/4) {
            if(currentImgInView<div.children.length-1) {
                div.scrollBy({top: 0, left: div.clientWidth, behavior: 'smooth'})
                progressDots.children.item(currentImgInView)?.setAttribute('style', '')
                currentImgInView++;
                progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            }
        }
    }

    function touchEndHandler(event: TouchEvent<HTMLDivElement>): void {
        // console.log(event.changedTouches[0].clientX);
        
        touchEnd = event.changedTouches[0].clientX;
        const div: HTMLDivElement = document.getElementById('imageContainer'+props.post?.post_id) as HTMLDivElement; 
        const progressDots: HTMLDivElement = document.getElementById('progressDots'+props.post?.post_id) as HTMLDivElement
        
        if(touchEnd-touchStart>div.clientWidth/4) {

            if(currentImgInView>0) {
                div.scrollBy({top: 0, left: -1*div.clientWidth, behavior: 'smooth'})
                progressDots.children.item(currentImgInView)?.setAttribute('style', '')
                currentImgInView--;
                progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')

            }
            // div.scrollBy({top: 0, left: -1*div.clientWidth, behavior: 'smooth'})
        }
        else if(touchStart-touchEnd>div.clientWidth/4) {
            if(currentImgInView<div.children.length-1) {
                div.scrollBy({top: 0, left: div.clientWidth, behavior: 'smooth'})
                progressDots.children.item(currentImgInView)?.setAttribute('style', '')
                currentImgInView++;
                progressDots.children.item(currentImgInView)?.setAttribute('style', 'width: 8px; height: 8px')
            }
        }
    }
    

    return (
        <div className="w-full  border-2 border-b-0 bg-slate-100">
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
            <div className="bg-inherit select-none border-b-slate-50 border-t-slate-50 border-b-2 border-t-2">
                <div id={"imageContainer"+props.post?.post_id} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler}  onMouseDown={mousedownHandler} onMouseUp={mouseupHandler}  className="flex overflow-hidden">
                    
                    {post && post.post_content.map((image, idx)=>
                        <Image loading="lazy" key={idx} className="w-full h-full" alt="" width={0} height={0} src={`data:image/jpg;base64,${image}`} />

                    )}
                </div>
            </div>
            {post && post.post_content.length>1 && 
                <div id={"progressDots"+props.post?.post_id} className="h-3 flex gap-1 items-center justify-center">
                    { post.post_content.map((image, index) => (
                        <div style={index==0?{height: '8px', width: '8px'}:{}} className="h-1.5 w-1.5 transition-all bg-black rounded-full" key={index}>{}</div>
                    ))}
                </div>
            }
            <div className="flex bg-inherit  px-2  text-4xl justify-between">
                <div className="w-1/3 h-full flex gap-2">
                    {secStats && secStats.liked?  <Favorite onClick={toggleLike} className="w-[calc(25%)] h-full text-red-600 drop-shadow-md" />: <CIcon icon={cilHeart}  onClick={toggleLike}  className="w-[calc(25%)] " /> }
                    <CIcon className="w-[calc(25%)]  "  icon={cilCommentBubble}/>
                    <CIcon className="w-[calc(25%)] "  icon={cilPaperPlane}/>
                </div>
                <div className="w-1/3 flex justify-end">
                    { secStats && secStats.saved?<BookmarkSharp onClick={toggleSaved} className="w-[calc(25%)] h-full text-slate-500 drop-shadow-md" />: <CIcon icon={cilBookmark}  onClick={toggleSaved}  className="w-[calc(22%)]  " />}
                </div>

            </div>
            <div className="px-2 ">
                <p className="flex gap-2"><span className="font-bold">{props.post.post_user}</span> {post!.post_caption}</p>
            </div>

        </div>
    )
}
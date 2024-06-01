import { cibStyleshare, cilArrowThickRight, cilBookmark, cilChatBubble, cilCommentBubble, cilHeart, cilPaperPlane, cilSave, cilShare, cilShareAll, cilShareAlt, cilShareBoxed, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { TouchEvent, UIEvent, useEffect, useState } from "react"
import { address } from "../api/api"
import { Bookmark, BookmarkBorder, BookmarkSharp, ChatBubbleOutline, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, SendSharp, Share, ShareSharp } from "@mui/icons-material"
import { Italiana } from "next/font/google"
import images from "../images"

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
    post_caption: string
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

export default function ImagePost(props: {post: PostIdentifier}) {

    const [photo, setPhoto] = useState('')
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [content, setContent] = useState([] as Array<string>)
    const [likeCount, setLikeCount] = useState(0);
    const [caption, setCaption] = useState('');

    useEffect(()=>{
        axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+'/profile/fetchPFP?user='+props.post.post_user,
        ).then((result)=>{
            if(result.data.success) {
                setPhoto(result.data.image)
            }
        })
    }, [props.post.post_user])
  
    useEffect (()=>{
        axios.defaults.headers.common['Authorization']=`Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+'/post/fetchPost?post_id='+props.post.post_id,
        ).then((result)=>{
            if(result.data.success) {
                const post: Post = result.data.post;
                const stats: PostStats = result.data.stats;
                const secondaryStats: SecondaryStats = result.data.secondaryStats;
                console.log(post.post_content);
                
                setContent(post.post_content);
                setCaption(post.post_caption);
                setLikeCount(stats.post_likes_count);
                setLiked(secondaryStats.liked);
                setSaved(secondaryStats.saved);

            }
        })
    }, [props.post.post_id])


    function toggleLike() {
        if(!liked) {
            axios.post(
                address+'/post/like',
                {token: localStorage.getItem('token'), post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    setLikeCount(likeCount+1);
                }
                setLiked(true)
            }).catch((reason)=>{
                setLiked(false);
            })
        }else {
            axios.post(
                address+'/post/unlike',
                {token: localStorage.getItem('token'), post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    setLikeCount(likeCount-1);
                }
                setLiked(false)
            }).catch((reason)=>{
                setLiked(true);
            })
        }

    }

    function toggleSaved() {
        if(!saved) {
            axios.post(
                address+'/post/save',
                {token: localStorage.getItem('token'), post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    // setLikeCount(likeCount+1);
                }
                setSaved(true)
            }).catch((reason)=>{
                setSaved(false);
            })
        }else {
            axios.post(
                address+'/post/unsave',
                {token: localStorage.getItem('token'), post_id: props.post?.post_id}
            ).then((result)=>{
                if(result.data.success) {
                    // setLikeCount(likeCount-1);
                }
                setSaved(false)
            }).catch((reason)=>{
                setSaved(true);
            })
        }

    }

    function scrollHandler(event: UIEvent<HTMLDivElement>): void {
        // event.preventDefault()
        console.log('here');
        
        const container = event.target as HTMLDivElement
        const currentScrollPosition = container.scrollLeft;
        
        
        // console.log(event);
        
    }

    let currentImgInView=0;

    let touchStart: number = 0;
    let touchEnd: number = 0;
    function touchStartHandler(event: TouchEvent<HTMLDivElement>): void {
        
        touchStart = event.touches[0].clientX;
        console.log(touchStart);
        
    }

    function touchEndHandler(event: TouchEvent<HTMLDivElement>): void {
        console.log(event.changedTouches[0].clientX);
        
        touchEnd = event.changedTouches[0].clientX;
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
    

    return (
        <div className="w-full my-1 bg-slate-100">
            <div className="flex items-center  w-full gap-3 p-1 ">
                <div className="w-[calc(10%)]  rounded-full overflow-hidden bg-gray-400">
                    { photo==''
                    ? <CIcon className="w-full h-full" icon={cilUser} /> 
                    : <Image className="w-full h-full " alt="img" width={0} height={0} src={`data:image/jpg;base64,${photo}`}/>}
                </div>
                <div className="flex flex-col  justify-center">
                    <div className="shrink">
                        <p style={{fontSize: 'clamp(0.5rem, 10vh, 1rem)'}} className="  ">{props.post.post_user}</p>
                    </div>
                </div>
            </div>
            <div className="bg-inherit select-none border-b-slate-50 border-t-slate-50 border-b-2 border-t-2">
                <div id={"imageContainer"+props.post?.post_id} onTouchStart={touchStartHandler} onTouchEnd={touchEndHandler} onScroll={scrollHandler} className="flex overflow-hidden">
                    {content.map(image=>
                        <Image key={content.indexOf(image)} className="w-full h-full" alt="" width={0} height={0} src={`data:image/jpg;base64,${image}`} />

                    )}
                </div>
            </div>
            {content.length>1 && 
                <div id={"progressDots"+props.post?.post_id} className="h-3 flex gap-1 items-center justify-center">
                    { content.map((image, index) => (
                        <div style={index==0?{height: '8px', width: '8px'}:{}} className="h-1.5 w-1.5 transition-all bg-black rounded-full" key={index}>{}</div>
                    ))}
                </div>
            }
            <div className="flex bg-inherit  px-2  text-4xl justify-between">
                <div className="w-1/3 h-full flex gap-2">
                    { liked?  <Favorite onClick={toggleLike} className="w-[calc(25%)] h-full text-red-600 drop-shadow-md" />: <CIcon icon={cilHeart}  onClick={toggleLike}  className="w-[calc(25%)] " /> }
                    <CIcon className="w-[calc(25%)]  "  icon={cilCommentBubble}/>
                    <CIcon className="w-[calc(25%)] "  icon={cilPaperPlane}/>
                </div>
                <div className="w-1/3 flex justify-end">
                    {saved?<BookmarkSharp onClick={toggleSaved} className="w-[calc(25%)] h-full text-slate-500 drop-shadow-md" />: <CIcon icon={cilBookmark}  onClick={toggleSaved}  className="w-[calc(22%)]  " />}
                </div>

            </div>
            <div className="px-2 ">
                <p className="flex gap-2"><span className="font-bold">{props.post.post_user}</span> {caption}</p>
            </div>

        </div>
    )
}
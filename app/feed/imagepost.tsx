import { cibStyleshare, cilArrowThickRight, cilBookmark, cilChatBubble, cilCommentBubble, cilHeart, cilPaperPlane, cilSave, cilShare, cilShareAll, cilShareAlt, cilShareBoxed, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { address } from "../api/api"
import { Grid, Icon } from "@mui/material"
import { Bookmark, BookmarkBorder, BookmarkSharp, ChatBubbleOutline, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, SendSharp, Share, ShareSharp } from "@mui/icons-material"
import { Italiana } from "next/font/google"
import images from "../images"


export default function ImagePost(props: {user: string, postid: string}) {

    const [photo, setPhoto] = useState('')
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    useEffect (()=>{
        axios.post(
            address+'/profile/fetchProfileImage',
            {token: localStorage.getItem('token'), user: props.user}
        ).then((result)=>{
            if(result.data.success) {
                setPhoto(result.data.image)
            }
        })
    }, [props.user])

    function toggleLike() {
        setLiked(!liked)
    }

    function toggleSaved() {
        setSaved(!saved)
    }

    return (
        <div className="w-full  bg-slate-100">
            <div className="flex items-center  w-full gap-3 p-1 ">
                <div className="w-[calc(10%)]  rounded-full overflow-hidden bg-gray-400">
                    { photo==''
                    ? <CIcon className="w-full h-full" icon={cilUser} /> 
                    : <Image className="w-full h-full " alt="img" width={0} height={0} src={photo}/>}
                </div>
                <div className="flex flex-col  justify-center">
                    <div className="shrink">
                        <p style={{fontSize: 'clamp(0.5rem, 10vh, 1rem)'}} className="  ">{props.user}</p>
                    </div>
                </div>
            </div>
            <div className="bg-inherit border-b-slate-50 border-t-slate-50 border-b-2 border-t-2">
                <div>
                    <Image className="w-full h-full" alt="" width={0} height={0} src={images.demo.src} />
                </div>
            </div>
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
                <p className="flex gap-2"><span className="font-bold">{props.user}</span> Test caption</p>
            </div>

        </div>
    )
}
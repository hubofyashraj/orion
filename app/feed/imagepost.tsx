import { cibStyleshare, cilArrowThickRight, cilChatBubble, cilCommentBubble, cilHeart, cilPaperPlane, cilSave, cilShare, cilShareAll, cilShareAlt, cilShareBoxed, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import axios from "axios"
import Image from "next/image"
import { useEffect, useState } from "react"
import { address } from "../api/api"
import { Grid, Icon } from "@mui/material"
import { BookmarkBorder, ChatBubbleOutline, Favorite, FavoriteBorder, FavoriteBorderOutlined, FavoriteBorderSharp, FavoriteBorderTwoTone, FavoriteOutlined, Light, SendSharp, Share, ShareSharp } from "@mui/icons-material"
import { Italiana } from "next/font/google"
import images from "../images"


export default function ImagePost(props: {user: string, postid: string}) {

    const [photo, setPhoto] = useState('')
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

    return (
        <div className="w-full md:w-1/3 h-36 bg-slate-100">
            <div className="flex gap-3 h-12 p-1 ">
                <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-400">
                    { photo==''
                    ? <CIcon className="w-full h-full" icon={cilUser} /> 
                    : <Image className="w-full h-full " alt="img" width={0} height={0} src={photo}/>}
                </div>
                <div className="grow flex items-center">
                    <p className=" ">{props.user}</p>
                </div>
            </div>
            <div className="bg-inherit border-b-slate-50 border-t-slate-50 border-b-2 border-t-2">
                <div>
                    <Image className="w-full h-full" alt="" width={0} height={0} src={images.demo.src} />
                </div>
            </div>
            <div className="flex bg-inherit  px-2  text-4xl justify-between">
                <div className="flex gap-2">
                    <FavoriteBorderSharp  className="" fontSize="inherit"  />
                    <CIcon className="w-8 h-9"  icon={cilCommentBubble}/>
                    <CIcon className="w-8 h-9"  icon={cilPaperPlane}/>
                </div>
                <div>
                    <BookmarkBorder className="" fontWeight={''} fontSize="inherit" />
                </div>

            </div>

        </div>
    )
}
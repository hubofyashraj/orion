'use client'
import { fetchInfo } from "../api/profile/profile";
import ProfilePicture from "./profilePicture";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { AlternateEmail, Settings } from "@mui/icons-material";
import Edit from "./edit";
import MyPosts from "./myPosts";

export default function Profile() {
    const [info, setInfo] = useState< ProfileInfo | undefined >(undefined);    
    const [edit, showEdit] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        fetchInfo().then((infoString)=>{
            if(infoString) {
                const info = JSON.parse(infoString) as ProfileInfo;
                setInfo(info);
            }
        })
    }, [refresh])

    if(!info) return (<></>)


    const goBack = (doRefresh: boolean) => {
        showEdit(false); 
        if(doRefresh) setRefresh(!refresh)
    }

    return (
        !edit
        ? <div className="relative bg-slate-700 text-slate-300 h-full w-full ">
            {<div className="flex flex-col h-full relative  justify-start sm:justify-start sm:items-start  items-center gap-5  overflow-y-auto scrollbar-none">
                <div className="details w-full h-full flex flex-col gap-12 justify-center sm:items-start items-center grow">
                    <div className="relative flex w-full h-36 bg-slate-800 flex-col sm:gap-6 sm:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  self-end flex-col justify-center items-center sm:items-start">
                            <p className="text-xl">{info.fullname}</p>
                            <div className="text-base flex justify-center items-center gap-1 ">
                                <AlternateEmail className="text-red-600 " fontSize="inherit" />
                                <p>{info.username}</p>
                            </div>
                        </div>
                        <div className="absolute  sm:text-left w-full h-full text-center  bottom-0 flex justify-center gap-36 items-end  sm:flex-col sm:justify-end sm:items-start sm:gap-0  sm:w-1/2 md:w-3/5 lg:w-2/3 xl:w-3/4 sm:right-0 sm:px-10 sm:text-slate-400">
                            <p className="w-1/2 sm:w-32 flex flex-col sm:flex-row justify-between">Connections<span>{info.connectionsCount}</span></p>
                            <p className=" w-1/2 sm:w-32 flex flex-col sm:flex-row justify-between">posts<span>{info.postsCount}</span></p>
                        </div>
                        <ProfilePicture info={info} />
                    </div>
                    
                    <div className="grow px-2 flex flex-col w-full ">
                        <MyPosts user={info.username} />
                    </div>
                </div>
                <div className="absolute  top-5 right-6">
                    <p onClick={() => showEdit(true)}><Settings /></p>
                </div>
                <ToastContainer />
            </div>}
        
          </div>
        : <Edit info={info} close={goBack} />

    )


}

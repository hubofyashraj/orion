'use client'
import { ChangeEvent, useEffect, useRef, useState } from "react";
import CropComponent from "./CropComponent";
import ProfilePictureComponent from "../components/pfp";
import { revalidatePath } from "next/cache";

export default function ProfilePicture({
    info, refresh
}: {
    info: ProfileInfo, refresh: () => void
}) {

    const [imageChosen, setImageChosen] = useState(false)
    
    const fileSelected = useRef<File | null>(null)

    const [refetch, setRftch] = useState(false);

    function onChangeHandler(e: ChangeEvent) {
        const file = (e.target as HTMLInputElement).files![0]
        fileSelected.current=file
        setImageChosen(true);
    }


    if(!info) return (<></>)

    return (
        <div className=" sm:ml-10 sm:mt-20 p-2  rounded-full bg-inherit">
            <div className="h-32 w-32 shrink-0  profile-img relative rounded-full bg-slate-800 overflow-hidden flex justify-center items-center">
                <ProfilePictureComponent refetch={refetch} size={128} user={info.username} hasPFP={info.pfp_uploaded} priority />
                <div onClick={() => { document.getElementById('pickInput')?.click() }} className="cursor-pointer select-none h-32 w-32 bg-black opacity-0 hover:opacity-50 absolute rounded-full text-center" >
                    <p className="text-white mt-12 ">Edit Profile Picture</p>
                    <input onChange={onChangeHandler} id="pickInput" className="hidden" placeholder="" type="file" />
                </div>
            </div>
            {imageChosen &&
                <CropComponent 
                file={fileSelected.current!} 
                close={(uploadSuccess)=>{
                    setImageChosen(false) 
                    console.log({uploadSuccess});
                    
                    if(uploadSuccess) {
                        setRftch(!refetch)
                    }
                } } 
                />
            }
        </div>
    )
}


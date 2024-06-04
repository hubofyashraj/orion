import axios from "axios";
import { ChangeEvent, Component, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import { address } from "../api/api";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilArrowThickLeft, cilAt, cilBackspace, cilBirthdayCake, cilEnvelopeClosed, cilEnvelopeLetter, cilLocationPin, cilPhone, cilPlus, cilSettings, cilUser, cilUserFemale, cilUserX, cilX } from "@coreui/icons";
import { CircularProgress } from "@mui/material";
import { Blob } from "buffer";
import CropComponent from "./CropComponent";
import { Bounce, ToastContainer, toast } from "react-toastify";
import CircularLoader from "../Loader/Loader";
import UserPosts from "./userPosts";



type Info = {
    username: string, fullname: string, dob: string, profession: string,
    location: string, bio: string, gender: string,
    email: string, contact: string, contact_privacy: boolean
    pfp_uploaded: boolean,
    [key: string]: string | boolean | Blob | null
}


export default function Profile(props: { setPage: Function }) {
    const [info, setInfo] = useState<null | Info>(null)
    const [imgsrc, setSrc] = useState<null | string>(null);
    
    const [imageChosen, setImageChosen] = useState(false)

    const [updated, setUpdated] = useState(false);

    const fileSelected = useRef<File | null>(null)
    const infoReq = useRef<Promise<void>>()



    async function fetchPfp() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address + '/profile/fetchPFP',
        ).then((result) => {
            setSrc(`data:image/png;base64,${result.data.image}`)
        }).catch((err)=>{
            console.log(err);
            
        })
    }

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address + '/profile/fetchinfo',
        ).then((result) => {
            console.log(result);
            
            const info = result.data.info as Info;
            setInfo(info);
            if(info.pfp_uploaded) fetchPfp()
        }).catch((err)=>{
            console.log(err);
        })
    }, [updated])

    function onChangeHandler(e: ChangeEvent) {
        const file = (e.target as HTMLInputElement).files![0]
        fileSelected.current=file
        setImageChosen(true);

    }

    if (info==null) return (
       <CircularLoader />
    )
    else return (
        <div className="relative h-[calc(100vh-64px)] w-full ">
            <div className="flex flex-col h-full  bg-blue-100 justify-start sm:justify-start sm:items-start  items-center gap-5 p-2 overflow-y-auto scrollbar-none">
                <div className="details w-full flex flex-col justify-center sm:items-start items-center grow">
                    <div className="flex w-full  flex-col sm:gap-12 sm:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  flex-col justify-center items-center sm:items-start">
                            <p className="text-xl">{info.fullname}</p>
                            <p className="text-base flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilAt} />{info.username}</p>
                            {/* <p className="text-sm flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilLocationPin} />{info.location}</p> */}
                        </div>
                        <div className="h-32 w-32 shrink-0 my-4 profile-img relative rounded-full bg-red-500 overflow-hidden flex justify-center items-center">
                            {imgsrc 
                                ? <Image className="w-full h-full" width={100} height={100} src={imgsrc} alt={""} /> 
                                : <CIcon className="text-black h-2/3" icon={info.gender == 'Male' ? cilUser : cilUserFemale} size="xxl" /> 
                            }
                            <div onClick={() => { document.getElementById('pickInput')?.click() }} className="cursor-pointer select-none h-32 w-32 bg-black opacity-0 hover:opacity-50 absolute rounded-full text-center" >
                                <p className="text-white mt-12 ">Edit Profile Picture</p>
                                <input onChange={onChangeHandler} id="pickInput" className="hidden" placeholder="" type="file" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="w-full text-center md:text-start">
                        <p className=" w-full text-xl">About Me</p>
                        <p className=" w-full "> {info.bio}</p>
                        <div className="self-start mt-5 text-left flex flex-col items-center md:items-start gap-2 text-sm">
                            <a href={"mailto:" + info.email} type="email" className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilEnvelopeClosed} />{info.email}</a>
                            {<a href={"tel:" + info.contact} type="tel" className="flex gap-1 items-center"><CIcon className="h-4  text-orange-500" icon={cilPhone} />{info.contact}</a>}
                            <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilBirthdayCake} />{info.dob}</p>
                            <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={info.gender == 'Male' ? cilUser : cilUserFemale} />{info.gender}</p>
                        </div>
                    </div> */}
                    <div className="grow  w-full border-t-2 ">
                        <p className="text-xl py-2 text-center sm:text-left">Posts</p>
                        <UserPosts />
                    </div>
                </div>
                <div>

                </div>
                <div className="absolute top-5 right-6">
                    <p onClick={() => { props.setPage('edit') }}><CIcon className="h-5" icon={cilSettings} /></p>
                </div>
                <ToastContainer />
            </div>
            {imageChosen &&
                <CropComponent 
                file={fileSelected.current!} 
                close={()=>{setImageChosen(false) } } 
                setFetch={()=>{
                    setUpdated(!updated); 
                    toast('Updated!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                        transition: Bounce,
                    }
                )}} />
            }
        </div>
    );
}


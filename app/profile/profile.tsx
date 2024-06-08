import axios from "axios";
import { ChangeEvent, Component, MouseEvent, MouseEventHandler, useEffect, useRef, useState } from "react";
import { address } from "../api/api";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilArrowLeft, cilArrowThickLeft, cilAt, cilBackspace, cilBirthdayCake, cilEnvelopeClosed, cilEnvelopeLetter, cilLocationPin, cilPhone, cilPlus, cilSettings, cilUser, cilUserFemale, cilUserX, cilX } from "@coreui/icons";
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
        <div className="relative bg-slate-700 text-slate-300 h-[calc(100vh-64px)] w-full ">
            <div className="flex flex-col h-full relative  justify-start sm:justify-start sm:items-start  items-center gap-5  overflow-y-auto scrollbar-none">
                <div className="details w-full flex flex-col gap-12 justify-center sm:items-start items-center grow">
                    <div className="relative flex w-full h-36 bg-slate-800 flex-col sm:gap-6 sm:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  self-end flex-col justify-center items-center sm:items-start">
                            <p className="text-xl">{info.fullname}</p>
                            <p className="text-base flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilAt} />{info.username}</p>
                            {/* <p className="text-sm flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilLocationPin} />{info.location}</p> */}
                        </div>
                        <div className=" sm:ml-10 sm:mt-20 p-2  rounded-full bg-inherit">
                            <div className="h-32 w-32 shrink-0  profile-img relative rounded-full bg-red-500 overflow-hidden flex justify-center items-center">
                                {imgsrc 
                                    ? <Image className="w-full h-full " width={100} height={100} src={imgsrc} alt={""} /> 
                                    : <CIcon className="text-black h-2/3" icon={info.gender == 'Male' ? cilUser : cilUserFemale} size="xxl" /> 
                                }
                                <div onClick={() => { document.getElementById('pickInput')?.click() }} className="cursor-pointer select-none h-32 w-32 bg-black opacity-0 hover:opacity-50 absolute rounded-full text-center" >
                                    <p className="text-white mt-12 ">Edit Profile Picture</p>
                                    <input onChange={onChangeHandler} id="pickInput" className="hidden" placeholder="" type="file" />
                                </div>
                            </div>
                        </div>
                        <div className="absolute  sm:text-left w-full h-full text-center  bottom-0 flex justify-center gap-36 items-end  sm:flex-col sm:justify-end sm:items-start sm:gap-0  sm:w-1/2 md:w-3/5 lg:w-2/3 xl:w-3/4 sm:right-0 sm:px-10 sm:text-slate-400">
                            <p className="w-1/2 sm:w-32 sm:flex justify-between">Connections<p>12</p></p>
                            <p className=" w-1/2 sm:w-32 sm:flex justify-between">posts<p>12</p></p>
                        </div>
                    </div>
                    
                    <div className="grow px-2  w-full ">
                        <p className="text-xl py-2 sm:ml-16 sm:px-2 text-center sm:text-left">Posts</p>
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


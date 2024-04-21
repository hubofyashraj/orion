import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { address } from "../api/api";
import { user } from "../data/user";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilAt, cilBirthdayCake, cilEnvelopeClosed, cilEnvelopeLetter, cilLocationPin, cilPhone, cilSettings, cilUser, cilUserFemale, cilUserX } from "@coreui/icons";
import { pullbackReq, sendConnectionRequest } from "./events";
import { handleRequest } from "../navbar/notifications";
import { userInfo } from "os";


interface Info {
    username: string, fullname: string, dob: string, profession: string, 
    location: string, bio: string, gender: string, 
    email: string, contact: string, contact_privacy: boolean
    profile_image: string | null,
    [key: string]: string | boolean | Blob | null
}


export default function UserProfile({ user } : {user: string}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({} as Info)
    const [connectionStatus, setStatus] = useState('none');
    const [imgsrc, setSrc] = useState('');
    const [fetched, setFetched] = useState(false);
    const [err, setErr] = useState(false);
    const [req_id, setReqId] = useState('');


    useEffect(()=>{


        function fetchInfo() :Promise<void>{
            return new Promise((resolve, reject)=>{
                axios.post(
                    address+'/profile/fetchinfo',
                    {token: localStorage.getItem('token'), user}
                ).then((result)=>{
                    // console.log(result.data);
                    
                    if(result.data.success) {
                        const info = result.data.result.info
                        setUserData(info);
                        setSrc(info.profile_image);
                        setStatus(result.data.result.status);
                        setReqId(result.data.result.id);
                        resolve()
                    }else {
                        reject()
                    }

                })
            })
        }

        if(localStorage.getItem('token')){
            setLoggedIn(true);
            fetchInfo().then(()=>{
                setFetched(true);
                setErr(false)
            }).catch(()=>{
                setErr(true);
                setFetched(true)
            })
            
        }
    }, [user])



    if(err) return (<div className="h-full w-full flex justify-center items-center "><p className="text-5xl">Error!!</p></div>)
    if(!fetched) return (<></>);
    
    return (
        <div className=" px-6 h-full w-full  scrollbar-thin ">
            <div className="flex flex-col  justify-center md:justify-start md:items-start  items-center gap-5 p-2">
                <div className="details w-full  flex flex-col justify-center md:items-start items-center grow">
                    <div className="flex w-full flex-col md:gap-12 md:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  flex-col justify-center items-center md:items-start">
                            <p className="text-xl">{userData.fullname}</p>
                            <p className="text-base flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"}  icon={cilAt}/>{userData.username}</p>
                            <p className="text-sm flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilLocationPin} />{userData.location}</p>
                        </div>
                        <div className="h-32 w-32 shrink-0 my-4 profile-img rounded-full bg-red-500 overflow-hidden flex justify-center items-center">
                            { imgsrc==''?<CIcon  className="text-black h-2/3" icon={userData.gender=='Male'?cilUser:cilUserFemale} size="xxl"/>:<Image width={100} height={100} className="w-full h-full" alt="" src={imgsrc}/> }
                        </div>
                    </div>
                    <div className="flex w-full justify-between gap-24">
                        <div className="w-full text-center md:text-start">
                            <p className=" w-full text-xl">About Me</p>
                            <p className=" w-full "> {userData.bio }</p>
                            <div className="self-start mt-5 text-left flex flex-col gap-2 text-sm">
                                { <a href={"tel:"+userData.contact} type="tel" className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilPhone} />{userData.contact}</a>}
                                <a href={"mailto:"+userData.email} type="email" className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilEnvelopeClosed} />{userData.email}</a>
                                <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilBirthdayCake} />{userData.dob}</p>
                                <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={userData.gender=='Male'?cilUser:cilUserFemale} />{userData.gender}</p>
                            </div>
                        </div>
                        <div className="flex flex-col-reverse">
                            <div className="shrink-0 shadow-sm  hover:bg-opacity-30 flex ">
                                {
                                    connectionStatus=='none' 
                                    &&
                                    <a onClick={async ()=>{var id = await sendConnectionRequest(user);  setStatus('outgoing'); setReqId(id.insertedId)}} className='hover:text-violet-500 cursor-pointer'>Connect</a>

                                }
                                {
                                    connectionStatus=='connected' && <p>Connected</p>
                                }
                                {
                                    connectionStatus=='incoming' 
                                    && 
                                    <div className="flex gap-5">
                                        <a onClick={()=>{handleRequest(req_id, true)}} className='hover:text-violet-500 cursor-pointer'>Accept</a>
                                        <a onClick={()=>{handleRequest(req_id, false)}} className='hover:text-violet-500 cursor-pointer'>Decline</a>
                                    </div>

                                }
                                {
                                    connectionStatus=='outgoing'
                                    &&
                                    <div>
                                        <a onClick={async ()=>{await pullbackReq(req_id); setStatus('none')}} className='hover:text-violet-500 cursor-pointer'>Cancel</a>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                
                
            </div>
        </div>
    );
}


import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { address } from "../api/api";
import { user } from "../data/user";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilAt, cilBirthdayCake, cilEnvelopeClosed, cilEnvelopeLetter, cilLocationPin, cilPhone, cilSettings, cilUser, cilUserFemale, cilUserX } from "@coreui/icons";
import { CircularProgress } from "@mui/material";


interface Info {
    username: string, fullname: string, dob: string, profession: string, 
    location: string, bio: string, gender: string, 
    email: string, contact: string, contact_privacy: boolean
    profile_image: string | null,
    [key: string]: string | boolean | Blob | null
}


export default function Profile(props: {setPage: Function}) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({} as Info)
    const [imgsrc, setSrc] = useState('');
    const [fetched, setFetched] = useState(false);

    function fetchInfo() :Promise<Info>{
        return new Promise((resolve, reject)=>{
            axios.post(
                address+'/profile/fetchinfo',
                {token: localStorage.getItem('token'), user: sessionStorage.getItem('user')}
            ).then((result)=>{
                resolve(result.data.info)
            })
        })
    }


    useEffect(()=>{
        if(localStorage.getItem('token')){
            setLoggedIn(true);
            fetchInfo().then((info)=>{
                setUserData(info);
                setSrc(info.profile_image!)
                setFetched(true);
            })
        }
    }, [imgsrc])


    function test(e: ChangeEvent) {
        const file = (e.target as HTMLInputElement).files![0]
        var blb = new FileReader();

        blb.readAsDataURL(file);

        blb.onload=()=>{
            console.log(blb.result);
            axios.post(
                address+'/profile/saveimage',
                {token: localStorage.getItem('token'), image: blb.result}
            ).then(()=>{
                setSrc(blb.result as string)
            })
        }
        blb.onerror=()=>{
            alert('err')
            
        }
    }

    if(!fetched) return (<div className="w-full h-full flex flex-col gap-5 justify-center  items-center"><CircularProgress className=" h-20 w-20 "  /><p className="animate-bounce text-xl text-slate-400">Loading</p></div>)

    return (
        <div className=" px-6 h-full w-full overflow-y-scroll scrollbar-thin ">
            <div className="flex flex-col  justify-center md:justify-start md:items-start  items-center gap-5 p-2">
                <div className="details w-full  flex flex-col justify-center md:items-start items-center grow">
                    <div className="flex w-full flex-col md:gap-12 md:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  flex-col justify-center items-center md:items-start">
                            <p className="text-xl">{userData.fullname}</p>
                            <p className="text-base flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"}  icon={cilAt}/>{userData.username}</p>
                            <p className="text-sm flex justify-center items-center gap-1"><CIcon className="h-3 text-red-500" size={"sm"} icon={cilLocationPin} />{userData.location}</p>
                        </div>
                        <div className="h-32 w-32 shrink-0 my-4 profile-img rounded-full bg-red-500 overflow-hidden flex justify-center items-center">
                            { imgsrc==''?<CIcon  className="text-black h-2/3" icon={userData.gender=='Male'?cilUser:cilUserFemale} size="xxl"/>:<Image className="w-full h-full" width={100} height={100} src={imgsrc} alt={""}/> }
                            <div onClick={()=>{document.getElementById('pickInput')?.click()}} className="cursor-pointer select-none h-32 w-32 bg-black opacity-0 hover:opacity-50 absolute rounded-full text-center" >
                                <p className="text-white mt-12 ">Edit Profile Picture</p>
                                <input onChange={test} id="pickInput" className="hidden" placeholder="" type="file"/>
                            </div> 
                        </div>
                    </div>
                    <div className="w-full text-center md:text-start">
                        <p className=" w-full text-xl">About Me</p>
                        <p className=" w-full "> {userData.bio }</p>
                        <div className="self-start mt-5 text-left flex flex-col items-center md:items-start gap-2 text-sm">
                            <a href={"mailto:"+userData.email} type="email" className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilEnvelopeClosed} />{userData.email}</a>
                            { <a href={"tel:"+userData.contact} type="tel" className="flex gap-1 items-center"><CIcon className="h-4  text-orange-500" icon={cilPhone} />{userData.contact}</a>}
                            <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={cilBirthdayCake} />{userData.dob}</p>
                            <p className="flex gap-1 items-center"><CIcon className="h-4 text-orange-500" icon={userData.gender=='Male'?cilUser:cilUserFemale} />{userData.gender}</p>
                        </div>
                    </div>
                </div>
                <div>
                    
                </div>
                <div className="absolute right-6">
                    <p onClick={()=>{props.setPage('edit')}}><CIcon className="h-5"  icon={cilSettings}/></p>
                </div>
                
            </div>
        </div>
    );
}
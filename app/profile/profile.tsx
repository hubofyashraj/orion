import axios from "axios";
import { useEffect, useState } from "react";
import { address } from "../api/api";
import { user } from "../data/user";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilUser, cilUserX } from "@coreui/icons";

export default function Profile() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState({fullname: 'John Doe', username: '_.doejohn'})

    useEffect(()=>{
        if(localStorage.getItem('token')){
            setLoggedIn(true);
            axios.post(
                address+'/getProfileData',
                {token: localStorage.getItem('token')}
            ).then((result)=>{
                console.log(result.data);
                
                setUserData(result.data.user);
            })
        }
    }, [])

    return (
        <div className=" ">
            <div className="flex gap-5 p-2">
                <div className="h-20 w-20  profile-img rounded-full bg-white overflow-hidden border-black border-4">
                    <CIcon className="text-black" icon={cilUser} size="xxl"/>
                </div>
                <div className="details flex flex-col justify-center items-start grow">
                    <div className="text-sm">
                        <p>{userData.fullname}</p>
                        <p>{userData.username}</p>
                        {/* <p>johndoe001@example.com</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
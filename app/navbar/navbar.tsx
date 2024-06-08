"use client"
import { cilBell, cilChatBubble, cilCircle, cilCommentBubble, cilMenu, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { SetStateAction, useEffect, useState } from "react";

import Notifications from "./notifications";
import Requests from "./requests";
import axios from "axios";
import { address } from "../api/api";
import { useAuth } from "../auth/ds";
import { pagetitle } from "./data";








export default function Navbar(props: any) {
    const [isCollapsed, setCollapsed] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [page, showPage] = useState(0);

    const { isLoggedIn, setIsLoggedIn } = useAuth();
    function toggleCollapse() {
        setCollapsed(!isCollapsed);
    }

    

    function handleLogout() {
        axios.post(address+'/logout', {token: localStorage.getItem('token')}).then((result)=>{
            localStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setIsLoggedIn(false);
            setContentPage('home');
        }).catch((err)=>{
            console.log(err);
        })
    }


    
    function logout() {

        setCollapsed(true);
        if(isLoggedIn) handleLogout();
        
    }

    function toggleChat() {
        props.router('chat')
    }
    
    function toggleNotifiacations(): void {
        setShowNotifications(!showNotifications);
        
    }


    useEffect(()=>{
        
    })

    return (
        <div id="navbar" className="h-full  top-0 md:p-0 text-slate-200  bg-slate-800 w-full flex justify-between items-center">
            <div className="cursor-pointer bg-slate-900 w-max h-full flex justify-center items-center rounded-r-lg  ">
                <CIcon onClick={()=>props.router('feed')}  className="h-8 w-8 m-4" icon={cilCircle}/>
                {/* <p className="pr-5 text-xl ">Orion</p> */}
            </div>
            {/* <p onClick={()=>props.router('feed')} className="text-2xl mx-2  grow">Orion</p> */}
            
            <p className="select-none text-xl grow px-10 ">{pagetitle[props.page]}</p>
            
            <div className="flex h-full gap-5 items-center">
                <div style={{}} id="notifications" className={(showNotifications?"mt-20 ":"-mt-[calc(100vh)] ")+"transition-all min-h-96 max-w-[calc(25rem)] w-[calc(90svw)] bg-slate-800  drop-shadow-lg shadow-gray-900 absolute md:right-[calc(19rem)]  left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 -z-10 duration-500 self-start rounded-lg"}>
                    <div className="flex rounded-t-lg   justify-center divide-x-0 divide-slate-300 text-center select-none">
                        <p onClick={page==0?()=>{}:()=>showPage(0)} className={(page==0?"w-2/3 bg-slate-800 ": "w-1/3 rounded-br-lg bg-slate-700 hover:text-slate-400")+" p-2 transition-all duration-500 rounded-tl-lg"}>Notifications</p>
                        <p onClick={page==1?()=>{}:()=>showPage(1)}  className= {(page==1?"w-2/3 bg-slate-800 ": "w-1/3 rounded-bl-lg bg-slate-700 hover:text-slate-400 ")+" transition-all duration-500 p-2 "}>Requests</p>
                        <button className={(page==1?"":"bg-slate-700 ")+ " transition-all rounded-tr-lg p-2 "} onClick={toggleNotifiacations}><CIcon className="h-5" icon={cilX}/></button>
                    </div>
                    {page==0 &&  <Notifications /> }
                    {page==1 &&  <Requests /> }
                </div>
                <div className=" h-full flex gap-4 items-center">

                    <div onClick={toggleChat} className="w-8 h-8 scale-75 hover:scale-90 transition-all duration-300 rounded-md cursor-pointer">
                        <button><CIcon className=" h-full w-full text-slate-400  hover:text-white  "  icon={cilCommentBubble}/></button>

                    </div>
                    <div onClick={toggleNotifiacations} className="w-8 h-8 scale-75 hover:scale-90 transition-all duration-300 rounded-md cursor-pointer">
                        <button><CIcon className=" h-full w-full  text-slate-400  hover:text-white font-light "  icon={cilBell}/></button>

                    </div>
                    <div className="w-8 h-8 mr-4 sm:hidden scale-75 hover:scale-90 transition-all duration-300 rounded-md cursor-pointer">
                        <button onClick={toggleCollapse} className=""><CIcon className="w-full h-full   text-slate-400  hover:text-white font-light " icon={cilMenu} /></button>
                    </div>
                </div>
                <div className={(isCollapsed?"-right-full ":"right-0 ")+"transition-all min-w-40 max-w-40 sm:max-w-none h-full sm:w-auto self-start absolute  sm:static  "}>
                    <ul className=" bg-slate-900 w-full  drop-shadow-lg sm:drop-shadow-none  sm:h-full flex flex-col sm:flex-row gap-2 sm:px-4 pb-2 justify-start items-center rounded-l-lg">
                        <li className="sm:hidden h-16 hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  self-end "><button onClick={toggleCollapse} className="w-full   h-full "><CIcon className=" w-8 mr-4 " icon={cilX}  /></button></li>
                        {
                            isLoggedIn && 
                            <>
                                <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{props.router('feed'); toggleCollapse();}} className="px-2 py-0.5 w-full">Home</button></li>
                        
                                <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{props.router('search'); toggleCollapse();}} className="px-2 py-0.5  w-full">Search</button></li>
                    
                                <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{props.router('profile');  toggleCollapse();}} className="px-2 py-0.5 w-full">Profile</button></li>
                            </>
                        }
                    
                        <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>logout()} className="px-2 py-0.5 w-full" >{!isLoggedIn?'Login':'Logout'}</button></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

function setLoginState(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function setShowLogin(arg0: boolean) {
    throw new Error("Function not implemented.");
}

function setContentPage(arg0: string) {
    throw new Error("Function not implemented.");
}


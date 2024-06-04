"use client"
import { cilBell, cilChatBubble, cilCommentBubble, cilMenu, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { SetStateAction, useEffect, useState } from "react";

import Notifications from "./notifications";
import Requests from "./requests";
import axios from "axios";
import { address } from "../api/api";
import { useAuth } from "../auth/ds";
import { Dispatch } from "redux";








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
        <div id="navbar" className="h-full  top-0 md:p-0  bg-slate-100 w-full flex justify-between items-center">
            <div >
                <p onClick={()=>props.router('feed')} className="text-2xl mx-2">Orion</p>
            </div>
            
            
            <div className="flex h-full gap-5 items-center">
                <div style={{}} id="notifications" className={(showNotifications?"mt-20 ":"-mt-[calc(100vh)] ")+"transition-all min-h-96 max-w-[calc(25rem)] w-[calc(90svw)] bg-slate-300 absolute md:right-[calc(19rem)]  left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 -z-10 duration-500 self-start rounded-lg"}>
                    <div className="flex rounded-t-lg   justify-center divide-x-0 divide-slate-300 text-center select-none">
                        <p onClick={page==0?()=>{}:()=>showPage(0)} className={(page==0?"w-2/3 bg-slate-300 ": "w-1/3 rounded-br-lg bg-slate-200 hover:text-violet-500")+" p-2 transition-all duration-500 rounded-tl-lg"}>Notifications</p>
                        <p onClick={page==1?()=>{}:()=>showPage(1)}  className= {(page==1?"w-2/3 bg-slate-300 ": "w-1/3 rounded-bl-lg bg-slate-200 hover:text-violet-500 ")+" transition-all duration-500 p-2 "}>Requests</p>
                        <button className={(page==1?"":"bg-slate-200 ")+ " transition-all rounded-tr-lg p-2 "} onClick={toggleNotifiacations}><CIcon className="h-5" icon={cilX}/></button>
                    </div>
                    {page==0 &&  <Notifications /> }
                    {page==1 &&  <Requests /> }
                </div>
                <div className=" h-full flex gap-4 items-center">

                    <div onClick={toggleChat} className="w-8 h-8 hover:bg-white hover:bg-opacity-50 p-1 rounded-md cursor-pointer">
                        <button><CIcon className="h-6 w-6  " icon={cilCommentBubble}/></button>

                    </div>
                    <div onClick={toggleNotifiacations} className="w-8 h-8 hover:bg-white hover:bg-opacity-50 p-1 rounded-md cursor-pointer">
                        <button><CIcon className="h-6 w-6 " icon={cilBell}/></button>

                    </div>
                    <div className="w-8 h-8 mr-4 md:hidden">
                        <button onClick={toggleCollapse} className=""><CIcon className="w-full h-full " icon={cilMenu} /></button>
                    </div>
                </div>
                <div className={(isCollapsed?"-right-full ":"right-0 ")+"transition-all min-w-40 max-w-40 md:max-w-none h-full md:w-auto self-start absolute  md:static  "}>
                    <ul className=" bg-orange-500 w-full  md:h-full flex flex-col md:flex-row gap-2 md:px-4 justify-start items-center rounded-l-lg">
                        <li className="md:hidden bg-orange-400 shadow-sm border border-b2 w-full h-16 "><button onClick={toggleCollapse} className="w-16 h-full  float-right"><CIcon className="text-white w-8 m-auto" icon={cilX}  /></button></li>
                        {/* <li><a>Profile</a></li> */}
                             
                        {
                            isLoggedIn && 
                            <>
                                <li className=" w-full"><button onClick={()=>{props.router('feed'); toggleCollapse();}} className="p-2 w-full">Home</button></li>
                        
                                <li className=" w-full"><button onClick={()=>{props.router('search'); toggleCollapse();}} className="p-2 w-full">Search</button></li>
                    
                                <li className=" w-full"><button onClick={()=>{props.router('profile');  toggleCollapse();}} className="p-2 w-full">Profile</button></li>
                            </>
                        }
                    
                        <li className=" w-full"><button onClick={()=>logout()} className="p-2  w-full" >{!isLoggedIn?'Login':'Logout'}</button></li>
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


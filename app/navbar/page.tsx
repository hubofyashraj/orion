"use client"
import { cilBell, cilChatBubble, cilCommentBubble, cilMenu, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useEffect, useState } from "react";

import Notifications from "./notifications";









export default function Navbar(props: any) {
    const [isCollapsed, setCollapsed] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    function toggleCollapse() {
        setCollapsed(!isCollapsed);
    }

    

    
    function login() {

        if(!isCollapsed)    setCollapsed(true);
        if(props.loginState==false) {
            props.calllogin();
        }else {
            props.calllogout();
        }
    }

    function toggleChat() {
        props.router('chat')
    }
    
    function toggleNotifiacations(): void {
        setShowNotifications(!showNotifications);
        // const n = document.getElementById('notifications')!;
        // if(showNotifications) {
        //     n.style.marginTop='-100vh';
        // }
        // else {
        //     n.style.marginTop='';
        // }
    }

    useEffect(()=>{
        
    })

    return (
        <div id="navbar" className="h-full  top-0 md:p-0  bg-slate-100 w-full flex justify-between items-center">
            <div>
                <p className="text-2xl mx-2">Orion</p>
            </div>
            
            
            <div className="flex h-full gap-5 items-center">
                <div style={{}} id="notifications" className={(showNotifications?"mt-20 ":"-mt-[calc(100vh)] ")+"transition-all bg-slate-300 absolute md:right-[calc(19rem)]  left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 -z-10 duration-500 self-start rounded-lg p-2"}>
                    <button className="absolute right-2 top-2" onClick={toggleNotifiacations}><CIcon className="h-5" icon={cilX}/></button>
                    <p>Notifications</p>
                    <div className="border-t-2 my-2"></div>
                    <Notifications />
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
                        {props.loginState==true && <li className=" w-full"><button onClick={()=>{props.router('feed'); toggleCollapse();}} className="p-2 w-full">Home</button></li>}
                        {props.loginState==true && <li className=" w-full"><button onClick={()=>{props.router('search'); toggleCollapse();}} className="p-2 w-full">Search</button></li>}
                        {props.loginState==true && <li className=" w-full"><button onClick={()=>{props.router('profile');  toggleCollapse();}} className="p-2 w-full">Profile</button></li>}
                        <li className=" w-full"><button onClick={()=>login()} className="p-2  w-full" >{props.loginState==false?'Login':'Logout'}</button></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}


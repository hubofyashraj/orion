"use client"
import { cilCircle, cilMenu, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useEffect, useState } from "react";
import { pagetitle } from "./alerts/data";
import { logout } from "../api/actions/authentication";
import Alerts from "./alerts/alerts";
import { ChatBubbleOutlineOutlined, MarkChatUnreadOutlined, NotificationsActive, NotificationsNone } from "@mui/icons-material";
import { fetchConnectRequests } from "../api/navbar/navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../sseProvider/store";
import { setRequest } from "../sseProvider/reducers";
import Image from "next/image";

interface NavBarProps {
    router: (route: string)=>void, 
    page: string
}

export default function Navbar({ router, page }: NavBarProps) {
    
    const [isCollapsed, setCollapsed] = useState(true);
    const [renderAlerts, setRenderAlertsValue] = useState(false);
    
    const messages = useSelector((state: RootState)=>state.messages)
    const alerts = useSelector((state: RootState)=>state.alerts)
    const requests = useSelector((state: RootState)=>state.requests)
    const [oldRequests, setOldRequests] = useState<{from: string, fullname: string}[]>([]);

    const dispatch: AppDispatch = useDispatch();
    
    useEffect(()=>{
        fetchConnectRequests().then((older) => {
            setOldRequests(older)
        })
    }, []);

    useEffect(()=>{
        setOldRequests(prev => [...requests, ...prev])
    }, [requests])

    function toggleCollapse() {
        setCollapsed(!isCollapsed);
    }


    function toggleChat() {
        router('chat')
    }
    
    function setAlertsMargin () {
        const div_notifications = document.getElementById('notifications') ;
        if(div_notifications) {
            const marginTop = div_notifications.style.marginTop;
            (div_notifications as HTMLDivElement).style.marginTop=(marginTop=='-150vh'?'5rem':'-150vh');
        }
    }

    function toggleNotifiacations(): void {
        if(!renderAlerts) {
            setRenderAlertsValue(true)
            setTimeout(()=>{
                setAlertsMargin();
            }, 100)
        }else {
            setAlertsMargin();
            setTimeout(()=>{
                setRenderAlertsValue(false);
            }, 100)
        }
    }

    async function onLogout() {
        await logout()
    }

    return (
        <>
            {renderAlerts && <Alerts />}
            <div id="navbar" className="h-full z-50  top-0 md:p-0 text-slate-200  bg-slate-800 w-full flex justify-between items-center">
                <div className="cursor-pointer px-4 bg-slate-900 w-20 flex gap-4 hover:w-48 transition-all  overflow-hidden h-full  items-center rounded-r-lg  ">
                    <Image className="shrink-0 h-12 w-12" alt="icon" height={36} width={36} src={'/icons/logo.png'} />
                    <Image className="shrink-0 " priority onClick={()=>router('feed')} alt="logo" height={36} width={80} src={'/icons/yasmc@3x_alt.png'} />
                </div>
                <p className="select-none text-xl grow px-10 ">{pagetitle[page]}</p>
                <div className="flex h-full gap-5 items-center">
                    <div className=" h-full flex gap-4 items-center">
                        <button onClick={toggleChat} className="w-8 h-8  hover:scale-105 transition-all  rounded-md cursor-pointer">
                            {messages.length==0?<ChatBubbleOutlineOutlined className="text-slate-400" />:<MarkChatUnreadOutlined className="animate-pulse text-slate-300"/>}
                        </button>
                        <button onClick={toggleNotifiacations} className="w-8 h-8 hover:scale-105 transition-all  rounded-md cursor-pointer">
                            {(alerts.length==0 && requests.length==0)?<NotificationsNone className="text-slate-400"  />: <NotificationsActive className="animate-pulse text-slate-300" />}
                        </button>
                        <button onClick={toggleCollapse} className="w-8 h-8 mr-4 sm:hidden scale-75 hover:scale-90 transition-all duration-300 rounded-md cursor-pointer">
                            <CIcon className="w-full h-full   text-slate-400  hover:text-white font-light " icon={cilMenu} />
                        </button>
                    </div>
                    <div className={(isCollapsed?"-right-full ":"right-0 ")+"transition-all min-w-40 max-w-40 sm:max-w-none h-full sm:w-auto self-start absolute  sm:static  "}>
                        <ul className=" bg-slate-900 w-full  drop-shadow-lg sm:drop-shadow-none  sm:h-full flex flex-col sm:flex-row gap-2 sm:px-4 pb-2 justify-start items-center rounded-l-lg">
                            <li className="sm:hidden h-16 hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  self-end "><button onClick={toggleCollapse} className="w-full   h-full "><CIcon className=" w-8 mr-4 " icon={cilX}  /></button></li>
                            <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{router('feed'); toggleCollapse();}} className="px-2 py-0.5 w-full">Home</button></li>
                            <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{router('search'); toggleCollapse();}} className="px-2 py-0.5  w-full">Search</button></li>
                            <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={()=>{router('profile');  toggleCollapse();}} className="px-2 py-0.5 w-full">Profile</button></li>
                            <li className="hover:scale-110 font-extralight sm:w-16 scale-90 transition-all duration-300 hover:font-normal  w-full"><button onClick={onLogout} className="px-2 py-0.5 w-full" >{'Logout'}</button></li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
}

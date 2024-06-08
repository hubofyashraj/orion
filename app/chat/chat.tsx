'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import "./style.css";

var  userClickedEvent: Function=()=>{}
var activeChat: Function=()=>{};

type User = {_id: string, username: string, fullname: string}


export default function Chat(props: {interval: React.MutableRefObject<any>}) {
    const [screenWidth, setWidth] = useState(0);
    const primary = useRef<'connections'|'chatbox'>('connections');
    const [chatUser, setChatUser] = useState<User | null>(null);

    useEffect(()=>{
        setWidth(window.innerWidth)
        var timer: string | number | NodeJS.Timeout | undefined
        window.addEventListener('resize', ()=>{
            clearTimeout(timer);
            timer=setTimeout(()=>{
                setWidth(window.innerWidth)
            }, 50)
        })
    }, [screenWidth])



    return ( 
        <div className="h-full w-[calc(200vw)] grow" >
            <div className="flex h-full w-full ">
                <Connections screenWidth={screenWidth} setPrimary={()=>primary.current='chatbox'} setChatUser={setChatUser}  />
                <ChatBox screenWidth={screenWidth} setPrimary={()=>{primary.current='connections'; setChatUser(null)}} user={chatUser} interval={props.interval} />
            </div> 
        </div>
    );
}
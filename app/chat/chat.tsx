'use client'
import { useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import { Connection } from "../api/db_queries/chat";
import { SSEProvider } from "../sseProvider/sse";


export default function Chat(props: {interval: React.MutableRefObject<any>}) {
    const [screenWidth, setWidth] = useState(0);
    const primary = useRef<'connections'|'chatbox'>('connections');
    const [chatUser, setChatUser] = useState<Connection | null>(null);

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
                <Connections screenWidth={screenWidth} focus={()=>primary.current='chatbox'} focusUser={(user) => setChatUser(user)}  />
                <ChatBox screenWidth={screenWidth} focus={()=>{primary.current='connections'; setChatUser(null)}} user={chatUser} interval={props.interval} />
            </div> 
        </div>
    );
}
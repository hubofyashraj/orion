'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import "./style.css";

var  userClickedEvent: Function=()=>{}
var activeChat: Function=()=>{};

const dummyUser = {_id: 'self', username: 'dummyUser', fullname: 'Dummy User'}


export default function Chat() {
    const [screenWidth, setWidth] = useState(0);
    const primary = useRef<'connections'|'chatbox'>('connections');
    const [chatUser, setChatUser] = useState(dummyUser);

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
        <div className="h-full w-full grow" >
            { true &&  <div className="flex h-full ">
                <Connections screenWidth={screenWidth} setPrimary={()=>primary.current='chatbox'} setChatUser={setChatUser}  />
                <ChatBox screenWidth={screenWidth} setPrimary={()=>primary.current='connections'} user={chatUser} />
            </div> }
            {/* { screenWidth<=640 && <div className=" h-full">
                { primary.current=='connections' 
                ? <Connections screenWidth={screenWidth} setPrimary={()=>primary.current='chatbox'} setChatUser={setChatUser} /> 
                : <ChatBox screenWidth={screenWidth} setPrimary={()=>primary.current='connections'} user={chatUser} /> }
            </div> } */}
        </div>
    );
}
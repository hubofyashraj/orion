'use client'
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import "./style.css";

var  userClickedEvent: Function=()=>{}
var activeChat: Function=()=>{};

const dummyUser = {_id: 'self', username: 'dummyUser', fullname: 'Dummy User'}


export default function Chat() {


    const [screenWidth, setWidth] = useState(0);

    const [chatActive, setChatActive] = useState(false);

    const [chatUser, setChatUser] = useState(dummyUser);


    useEffect(()=>{
        setWidth(window.innerWidth)
        var timer: string | number | NodeJS.Timeout | undefined
        window.addEventListener('resize', ()=>{
            console.log('hh');
            
            clearTimeout(timer);
            timer=setTimeout(()=>{

                setWidth(window.innerWidth)
                console.log(screenWidth);
                
            }, 1000)
        })
    }, [screenWidth])




    useEffect(()=>{
        console.log(chatActive);
        
    }, [chatActive])

    function toggleChat(val: boolean) {
        setChatActive(val)
        console.log(val);
        
    }

    return (
        <div className="h-full grow" >
            {
                screenWidth>764
                &&
                <div className="flex h-full">
                    <Connections toggleChat={()=>toggleChat(true)} setChatUser={setChatUser}  />
                    <ChatBox toggleChat={()=>toggleChat(false)} user={chatUser} />
                </div>
            }
            {
                screenWidth<=764
                &&
                <div className=" h-full">
                    {
                        !chatActive
                        &&
                        <Connections toggleChat={()=>toggleChat(true)} setChatUser={setChatUser} />
                    }
                    {
                        chatActive
                        &&
                        <ChatBox toggleChat={()=>toggleChat(false)} user={chatUser} />
                    }
                </div>
            }
        </div>
    );
}
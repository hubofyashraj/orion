import { cilArrowLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { address } from "../api/api";
import images from "../images";
import Image from "next/image";
import { Message } from "./types";
import Thread from "./thread";
import useSocketEvent, { pingServer } from "../handleSocket";
import { Connection } from "../api/db_queries/chat";
import { getMessages, sendMessage, setAllRead } from "../api/chat/chat";
import useSSE from "../sseProvider/sse";
import ProfilePictureComponent from "../components/pfp";
import { ArrowBack } from "@mui/icons-material";


function ChatBox({
    screenWidth, focus, user, interval
}: {
    screenWidth:number, focus: () => void ,  user: Connection | null, interval: React.MutableRefObject<any> 
}) {

    const [msgList, setMsgList] = useState<Message[]>([]);

    const { messages, setMessages } = useSSE();

    useEffect(()=>{
        if(user && messages.has(user.username)) {
            const msg = messages.get(user.username)!;

            if(msg) setMsgList(prev=>[...prev, {...msg, unread: false}]);
    
            setMessages(prev => {
                prev.delete(user.username);
                return new Map<string, Message>(prev.entries());
            });
    
        }

        
    }, [messages, setMessages, user])

    useEffect(()=>{
        if(user) getMessages(user.username!).then( (messages) => { setMsgList(messages) })
    },[user])

    useEffect(()=>{
        if(user) {
            if(msgList.some((msg) => msg.sender==user.username && msg.unread)) {
                setMsgList(prev=>prev.map((msg) => { 
                    if(msg.sender==user.username) return {...msg, unread: false}; 
                    else return msg;
                }))
                setAllRead(user.username);
            }

            const container = document.getElementById('msgs') as HTMLDivElement
            container?.scrollTo({top: container.scrollHeight})
        };
    }, [msgList, user])

    



    // useSocketEvent('new message', (msg: string)=>{
    //     const message = JSON.parse(msg);
    //     addNewMessage(message)
    // })

    // function addNewMessage(msg: Message) {
    //     setMsgList((msgs)=>[...msgs, msg])
    // }


    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        focus()
    }

    if(user==null) return (
        <div className="h-full w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-700   flex justify-center items-center">
            <Image alt="Orion logo" className=" opacity-50" width={512} height={512} src={'/icons/icon-512x512.png'}/>
        </div>
    )

    
    return (
        <div id="chatbox" className="h-[calc(100svh-64px)] text-slate-200   overflow-y-auto w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800 flex flex-col justify-start">
            <div className="h-16 shrink-0 flex gap-2 justify-start items-center px-4 drop-shadow-sm  bg-slate-800 ">
                <ArrowBack onClick={onBack} />
                <div className="rounded-full overflow-hidden">
                    <ProfilePictureComponent key={user.username} size={40} user={user.username} />
                </div>
                <div className="text-lg">
                    <p>{user.fullname}</p>
                </div>
                <div className="grow"></div>
            </div>
            <Thread messages={msgList} user={user} updateMessageList={(newMessage) => setMsgList([...msgList, newMessage])} />
        </div>
    )
}

export default ChatBox;
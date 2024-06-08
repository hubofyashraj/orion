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


function ChatBox(props: {screenWidth:number, setPrimary: Function,  user:any, interval: React.MutableRefObject<any> }) {
    const [msgList, setMsgList] = useState<Array<Message>>([]);

    useSocketEvent('new message', (msg: string)=>{
        const message = JSON.parse(msg);
        addNewMessage(message)
    })

    function addNewMessage(msg: Message) {
        setMsgList((msgs)=>[...msgs, msg])
    }

    useEffect(()=>{
        const container = document.getElementById('msgs') as HTMLDivElement
        container?.scrollTo({top: container.scrollHeight})

    }, [msgList])

    useEffect(()=>{
        if(props.interval.current) clearInterval(props.interval.current);        
        if(props.user==null) return;

        props.interval.current = setInterval(()=>{
            pingServer();
        }, 10000)

        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+`/chats/getChats?receiver=${props.user.username}`,
        ).then((result)=>{
            const msgs = result.data.chats;
            setMsgList(msgs);
        })

        

    },[props.interval, props.user])


    async function sendMsg(msg: Message) {
        try {
            const resp: {data: {success: boolean, reason?: any}} = await axios.post(
                address+'/chats/sendText',
                msg
            ) 
            if(resp.data.success) {
                delete msg['sending'];
                setMsgList([...msgList, msg])
            }
        } catch (error) {
            console.log(error);
        }
 

    }


    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        props.setPrimary()
    }

    if(props.user==null) return (
        <div className="h-full w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-600   flex justify-center items-center">
            <Image alt="Orion logo" className=" opacity-25" width={300} height={300} src={images.demo.src}/>
        </div>
    )

    
    return (
        <div id="chatbox" className="h-[calc(100svh-64px)] text-slate-200   overflow-y-auto w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800 flex flex-col justify-start">
            <div className="h-16 shrink-0 flex gap-5 items-center px-4 drop-shadow-md bg-slate-800 border-b border-slate-700">
                <div><CIcon onClick={()=>onBack()} className="w-4 h-4" icon={cilArrowLeft}/></div>
                <div>
                    <p>{props.user.username}</p>
                </div>

            </div>
            <Thread messages={msgList} user={props.user} send={sendMsg} />
        </div>
    )
}

export default ChatBox;
import { cilArrowLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { useState } from "react";
import { address } from "../api/api";
import { Socket, io } from "socket.io-client";
import MessageComp from "./message";
import { CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material";
import images from "../images";
import Image from "next/image";
import { Message } from "./types";
import CircularLoader from "../Loader/Loader";
import { socket } from "../handleSocket";

export var setMsgs: Function=()=>{};




export let handleNewMessage: Function = ()=>{} 

function ChatBox(props: {screenWidth:number, setPrimary: Function,  user:any }) {

    const message = useRef('');
    const [msgList, setMsgList] = useState<Array<Message>>([]);
    
    // useEffect(()=>{
    //     if(props.screenWidth<=640) {
    //         const div = document.getElementById('connections') as HTMLDivElement;
    //         div.style.marginLeft='0'
    //     }else {
    //         const div = document.getElementById('connections') as HTMLDivElement;
    //         div.style.marginLeft='0'
    //     }

    // }, [props.screenWidth])


    function middle(list: Array<any>){
        setMsgList(list);
    }

    setMsgs=middle;
        
    function addNewMessage(msg: Message) {
        console.log('adding new message');
        
        setMsgList((msgs)=>[...msgs, msg])
        
    }

    handleNewMessage=addNewMessage


    useEffect(()=>{
        const container = document.getElementById('msgs') as HTMLDivElement
        container?.scrollTo({top: container.scrollHeight})

    }, [msgList])

    useEffect(()=>{
        
        if(props.user==null) return;

        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+`/chats/getChats?receiver=${props.user.username}`,
        ).then((result)=>{
            const msgs = result.data.chats;
            setMsgList(msgs);
            
            console.log(msgs);
            
        })

    },[props.user])


    function sendMsg(message: string, resetValue: Function) {
        if(message.length!=0) {
            axios.post(
                address+'/chats/sendText',
                {receiver: props.user.username, msg: message, timeStamp: Date.now().toString()}
            ).then((result) =>{
                resetValue()
            }).catch((reason)=>{
                
            })
        }
        
        
    }


    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        props.setPrimary()
    }

    if(props.user==null) return (
        <div className="h-full w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-300   flex justify-center items-center">
            <Image alt="Orion logo" className=" opacity-25" width={300} height={300} src={images.demo.src}/>
        </div>
    )

    
    return (
        <div id="chatbox" className="h-[calc(100svh-64px)] overflow-y-auto w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-300 flex flex-col justify-start">
            <div className="h-16 shrink-0 flex gap-5 items-center px-4 border-b">
                <div><CIcon onClick={()=>onBack()} className="w-4 h-4" icon={cilArrowLeft}/></div>
                <div>
                    <p>{props.user.username}</p>
                </div>
            </div>
            <div id="msgs" className="grow flex flex-col items-start justify-start overflow-y-auto scrollbar-none scrollbar-track-white">
                { msgList.length==0 
                ? <CircularLoader /> 
                : msgList.map((msg, idx)=>{

                    if(msg.sender == localStorage.getItem('user') || msg.sender==props.user.username) {
                        return <MessageComp key={idx}  msg={msg} sender={props.user.username} />
                    }
                    else {
                        console.log('not users msg', msg);
                        
                    }
                })
                }
            </div>
            <div className="h-16 shrink-0 flex justify-center items-center w-[calc(100svw)] sm:w-[calc(66svw)] bg-white border-t-2">
                <MessageForm send={sendMsg}/>
            </div>
        </div>
    )
}




export default ChatBox;




function MessageForm(props: {send: Function}) {

    const [value, setValue] = useState('');

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        setValue(event.target.value);
    }

    return (
        <form onSubmit={(e)=>{e.preventDefault(); props.send(value, ()=>setValue(''))}} className="flex  gap-3 justify-center items-center">
            <input autoComplete="off" onChange={onChange} value={value} name="msg" className=" py-2 px-4 rounded-full bg-slate-100 text-gray-500" placeholder="Enter Message" />
            <button type="submit" className="h-8 w-8">
                <Send className=" text-blue-400 h-full w-full  rounded-full" />
            </button>
        </form>
    )
}
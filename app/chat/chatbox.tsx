import { cilArrowLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useState } from "react";
import { address } from "../api/api";
import { Socket, io } from "socket.io-client";
import MessageComp, { message } from "./message";
import { CircularProgress } from "@mui/material";
import { Send } from "@mui/icons-material";

export var setMsgs: Function=()=>{};

export var setIncomingMsg: Function=()=>{}

type Message = {
    sender: string, receiver: string, msg: string, ts: string
}

function ChatBox(props: {screenWidth:number, setPrimary: Function,  user:any }) {

    const [msg, setMsg] = useState('');
    const [msgList, setMsgList] = useState([] as Array<message>);
    const [fetched, setFetched] = useState(false)
    
    // const [socket, setSocket] = useState(io(address));
    

    useEffect(()=>{
        if(props.screenWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement;
            div.style.marginLeft='0'
        }else {
            const div = document.getElementById('connections') as HTMLDivElement;
            div.style.marginLeft='0'
        }

    }, [props.screenWidth])


    function middle(list: Array<any>){
        setMsgList(list);
    }

    setMsgs=middle;
        

    useEffect(()=>{
        document.getElementById('msgs')!.lastElementChild?.scrollIntoView()
        setFetched(true)
    }, [msgList])

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+`/chats/getChats?receiver=${props.user.username}`,
        ).then((result)=>{
            const msgs = result.data.chats;
            setMsgList(msgs);
            
            // console.log(msgs);
            
        })

    },[props.user.username])

    function incomingMsg(ob: message) {
        setMsgList([...msgList, ob]);
    }
        

    setIncomingMsg=incomingMsg

    function sendMsg(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(msg.length!=0) {
            axios.post(
                address+'/chats/sendText',
                {receiver: props.user.username, msg, timeStamp: Date.now().toString()}
            ).then((result) =>{
                setMsg('')
            }).catch((reason)=>{
                
            })
        }
        
        
    }

    function onChange(event: ChangeEvent) {
        setMsg((event.target! as HTMLInputElement).value);
    }

    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        props.setPrimary()
    }

    
    return (
        <div id="chatbox" className="h-full grow relative  w-full sm:w-2/3 flex flex-col justify-between">
            <div className="h-16 shrink-0 flex gap-5 items-center px-4 border-b">
                <div><CIcon onClick={()=>onBack()} className="w-4 h-4" icon={cilArrowLeft}/></div>
                <div>
                    <p>{props.user.username}</p>
                </div>
            </div>
            <div id="msgs" className="grow flex mb-16 flex-col items-start justify-start overflow-y-auto scrollbar-none scrollbar-track-white">
                {!fetched  && <div className="w-full h-full flex flex-col gap-5 justify-center  items-center">
                        <CircularProgress className=" h-20 w-20 " />
                        <p className="animate-bounce text-xl text-slate-400">Loading</p>
                    </div>  
                }
                {fetched && msgList.map((msg, idx)=>{
                    if(msg.sender == sessionStorage.getItem('user') || msg.sender==props.user.username) {
                        return <MessageComp key={idx}  msg={msg} sender={props.user.username} />
                    }})
                }
            </div>
            <div className="py-4 h-16 shrink-0 flex justify-center items-center w-full bg-white border-t-2">
                <form onSubmit={sendMsg} className="flex  gap-3 justify-center items-center">
                    <input onChange={onChange} value={msg} name="msg" className=" py-2 px-4 rounded-full bg-slate-100 text-gray-500" placeholder="Enter Message" />
                    <button type="submit" className="h-8 w-8">
                        <Send className=" text-blue-400 h-full w-full  rounded-full" />
                    </button>
                </form>
            </div>
        </div>
    )
}




export default ChatBox;



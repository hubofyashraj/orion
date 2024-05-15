import { cilArrowLeft } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import React, { ChangeEvent, FormEvent, useEffect } from "react";
import { useState } from "react";
import { address } from "../api/api";
import { Socket, io } from "socket.io-client";
import MessageComp, { message } from "./message";

export var setMsgs: Function=()=>{};

export var setIncomingMsg: Function=()=>{}

function ChatBox(props: any) {

    const [msg, setMsg] = useState('');
    const [msgList, setMsgList] = useState([] as Array<any>);
    // const [socket, setSocket] = useState(io(address));
    


    function middle(list: Array<any>){
        setMsgList(list);
    }

    setMsgs=middle;
        

    useEffect(()=>{
        document.getElementById('msgs')!.lastElementChild?.scrollIntoView()
    }, [msgList])

    useEffect(()=>{
        axios.post(
            address+'/chats/getChats',
            {token: localStorage.getItem('token'), receiver: props.user.username}
        ).then((result)=>{
            const msgs = result.data.chats;
            // console.log(msgs);
            
            var list: Array<any> = [];
            for (let i = 0; i < msgs.length; i++) {
                const ob = msgs[i];
                if(ob.sender == sessionStorage.getItem('user') || ob.sender==props.user.username) {
                    var element = <MessageComp msg={ob} sender={props.user.username} key={ob.msg+ob.ts} />
                    list.push(element);
                }
            }
            setMsgList(list);
        })

    },[props.user.username])

    function incomingMsg(ob: message) {
        if(ob.sender == sessionStorage.getItem('user') || ob.sender==props.user.username) {
            var element = <MessageComp msg={ob} sender={props.user.username} key={ob.msg+ob.ts} />
            setMsgList([...msgList, element]);
            
        }
        
    }

    setIncomingMsg=incomingMsg

    function sendMsg(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if(msg.length!=0) {
            axios.post(
                address+'/chats/sendText',
                {token: localStorage.getItem('token')!, receiver: props.user.username, msg, timeStamp: Date.now().toString()}
            ).then((result) =>{
                setMsg('')
            }).catch((reason)=>{
                
            })
        }
        
        
    }

    function onChange(event: ChangeEvent) {
        setMsg((event.target! as HTMLInputElement).value);
    }
    
    return (
        <div className="h-full relative  w-full flex flex-col justify-between">
            <div className="h-16 shrink-0 flex gap-5 items-center px-4 border-b">
                <div><CIcon onClick={props.toggleChat} className="w-4 h-4" icon={cilArrowLeft}/></div>
                <div>
                    <p>{props.user.username}</p>
                </div>
            </div>
            <div id="msgs" className="grow flex mb-16 flex-col items-start justify-start overflow-y-auto scrollbar-none scrollbar-track-white">
                {msgList}
            </div>
            <div className="py-4 h-16  flex justify-center items-center absolute w-full bottom-0 bg-white border-t-2">
                <form onSubmit={sendMsg} className="flex  gap-5 justify-center">
                    <input onChange={onChange} value={msg} name="msg" className=" py-2 px-4 rounded-full bg-slate-100 text-gray-500" placeholder="Enter Message" />
                    <input className="bg-slate-200 py-2 px-4 rounded-full" type="submit" value={"send"} />
                </form>
            </div>
        </div>
    )
}




export default ChatBox;



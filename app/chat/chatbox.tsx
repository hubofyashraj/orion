import React, { useEffect } from "react";
import { useState } from "react";
import Image from "next/image";
import { Message } from "./types";
import Thread from "./thread";
import { Connection } from "../api/db_queries/chat";
import { getMessages, setAllRead } from "../api/chat/chat";
import ProfilePictureComponent from "../components/pfp";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../sseProvider/store";
import { setMessages } from "../sseProvider/reducers";


function ChatBox({
    screenWidth, focus, user, interval
}: {
    screenWidth:number, focus: () => void ,  user: Connection | null, interval: React.MutableRefObject<any> 
}) {

    const [msgList, setMsgList] = useState<Message[]>([]);


    const messages = useSelector((state: RootState)=>state.messages) as Array<[string, Message]>;
    const dispatch: AppDispatch = useDispatch();

    useEffect(()=>{
        console.log(messages);
        if(user ) {
            let index=-1;
            index = messages.findIndex(([sender, _])=>sender==user.username);
            if(index==-1) return;

            const msg = messages[index][1];

            setMsgList(prev=>[...prev, {...msg, unread: false}]);
            dispatch(setMessages(messages.filter((_, idx)=>idx!=index)));
        }

        
    }, [dispatch, messages, user])

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

    




    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        focus()
    }

    if(user==null) return (
        <div className="h-full w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-700   flex justify-center items-center">
        </div>
    )

    
    return (
        <div id="chatbox" className=" text-slate-200   overflow-y-auto w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800 flex flex-col justify-start">
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
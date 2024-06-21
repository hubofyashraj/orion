'use client'
import { useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import { Connection } from "../api/db_queries/chat";
import { fetchConnections } from "../api/chat/chat";
import { useSelector } from "react-redux";
import { RootState } from "../sseProvider/store";


export default function Chat(props: {interval: React.MutableRefObject<any>}) {
    const [screenWidth, setWidth] = useState(0);
    const primary = useRef<'connections'|'chatbox'>('connections');
    const [chatUser, setChatUser] = useState<Connection | null>(null);
    const allConnections = useRef<Connection[]>([]);

    const [connections, setConnections] = useState<Connection[]>([]);

    const messages = useSelector((state: RootState)=>state.messages)


    useEffect(()=>{
        fetchConnections().then( connections => {
            allConnections.current=connections;
            setConnections(connections.toSorted((a,b)=>{
                if(!a.lastmsg && !b.lastmsg) return 0;
                if(!a.lastmsg) return 1;
                if(!b.lastmsg) return -1;
                return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
            }))
        } )
    }, [])


    useEffect(()=>{
        setConnections(prev=>{
            let updatedConnections = prev.map((connection) => {
                var index = messages.findIndex(([sender, _]) => sender==connection.username);
                if(index!=-1) {
                    connection.lastmsg=messages[index][1];
                }
                let upDatedconnection =  {...connection, lastmsg: connection.lastmsg?{...connection.lastmsg, unread: false}: null};
                return upDatedconnection;
            })

            return updatedConnections.toSorted((a,b)=>{
                if(!a.lastmsg && !b.lastmsg) return 0;
                if(!a.lastmsg) return 1;
                if(!b.lastmsg) return -1;
                return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
            })

        });
        
    }, [messages])

    function onClickOnUser(user: Connection) {
        primary.current='chatbox';
        setChatUser(user);
        if(screenWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement
            div.style.marginLeft='-100vw'
        }
        let index = connections.findIndex((connection) => connection.username==user.username);
        if(user.lastmsg) user.lastmsg.unread=false;
        connections[index] = user;

        setConnections([...connections])
    }


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
        <div className="h-full   w-[calc(200vw)] grow" >
            <div className="flex h-full w-full ">
                <Connections allConnections={allConnections} connections={connections} setConnections={setConnections} focusUser={(user) => onClickOnUser(user)}  />
                <ChatBox screenWidth={screenWidth} focus={()=>{primary.current='connections'; setChatUser(null)}} user={chatUser} interval={props.interval} />
            </div> 
        </div>
    );
}
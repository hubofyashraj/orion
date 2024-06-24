'use client'
import { useEffect, useRef, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import { Connection } from "../api/db_queries/chat";
import { fetchConnections } from "../api/chat/chat";
import useMessages from "../state-store/messagesStore";


export default function Chat(props: {interval: React.MutableRefObject<any>}) {
    const [screenWidth, setWidth] = useState(0);
    const primary = useRef<'connections'|'chatbox'>('connections');
    const [chatUser, setChatUser] = useState<Connection | null>(null);
    const allConnections = useRef<Connection[]>([]);

    const [connections, setConnections] = useState<Connection[]>([]);

    const { unreadMessages, removeMessage } = useMessages();

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
                const unreadmsg = unreadMessages[connection.username];
                if(unreadmsg) {
                    connection.lastmsg = unreadmsg
                }
                return connection;
            })

            return updatedConnections.toSorted((a,b)=>{
                if(!a.lastmsg && !b.lastmsg) return 0;
                if(!a.lastmsg) return 1;
                if(!b.lastmsg) return -1;
                return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
            })

        });
        
    }, [unreadMessages])

    function onClickOnUser(user: Connection) {
        primary.current='chatbox';
        setChatUser(user);
        if(screenWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement
            div.style.marginLeft='-100vw'
        }
        if(unreadMessages[user.username]) {
            setConnections(prev => prev.map((connection) => {
                if(connection.username!=user.username) return connection;
                else {
                    return {...connection, lastmsg: {...connection.lastmsg,  unread:false}} as Connection
                }
            }))
            removeMessage(user.username); 
        }
        
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
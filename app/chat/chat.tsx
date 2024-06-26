'use client'
import { DispatchWithoutAction, useEffect, useReducer, useState } from "react";
import Connections from "./connections";
import ChatBox from "./chatbox";


import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Connection } from "../api/db_queries/chat";


export default function Chat() {
    const [screenWidth, setWidth] = useState(0);


    const [user, setUser] = useState<Connection | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

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
                <Connections user={user} setUser={(user)=>setUser(user)} />
                <ChatBox user={user} setUser={() => setUser(null)} />
            </div> 
        </div>
    );
}
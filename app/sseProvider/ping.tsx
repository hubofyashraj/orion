import { useEffect, useRef } from "react";
import useSSE from "./sse"
import { PingServer } from "../api/ping";

export default function Ping() {
    const ref = useRef<HTMLParagraphElement | null>(null)
    useEffect(()=>{
        const pingInterval = setInterval(async ()=>{
            const ts1 = Date.now();
            await PingServer();
            const ts2 = Date.now();
            if(ref.current) ref.current.innerText = `${ts2-ts1} ms`
        }, 3000);

        return () => clearInterval(pingInterval)
        
    })


    return (
        <p ref={ref} className="absolute bottom-0 left-0 text-slate-50">999+ ms</p>
    )
}
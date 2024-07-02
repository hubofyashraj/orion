'use client'
import { useEffect } from "react";
import usePing from "../state-store/pingStore";
import useSSE from "./useSSE";



export default function Ping() {
    useSSE();

    const {ping} = usePing();
    console.log({ping});
    useEffect(()=>{

    }, [])   

    return (
        <p className="absolute bottom-0 right-0 text-xs text-slate-50">{ping}</p>
    )
}
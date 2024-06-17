import { useEffect, useState } from "react";
import useSSE from "./sse"

export default function Ping() {
    const {ping} = useSSE();
    return (
        <p className="absolute bottom-0 left-0 text-slate-50">{ping} ms</p>
    )
}
'use client';
import App from "./app";
import useSSE from "./sseProvider/useSSE";

export default function SSE() {
    useSSE();
    return (
            <App/>
    )
}
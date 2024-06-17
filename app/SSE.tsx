'use client';
import App from "./app";
import { SSEProvider } from "./sseProvider/sse";

export default function SSE() {
    return (
        <SSEProvider>
            <App/>
        </SSEProvider>
    )
}
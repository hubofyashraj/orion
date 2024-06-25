'use server'
import { NextRequest, NextResponse } from "next/server";
import { validSession } from "../auth/authentication";
import assert from "assert";
import { addClient, removeClient } from "@/app/utils/server-only";


export async function GET(request: NextRequest) {
    const {status, user} = await validSession();
    if(status==401) return new NextResponse('Unauthorized', {status: 401})
    assert(user);
    
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder('utf-8');
    writer.ready.then(()=>addClient(user, writer))

    try {
        
        writer.write(`data: {"message": "Connected to SSE"}\n\n`)

        request.signal.addEventListener('abort', () => {
            console.log('client disconnected', user);
            removeClient(user)
            writer.close();
        });

    } catch (error) {
        console.error('Error:', error);
        writer.close();
        return new NextResponse('Internal Server Error', {status: 500});
    }

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}


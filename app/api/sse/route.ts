'use server'
import { NextRequest, NextResponse } from "next/server";
import { validSession } from "../actions/authentication";
import assert from "assert";

export async function GET(request: NextRequest) {
    const {status, user} = await validSession();
    if(status==401) return new NextResponse('Unauthorized', {status: 401})
    assert(user);
    
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder('utf-8');

    try {
        let expResponse: Response | undefined;
        let stream: ReadableStream | null;
        let reader: ReadableStreamDefaultReader | undefined;

        const connect = async () => {
            expResponse = await fetch(`http://localhost:6789/sse/register?user=${user}`);
            stream = expResponse.body;
            reader = stream?.getReader();
        };

        const pump = () => {
            reader?.read().then(({ value, done }) => {
                if (done) {
                    console.log('done', done);
                    return;
                }
                const data = decoder.decode(value);

                if (data.startsWith('ping')) {
                    console.log('ping from express for', user);
                    
                    writer.ready.then(
                        ()=>writer.write(`data: ${JSON.stringify({ type: 'ping', payload: data })}\n\n`)
                    ).catch(()=>{
                        console.log('writer error');
                        writer.ready.then(()=>writer.close());
                        reader?.cancel()
                        return;
                    })
                } else {
                    writer.ready.then(()=> writer.write(`data: ${data}\n\n`))
                    .catch(()=>{
                        console.log('writer error');
                        writer.ready.then(()=>writer.close());
                        reader?.cancel()
                        return;
                    })
                }
                pump();
            }).catch((error) => {
                console.log('Error while reading stream:');
                writer.abort();
                reader?.cancel();
            });
        };
        
        writer.write(`data: {"message": "Connected to SSE"}\n\n`)

        await connect();
        pump();
        request.signal.addEventListener('abort', () => {
            console.log('client disconnected', user);
            
            writer.close();
            reader?.cancel();
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

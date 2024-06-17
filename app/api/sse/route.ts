'use server'
import { NextRequest, NextResponse } from "next/server";
import { validSession } from "../actions/authentication";

export async function GET(request: NextRequest) {
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const decoder = new TextDecoder('utf-8');

    try {
        const user = await validSession();
        
        if (user) {
            let expResponse: Response | undefined;
            let stream: ReadableStream | null;
            let reader: ReadableStreamDefaultReader | undefined;

            const connect = async () => {
                expResponse = await fetch(`http://localhost:6789/sse/register?user=${user}`);
                stream = expResponse.body;
                // console.log(stream);
                
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
                        writer.ready.then(
                            ()=>writer.write(`data: ${JSON.stringify({ type: 'ping', payload: data.replace('ping', '') })}\n\n`)
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
                    console.log('Error while reading stream:', error);
                    writer.abort();
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

        } else {
            writer.close();
        }
    } catch (error) {
        console.error('Error:', error);
        writer.close();
    }
    console.log('user63');

    return new NextResponse(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

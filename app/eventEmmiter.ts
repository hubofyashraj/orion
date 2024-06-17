import { EventEmitter } from 'events';
import redis from './api/redis/redis_client';
// import { clients } from './api/sse/clients';

const eventEmmitter = new EventEmitter();

const encoder = new TextEncoder();

eventEmmitter.on('new message', async (message)=>{
    console.log(message);
    // const receiver = clients.get(message.receiver);
    const receiver = await redis.hget('clients', message.receiver)
    if(receiver) {
        const writer = JSON.parse(receiver);
        writer.write(encoder.encode(`data: ${JSON.stringify(message)}\n\n`))
    }
    else {
        console.log(`Receiver ${message.receiver} not connected`);
        
    }
    
});


export default eventEmmitter;

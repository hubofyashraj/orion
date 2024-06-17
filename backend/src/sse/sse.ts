import express, { Response} from 'express';
import { RequestExtended } from '../types/types_local';
import { Messages } from '../types/db_schema';
import { addClient, getClient, removeClient } from './clients';

const sse = express.Router();
module.exports = sse;

const encoder = new TextEncoder();

sse.get('/register', (req: RequestExtended, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Cache-Control', 'no-cache');
    res.flushHeaders();

    const user = req.user!;
    console.log(user);
    
    addClient(user, res);

    res.write(encoder.encode(`${JSON.stringify({message: 'Connected to SSE on express server'})}\n\n`))
    res.on('close', ()=>{
        console.log('closed connections for user ', user);
        removeClient(user);
    })


})

sse.post('/sendMessage', (req: RequestExtended, res: Response) => {
    const message = req.body.message as Messages;
    
    const response = getClient(message.receiver);
    if(response) {
        const data = {
            type: 'message',
            payload: message
        }
        response.write(encoder.encode(`${JSON.stringify(data)}\n\n`))
    }
    res.status(200);
})
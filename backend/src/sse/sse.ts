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


sse.post('/sendAlert', (req: RequestExtended, res: Response) => {
    const alert = req.body.alert as Alert;
    if(!alert) res.status(404);
    
    if(alert.type=='notification') {
        const content = alert.content as Notification
        const response = getClient(content.post_user);
        if(response) {
            let obj = {
                type: content.liked_by?'like':'comment',
                post_id: content.post_id,
                from: content.liked_by??content.comment_by,
            } 

            response.write(encoder.encode(`${JSON.stringify({type: 'alert', payload: obj})}\n\n`))
        }
    }else if(alert.type=='request') {
        const content = alert.content as ConnectionRequest;
        const response = getClient(content.to);
        if(response) {
            const obj = {
                from: content.from,
                fullname: content.fullname
            }

            response.write(encoder.encode(`${JSON.stringify({type: 'alert', payload: obj})}\n\n`))
        }
    }

})



type Notification = {
    post_id: string;
    post_user: string;
    liked_by?: string;
    comment_by?: string;
};

type ConnectionRequest = {
    from: string;
    fullname: string;
    to: string;
}

type Alert = {
    type: string;
    content: Notification | ConnectionRequest;
}
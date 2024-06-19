import { Response } from "express";

const clients = new Map<string, Response>();
const encoder = new TextEncoder();



export function addClient(user: string, response: Response) {
    removeClient(user);
    clients.set(user, response);
}

export function removeClient(user: string) {
    if(clients.has(user)) {
        clients.get(user)?.end();
        clients.delete(user);
    }
}

export function getClient(user: string) {
    if(clients.has(user)) {
        return clients.get(user);
    }
}



let interval: NodeJS.Timeout | undefined = undefined ;

export function startInterval() {
    interval = setInterval(()=>{
        clients.forEach(async (response, user)=>{
            const servertime = Date.now();
            if(response.writable) response.write(encoder.encode(`ping${servertime}\n\n`));
            else console.log('possible destroyed stream ', user);
            
            // console.log('pinged', user);
            
        })
    }, 3000)
}

export function stopInterval() {
    if(interval) clearInterval(interval)
}

startInterval()


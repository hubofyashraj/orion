import 'server-only';

declare global {
    var clients: Map<string, WritableStreamDefaultWriter>
    var interval: undefined | NodeJS.Timeout
}

const clients = global.clients  || new Map<string, WritableStreamDefaultWriter>();
global.clients =clients;
export function getClient(username : string) {
    return clients.get(username);
}

export function addClient(username: string, writer: WritableStreamDefaultWriter) {
    clients.set(username, writer);
    return clients.has(username);
}

export function removeClient(username: string) {
    return clients.delete(username);
}

let interval = global.interval || undefined

if(!interval) {
    interval = setInterval(()=>{
        console.log('keys in server ', Array.from(clients.keys()));
        clients.forEach((writer, user) => {
                writer.ready.then(
                    ()=> {
                            writer.write(`data: ${JSON.stringify({ type: 'ping', payload: Date.now() })}\n\n`)
                            .then(() => console.log('writtern successfully'))
                            .catch((reason) => {
                                console.log('error');
                                
                            })
                    }
                )        
        })
    }, 5000)
    global.interval = interval;
}


export function sendEvent(username: string, event: any) {
    const client = getClient(username);
    if(client) {
        client.ready.then(()=>client.write(`data: ${JSON.stringify(event)}\n\n`))
    }
}


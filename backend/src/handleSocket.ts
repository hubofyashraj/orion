import { ObjectId } from "mongodb";
import { Server, Socket } from "socket.io";
import { getUserSocket } from "./onlineDS";
import { loadavg } from "os";

interface message {
    sender: string,
    receiver: string,
    msg: string,
    ts: string,
    id: string
}

interface pair {
    sender: string, 
    receiver: string
}

function compair(pair1 :pair, pair2: pair) {
    return JSON.stringify(pair1)===JSON.stringify(pair2);
}

export var clients :Map<string, Socket> = new Map() ;


export function addClient(ob: {user: string, soc :Socket}) {
    clients.set(ob.user, ob.soc);
    console.log('inserted new user');
    
}



export function userExists(user: string): boolean {
    return clients.has(user)

}

export function userExistsInChat(user: string): boolean {
    return clients.has(user)

}


export var io='';


export function socketSendNoti (receiver: string, list: object){ 
    if(userExists(receiver)) {
        clients.get(receiver)!.emit('new notification', JSON.stringify(list))
    }

}

export function socketSendMsg(receiver: string, sender: string, msg: message) {

    const senderSocket = getUserSocket(sender);
    if(senderSocket)    senderSocket.emit('new message', JSON.stringify(msg))
    else    console.log('socket not found', sender, senderSocket);

    
    const receiverSocket = getUserSocket(receiver);
    if(receiverSocket)    receiverSocket.emit('new message', JSON.stringify(msg))
    else    console.log('socket not found');
    
    console.log('here sending mnessagfes', receiver, receiverSocket);
    
}
import { Socket } from "socket.io";



var onlineUsers: Map<string, Socket> = new Map();


export function insertOnlineUser(user: string, socket: Socket) {
    onlineUsers.set(user, socket);
}

export function removeOnlineUser(user: string) {
    const socket = onlineUsers.get(user);
    if(socket) {
        socket.disconnect(true);
        onlineUsers.delete(user);
    }
}


export function getUserSocket(user: string) : Socket | null {
    if(onlineUsers.has(user))   return onlineUsers.get(user)!
    else return null;
}


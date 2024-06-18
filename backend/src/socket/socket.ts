// import { Server } from "socket.io";

// let io: Server | null = null;
// var users: Map<string, string> = new Map();


// export function setIO(server_socket: Server) {
//     io=server_socket;
// }

// export function getIO() {
//     return io;
// }

// export function addUser(user: string, soc_id: string) {
//     users.set(user, soc_id);
// }

// export function hasUser(user: string) {
//     return users.has(user);
// }

// export function getSocket(user: string) {
//     if(hasUser(user)) return io?.sockets.sockets.get(users.get(user)!)
// }

// export function removeUser(user: string) {
//     if(hasUser(user)) users.delete(user);
// }

// export function removeOnDisconnect(soc_id: string) {
//     for(let user in Array.from(users.keys())) {
//         if(users.get(user)==soc_id) {
//             users.delete(user);
//             break;
//         }
//     }
// }

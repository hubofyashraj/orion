// import { Socket, io } from "socket.io-client" 
// import { address } from "./api/api";
// import { useEffect } from "react";


// let socket: Socket | null = null

// export function sockInit() {
//     // var interval: string | number | NodeJS.Timeout | undefined;

//     socket = io(address, {reconnection: true, auth: {token: localStorage.getItem('token')}});
    
//     addListeners(socket);
    
//     // interval = setInterval(()=>{
//     //     if(localStorage.getItem('token')) {
//     //         socket!.emit('ping');
//     //         console.log('socket status', socket!.connected);  
//     //     }else {
//     //         clearInterval(interval)
//     //     }

//     // }, 10000)
    
// }

// function addListeners(socket: Socket) {

//     socket.on('reconnect', (attempt)=>{
//         console.log('reconnected');
//         alert('reconnected')
//     })

//     socket.on('reconnect_attempt', () => {
//         // Handle reconnection attempts
//         console.log('attempting to recconect');
        
//     });

//     socket.on('reverify', ()=>{
//         socket.emit('verify', localStorage.getItem('token')!)
//     })

//     socket.on('disconnect', ()=>{
//         console.log('disconnected');
        
//     })

//     socket.on('autherr', (message)=>{
//         alert('Authenticatino Err in socket')
//     })

//     socket.on('ping', (msg)=>{})
// }


// const useSocketEvent = (event: string, handler: any)=>{
//     useEffect(()=>{
//         socket?.on(event, handler);
//         return ()=>{
//             socket?.off(event, handler);
//         }
//     }, [event, handler])
// }

// export default useSocketEvent;

// export const pingServer = ()=>{
//     const sendTime = Date.now();
//     socket?.emit('ping', ()=>{
//         const ackTime = Date.now();
//         console.log(`ping: ${ackTime-sendTime} ms`);
//     })
// }
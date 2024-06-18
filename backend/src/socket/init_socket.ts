// import  { Server, Socket } from 'socket.io';
// import { verify_token } from '../auth/authenticate';
// import { addUser, removeOnDisconnect, setIO } from './socket';

// export default function init(io: Server) {
//     setIO(io);

//     io.on('connection', (socket: Socket)=>{
//         io.use((socket: Socket, next: Function)=>{
//             const token = socket.handshake.auth.token;
//             verify_token(token).then((username)=>{
//                 addUser(username, socket.id)
//                 next();
//             }).catch((err)=>{
                
//             })
//         })
    
//         socket.on('reconnect', (reconnect_count)=>{
//             console.log(`socket reconnected after #${reconnect_count} try`);
//             socket.emit('reverify');
            
//         })
//         socket.on('reconnect_attempt', () => {
//             // Handle reconnection attempts
//             console.log('attempt to reconnect');
            
//         });
    
//         socket.on('disconnect', ()=>{
//             removeOnDisconnect(socket.id)
//         })

//         socket.on('error', function()
//         {
//             console.log("Sorry, there seems to be an issue with the connection!");
//         });
    
//         socket.on('connect_error', function(err: any)
//         {
//             console.log("connect failed"+err);
//         });
    
        
//         socket.on('ping', (cb)=>{        
//             if(cb) cb()
//         })
    
//         socket.on('chat', (message:string)=>{
//             socket.emit('from server',message)
//         });
//     })
    
// }
import { Socket, io } from "socket.io-client" 
import { address } from "./api/api";
import { setIncomingMsg } from "./chat/chatbox";
// import { useNotification } from "./navbar/data";



// export var methods : any= {}



export function sockInit() {
    // var socket: Socket|undefined = undefined;
    
    // if(socket==undefined) {
    // console.log('trying to connect');
        
    var interval: string | number | NodeJS.Timeout | undefined;

    var socket = io(address, {reconnection: true});
    // console.log(address);
    
    // socket = io(address);
    handleSocket(socket);
    // console.log(socket);
    
    socket.emit('verify',localStorage.getItem('token')!)
    // console.log(socket.connected);
    
    interval = setInterval(()=>{
        if(localStorage.getItem('token')) {
            socket!.emit('ping');
            console.log('socket status', socket.connected);  
        }else {
            clearInterval(interval)
        }

    }, 10000)
    // }else console.log(socket);

    
  }

/**
 * 
 * @param socket incoming socket 
 * 
 */

export default function handleSocket(socket: Socket) {

    socket.on('reconnect', (attempt)=>{
        console.log('reconnected');
        alert('reconnected')
    })
    socket.on('reconnect_attempt', () => {
        // Handle reconnection attempts
        console.log('attempting to recconect');
        
    });


    socket.on('reverify', ()=>{
        socket.emit('verify', localStorage.getItem('token')!)
    })

    socket.on('disconnect', ()=>{
        console.log('disconnected');
        
    })

    socket.on('new notification', async (message)=>{

        // const ob = JSON.parse(message);
        // console.log('new notification', ob);
        
        // if(ob.length==undefined) {
        //     useNotification().push(ob);
        // }
        // else {
        //     ob.forEach(async (el: object) => {
        //         useNotification().push(el);
        //     });
        // }
    })


    socket.on('autherr', (message)=>{
        alert('Authenticatino Err in socket')
    })

    socket.on('ping', (msg)=>{})

    socket.on('new message', (msg)=> {
        msg=JSON.parse(msg);
        // console.log('new message', msg);
        
        setIncomingMsg(msg)
        
    })
}
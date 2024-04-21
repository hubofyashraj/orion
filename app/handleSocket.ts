import { Socket, io } from "socket.io-client" 
import { pushNotification } from "./navbar/notifications";
import { address } from "./api/api";
import { setIncomingMsg } from "./chat/chatbox";



// export var methods : any= {}



export function sockInit() {
    // var socket: Socket|undefined = undefined;
    
    // if(socket==undefined) {
    console.log('trying to connect');
        
        var interval: string | number | NodeJS.Timeout | undefined;
  
        var socket = io(address);
        // socket = io(address);
        handleSocket(socket);

        socket.emit('verify',localStorage.getItem('token')!)
        interval = setInterval(()=>{
            if(localStorage.getItem('token')) {
                socket!.emit('ping','');
            }else {
                clearInterval(interval)
            }
    
        }, 60000)
    // }else console.log(socket);

    
  }

/**
 * 
 * @param socket incoming socket 
 * 
 */

export default function handleSocket(socket: Socket) {

    socket.on('new notification', async (message)=>{

        const ob = JSON.parse(message);
        console.log('new notification', ob);
        
        if(ob.length==undefined) {
            await pushNotification(ob);
        }
        else {
            ob.forEach(async (el: object) => {
                await pushNotification(el);
            });
        }
    })

    socket.on('autherr', (message)=>{
        alert('Authenticatino Err in socket')
    })

    socket.on('ping', (msg)=>console.log(msg))

    socket.on('new message', (msg)=> {
        msg=JSON.parse(msg);
        console.log('new message', msg);
        
        setIncomingMsg(msg)
        
    })
}
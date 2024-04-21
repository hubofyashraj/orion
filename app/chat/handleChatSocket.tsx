import axios from "axios";
import { Socket } from "socket.io-client";
import { address } from "../api/api";
import MessageComp from "./message";
import { setMsgs } from "./chatbox";
import { ObjectId } from "mongoose";

function fetchChats(user: string) : Promise<Array<{sender: string, receiver: string, msg: string, ts: string, _id: ObjectId}>>{
    return new Promise((resolve, reject)=>{
        axios.post(
            address+'/chats/getUserTexts',
            {token: localStorage.getItem('token'),user: user}
        ).then((result)=>{
            const userData = result.data.userData
            const chats = result.data.chats
            // console.log(userData);
            // console.log(chats);
            
            resolve(chats)
            
        })

        console.log('user updated');
    })
}

export function handleChatSocket(socket: Socket, user: string) {

    fetchChats(user).then((result: Array<{sender: string, receiver: string, msg: string, ts: string, _id: ObjectId}>)=>{
        // console.log('here', result);
        var list = []

        for(var i=0; i<result.length; i++) {
            const msg = result[i];
            var element = <MessageComp msg={msg}  sender={user} key={i+msg.msg+msg.ts} />
            list.push(element);
        }

        setMsgs(list)
    }).catch((reason)=>{
        console.log('some err occured');
        
    })


    socket.on('new message', (msg)=>{
        msg = JSON.parse(msg);
        console.log('new message', msg);
        
    })
}
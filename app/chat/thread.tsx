import { Send } from "@mui/icons-material";
import { Message } from "./types";
import { useOptimistic, useRef } from "react";
import MessageComp from "./message";
import { sendMessage } from "../api/chat/chat";
import { Connection } from "../api/db_queries/chat";


export default function Thread({
    messages, user, updateMessageList
}: {
    messages: Message[], user: Connection, updateMessageList: (newMessage: Message) => void
}) {

    const [optimisticMessages, addMessageOptimistically] 
    = useOptimistic( messages, ( state: Message[], newMessage: Message ) => [ ...state, newMessage ] );
 
    async function sendOptimistically(text: string) {
        let msg: Message = {
            sender:'ToBeSet',  
            receiver: user.username, 
            msg: text, 
            ts: Date.now().toString(), 
            sending: true
        };

        try {
            addMessageOptimistically(msg);
            const message = await sendMessage(msg);
            if(message) updateMessageList(JSON.parse(message));
        } catch (err) {

        }
    }

    return (
        <>
            <div id="msgs" className="grow w-full flex flex-col items-start justify-start overflow-y-auto scrollbar-none scrollbar-track-white">
                { optimisticMessages.map((msg, idx)=>{
                    if(msg.receiver == user.username || msg.sender==user.username) 
                        return ( <>
                            {msg.sender==user.username && msg.unread && ((idx>0 && (!optimisticMessages[idx-1].unread || optimisticMessages[idx-1].sender!=user.username))  || idx==0) && <p key={'unread tag '} className="text-lg text-center self-center px-5 border-b text-slate-600 border-slate-700">Unread</p>}
                            <MessageComp key={idx}  msg={msg} user={user.username} />
                        </> )
                    
                })}
            </div>
            <div className="h-16 shrink-0 flex justify-center items-center w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800  border-slate-600">
                <MessageForm sendMessage={sendOptimistically}/>
            </div>       
        </>
    )
}




function MessageForm({
    sendMessage
}: {
    sendMessage: (text: string) => void
}) {
    const form  = useRef<HTMLFormElement | null>(null);

    async function send(formData: FormData) {
        const msg = formData.get('msg')?.toString();
        if(msg) sendMessage(msg);
        form.current?.reset();
    }

    return (
        <form ref={form} action={send} className="flex  gap-3 justify-center items-center"> 
            <input autoComplete="off"  name="msg" className=" py-2 px-4 rounded-full bg-slate-600 text-slate-200 outline-none" placeholder="Enter Message" />
            <button type="submit" className="h-8 w-8">
                <Send className=" text-slate-500 h-full w-full  rounded-full" />
            </button>
        </form>
    )
} 

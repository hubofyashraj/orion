import { Send } from "@mui/icons-material";
import { Message } from "./types";
import { FormEvent, startTransition, useEffect, useOptimistic, useRef } from "react";
import MessageComp from "./message";


export default function Thread(props : { messages: Message[], user: any, send: Function}) {
    const [optimisticMessages, addMessageOptimistically]: [Array<Message>, Function] = useOptimistic(
        props.messages,
        (state: Message[], newMessage: Message): Array<Message> => [
            ...state, newMessage
        ]
    );

    async function sendOptimistically(text: string) {
        const msg: Message = {sender: localStorage.getItem('user')!, receiver: props.user.username, msg: text, ts: Date.now().toString(), sending: true}
        
        try {
            addMessageOptimistically(optimisticMessages, msg);
            setTimeout(async ()=>{
                await props.send(msg);

            }, 0)
            
        } catch (err) {

        }
    }

    return (
        <>
            <div id="msgs" className="grow w-full flex flex-col items-start justify-start overflow-y-auto scrollbar-none scrollbar-track-white">
                { optimisticMessages.map((msg, idx)=>{
                    // console.log(idx, msg);
                    
                    if(msg.sender == localStorage.getItem('user') || msg.sender==props.user.username) 
                        return <MessageComp key={idx}  msg={msg} sender={props.user.username} />
                    
                })}
            </div>
            <div className="h-16 shrink-0 flex justify-center items-center w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800 border-t border-slate-600">
                <MessageForm send={sendOptimistically}/>
            </div>       
        </>
    )
}




function MessageForm(props: {send: Function}) {
    const form  = useRef<HTMLFormElement | null>(null);

    function send(formData: FormData) {
        const msg = formData.get('msg')?.toString();
        if(msg) props.send(msg);
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

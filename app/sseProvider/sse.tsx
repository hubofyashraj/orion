import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Message } from "../chat/types";
import { getServerTime } from "../api/sse/time";



interface SSEContextValue {
  messages: Map<string, Message>;
  setMessages: React.Dispatch<React.SetStateAction<Map<string, Message>>>;
  alerts: (NotificationAlert | ConnectRequestAlert)[];
  setAlerts: React.Dispatch<React.SetStateAction<(NotificationAlert | ConnectRequestAlert)[]>>;
  newPosts: boolean,
  setNewPosts: React.Dispatch<React.SetStateAction<boolean>>;
  ping: number
}

const SSEContext = createContext<SSEContextValue | undefined>(undefined);



interface eventMessage {
    type: 'message' | 'alert',
    payload: NotificationAlert | ConnectRequestAlert | Message | number
}



type AppAlert = {
    from: string,
}

type NotificationAlert = AppAlert & {
    post_id: string,
    type: 'like' | 'comment'
}

type ConnectRequestAlert = AppAlert & {
    fullname: string
}
 


export function SSEProvider({children}: {children: ReactNode}) {



    const [messages, setMessages] = useState<Map<string, Message>>(new Map<string, Message>());
    const [alerts, setAlerts] = useState<(NotificationAlert | ConnectRequestAlert)[]>([]);
    const [newPosts, setNewPosts] = useState(false);
    const [ping, setPing] = useState<number>(999);


    useEffect(()=>{
        let eventSource = new EventSource(`/api/sse`);


        const handleMessage = async (ev: MessageEvent) => {
            const data = JSON.parse(ev.data as string) as eventMessage;
            if(data.type=='alert') {
                const alert = data.payload as any;
                setAlerts(prev=>[...prev, alert])
            }
            else if(data.type=='message') {
                const msg = data.payload as Message;
                setMessages(prev=>{
                    if(prev.has(msg.sender)) {
                        let prevmsg = prev.get(msg.sender)!
                        let newMsgs = msg
                        if(parseInt(msg.ts)>parseInt(prevmsg.ts)) prev.set(msg.sender, newMsgs);
                    }else {
                        prev.set(msg.sender, msg)
                    }
                    return new Map<string, Message>(prev.entries());
                })
            }
            else if(data.type=='post') {
                setNewPosts(true);
            }
            else if(data.type=='ping') {
                let ct = await getServerTime();
                const st = (data.payload as number);
                setPing((ct-st)/2);
            }
            
        }


        const handleError = (ev: Event) => {
            console.log('error in eventsource', ev);
        }
        eventSource.addEventListener('message', handleMessage)
        eventSource.onerror=handleError;

        //reconnecvtion logic
        const interval = setInterval(()=>{
            if(eventSource.readyState==eventSource.CLOSED) {
                console.log('reconnectin to SSE');
                
                eventSource = new EventSource('/api/sse');
                eventSource.addEventListener('message', handleMessage);
                eventSource.onerror=handleError;
            }
        }, 30000)

        return () => {
            eventSource.removeEventListener('message', handleMessage);
            clearInterval(interval);
            eventSource.close();
        };
    }, [])


    return (
        <SSEContext.Provider value={{messages, setMessages, alerts, setAlerts, newPosts, setNewPosts, ping}}>
            {children}
        </SSEContext.Provider>
    )
}


export default function useSSE() {
    const context = useContext(SSEContext);
    if(context==undefined) throw new Error('useSSE can only be user inside SSEProvider');
    return context;
}

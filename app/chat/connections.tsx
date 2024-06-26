import { ChangeEvent, useEffect, useReducer, useRef, useState } from "react";
import { Connection } from "../api/db_queries/chat";
import ProfilePictureComponent from "../components/pfp";
import { fetchConnections } from "../api/chat/chat";
import useMessages from "../state-store/messagesStore";
import { useRouter, useSearchParams } from "next/navigation";

function Connections({user, setUser}: {user: Connection| null, setUser: (user: Connection) => void}) {

    const allConnections = useRef<Connection[]| null>(null);
    const { unreadMessages, removeMessage } = useMessages();

    const action_types = {
        INIT: 'INIT',
        NEW_UNREAD: 'NEW_UNREAD',
        SEARCH: 'SEARCH',
        SET_ALL_CONNECTIONS: 'SET_ALL_CONNECTIONS'
    }

    const comparator = (a: Connection,b: Connection)=>{
        if(!a.lastmsg && !b.lastmsg) return 0;
        if(!a.lastmsg) return 1;
        if(!b.lastmsg) return -1;
        return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
    }

    function reducer(connections: Connection[], action: {type: string, search_val?: string}) {

        if(action.type==action_types.INIT) {
            return (allConnections.current!.map((connection) => {
                const msg = unreadMessages[connection.username];
                connection.hasUnread=false;
                if(msg) {
                    connection.lastmsg=msg;
                    connection.hasUnread=connection.username==user?.username?false:true;
                }
    
                return connection;
            })??[]).toSorted(comparator)
        }
        else if(action.type==action_types.NEW_UNREAD) {

            allConnections.current?.forEach((connection) => {
                const msg = unreadMessages[connection.username];
                if(msg) {
                    connection.lastmsg=msg;
                    connection.hasUnread = connection.username==user?.username?false:true
                }
            })

            return (connections.map((connection) => {
                const msg = unreadMessages[connection.username];
                connection.hasUnread=false;
                if(msg) {
                    connection.lastmsg=msg;
                    connection.hasUnread=connection.username==user?.username?false:true;
                }
    
                return connection;
            })).toSorted(comparator)
        }

        else if(action.type==action_types.SET_ALL_CONNECTIONS) {
            return allConnections.current?.toSorted(comparator)??[]
        }

        else if(action.type==action_types.SEARCH) {
            let pattern = RegExp(action.search_val!,'i')
            return allConnections.current?.filter(
                (connection)=>connection.fullname.match(pattern) || connection.username.match(pattern)
            ).toSorted(comparator)??[]
        }

        return connections;
    }

    const [connections, dispatch] = useReducer(reducer, []);

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(()=>{
        fetchConnections().then( connections => {
            allConnections.current=connections;
            dispatch({type: 'INIT'})
        } )
    }, [])

    useEffect(()=>{
        console.log(unreadMessages);
        
        dispatch({type: 'NEW_UNREAD'})
    }, [unreadMessages])

    

    const onClick = (user: Connection) => {
        removeMessage(user.username);
        setUser(user);
        if(window.innerWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement
            div.style.marginLeft='-100vw'
        }
    }
        
    


    function searchOnChange(event: ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        if(allConnections.current==null) return;

        if(val=='') dispatch({type: action_types.SET_ALL_CONNECTIONS})
        else dispatch({type: action_types.SEARCH, search_val: val})
    }


    return (
        <div id="connections" className="connections  select-none border-r border-slate-500 transition-all  text-white bg-slate-700 flex flex-col w-[calc(100svw)] sm:m-0 sm:w-[calc(34svw)] shrink-0 h-full ">
            <div className="w-full bg-slate-800 flex first-line justify-center py-2">
                <input onChange={searchOnChange} placeholder="search" type="text" className="px-4 py-1 bg-transparent border drop-shadow-sm hover:bg-slate-600 focus:bg-slate-600 focus:border-slate-700 select-none border-slate-700 outline-none rounded-full" />
            </div>
            <div className="grow flex  flex-col overflow-y-auto scrollbar-none ">
                { connections 
                ? connections.map( (user, idx)=><UserComponent onClick={()=>onClick(user)} key={user.lastmsg?.ts+user.username} info={user}/>)
                : <p>No Connections</p> }
            </div>
        </div>
    )
}





function UserComponent({
    info, onClick
}: {
    info: Connection, onClick: () => void
}) {
    return (
        <div onClick={onClick} className="clickableuser  cursor-pointer px-2 py-2 flex gap-5 justify-start items-center bg-slate-800 shadow-md">
            <div className="h-12 w-12 bg-slate-900 rounded-full p-[calc(3px)] shrink-0">
                <div className="h-full w-full rounded-full overflow-hidden ">
                    <ProfilePictureComponent key={info.username} size={100} user={info.username} hasPFP={info.pfp_uploaded} />
                </div>
            </div>
            <div className="grow   h-full ">
                <div className="flex h-full w-full flex-col justify-center gap-1 ">
                    <p>{info.fullname}</p>
                    <div className="text-xs grow-0 flex items-center justify-between text-slate-400 overflow-clip text-ellipsis">
                        { info.lastmsg!=null && <p className={info.hasUnread?"font-bold text-sm":""}>{info.lastmsg.msg}</p> }
                        { info.hasUnread && (<p className="font-semibold animate-pulse">Unread</p>)}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
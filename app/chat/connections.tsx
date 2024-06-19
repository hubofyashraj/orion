import { ChangeEvent, useEffect, useRef, useState } from "react";
import { fetchConnections } from "../api/chat/chat";
import { Connection } from "../api/db_queries/chat";
import useSSE from "../sseProvider/sse";
import ProfilePictureComponent from "../components/pfp";

function Connections({
    screenWidth, focus, focusUser
}: {
    screenWidth:number, focus:() => void, focusUser: (user: Connection) => void
}) {

    console.log('rendered');
    
    const allConnections = useRef<Connection[]>([]);
    const [connections, setConnections] = useState<Connection[]>([]);

    const { messages } = useSSE();


    useEffect(()=>{
        setConnections(prev=>{
            let updatedConnections = prev?.map((connection) => {
                if(messages.has(connection.username)) {
                    connection.lastmsg=messages.get(connection.username)!;
                }
                return connection;
            })
    
            updatedConnections?.sort((a, b) => {
                const tsa = parseInt(a.lastmsg?.ts??'0');
                const tsb = parseInt(b.lastmsg?.ts??'0');
    
                return tsb-tsa;
            })

            return updatedConnections
        });
        
    }, [messages])

    useEffect(()=>{
        fetchConnections().then( connections => {
            allConnections.current=connections;
            setConnections(connections)
        } )
    }, [])

    function onClickOnUser(user: Connection) {
        focus(); 
        focusUser(user);
        if(screenWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement
            div.style.marginLeft='-100vw'
        }
        setConnections( prev => prev?.map(
            connection => connection.username==user.username
                ? {...connection, lastmsg: {...connection.lastmsg, unread: false}} as Connection 
                : connection) )
    }

    function searchOnChange(event: ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        if(val=='') setConnections(allConnections.current);
        else {
            let pattern = RegExp(val,'i')
            setConnections(allConnections.current.filter(
                (connection)=>connection.fullname.match(pattern) || connection.username.match(pattern)
            ))
        }
    }


    return (
        <div id="connections" className="connections  select-none border-r border-slate-500 transition-all  text-white bg-slate-700 flex flex-col w-[calc(100svw)] sm:m-0 sm:w-[calc(34svw)] shrink-0 h-full ">
            <div className="w-full bg-slate-800 flex first-line justify-center py-2">
                <input onChange={searchOnChange} placeholder="search" type="text" className="px-4 py-1 bg-transparent border drop-shadow-sm hover:bg-slate-600 focus:bg-slate-600 focus:border-slate-700 select-none border-slate-700 outline-none rounded-full" />
            </div>
            <div className="grow flex  flex-col overflow-y-auto scrollbar-none ">
                { connections 
                ? connections.map( (user, idx)=><UserComponent onClick={()=>onClickOnUser(user)} key={user.lastmsg?.ts+user.username} info={user}/>)
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
                    <ProfilePictureComponent size={100} user={info.username} />
                </div>
            </div>
            <div className="grow max-w-[calc(50%)]  h-full ">
                <div className="flex h-full flex-col justify-center gap-1 ">
                    <p>{info.fullname}</p>
                    <div className="text-xs grow-0  text-slate-400 overflow-clip text-ellipsis">
                        { info.lastmsg!=null && <p className={info.lastmsg.unread?"font-bold text-sm":""}>{info.lastmsg.msg}</p> }
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
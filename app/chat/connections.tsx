import { ChangeEvent, Dispatch, useEffect } from "react";
import { Connection } from "../api/db_queries/chat";
import ProfilePictureComponent from "../components/pfp";

function Connections({
    setConnections, allConnections, connections, focusUser
}: {
    setConnections: Dispatch<React.SetStateAction<Connection[]>>, 
    allConnections: React.MutableRefObject<Connection[]>,
    connections: Connection[], focusUser: (user: Connection) => void
}) {



    function searchOnChange(event: ChangeEvent<HTMLInputElement>) {
        const val = event.target.value;
        if(val=='') setConnections(allConnections.current.toSorted((a,b) => {
            if(!a.lastmsg && !b.lastmsg) return 0;
            if(!a.lastmsg) return 1;
            if(!b.lastmsg) return -1;
            return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
        }));
        else {
            let pattern = RegExp(val,'i')
            setConnections(allConnections.current.filter(
                (connection)=>connection.fullname.match(pattern) || connection.username.match(pattern)
            ).toSorted((a,b) => {
                if(!a.lastmsg && !b.lastmsg) return 0;
                if(!a.lastmsg) return 1;
                if(!b.lastmsg) return -1;
                return (b.lastmsg.ts).localeCompare(a.lastmsg.ts)
            }))
        }
    }


    return (
        <div id="connections" className="connections  select-none border-r border-slate-500 transition-all  text-white bg-slate-700 flex flex-col w-[calc(100svw)] sm:m-0 sm:w-[calc(34svw)] shrink-0 h-full ">
            <div className="w-full bg-slate-800 flex first-line justify-center py-2">
                <input onChange={searchOnChange} placeholder="search" type="text" className="px-4 py-1 bg-transparent border drop-shadow-sm hover:bg-slate-600 focus:bg-slate-600 focus:border-slate-700 select-none border-slate-700 outline-none rounded-full" />
            </div>
            <div className="grow flex  flex-col overflow-y-auto scrollbar-none ">
                { connections 
                ? connections.map( (user, idx)=><UserComponent onClick={()=>focusUser(user)} key={user.lastmsg?.ts+user.username} info={user}/>)
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
            <div className="grow   h-full ">
                <div className="flex h-full w-full flex-col justify-center gap-1 ">
                    <p>{info.fullname}</p>
                    <div className="text-xs grow-0 flex items-center justify-between text-slate-400 overflow-clip text-ellipsis">
                        { info.lastmsg!=null && <p className={info.lastmsg.sender==info.username && info.lastmsg.unread?"font-bold text-sm":""}>{info.lastmsg.msg}</p> }
                        { info.lastmsg?.sender==info.username && info.lastmsg.unread && (<p className="font-semibold animate-pulse">Unread</p>)}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
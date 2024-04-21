import axios from "axios";
import { useEffect, useState } from "react";
import { address } from "../api/api";

function Connections(props: any) {

    const [connections, setConnections] = useState([] as Array<any>)

    function getConnections() {
        console.log('test');
        
        axios.post(
            address+'/chats/getChats',
            {token: localStorage.getItem('token')}
        ).then((result)=>{
            
            const users : Array<any> = result.data.connections;
            
            var list: Array<any> = [];
            for (let i = 0; i < users.length; i++) {
                const ob = users[i];
                console.log(ob);
                
                list.push(<ClickableUser onClick={()=>{props.toggleChat(); props.setChatUser(ob)}} key={ob.username} info={ob}/>)
            }
            setConnections(list)
            
        })
    }

    useEffect(()=>{
        getConnections()
    })

    return (
        <div className="connections border bg-slate-100 flex flex-col w-full md:w-[calc(60rem)] h-[calc(100vh-64px)] ">
            <div className="h-16 text-center flex justify-center items-center border-b-2">
                <p className="text-lg">Your Connections</p>
            </div>
            <div className="grow flex flex-col overflow-y-scroll scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-200">
                {connections}
            </div>
        </div>
    )
}

function ClickableUser(props: any) {



    return (
        <div onClick={props.onClick} className="clickableuser h-16 px-2 flex gap-5 justify-between items-center">
            <div className="h-12 w-12 p-1">
                <div className="h-full w-full rounded-full bg-black"></div>
            </div>
            <div className="grow">
                <div className="flex justify-between">
                    <p>{props.info.fullname}</p>
                    <div id="onlinestatus rounded-full"></div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
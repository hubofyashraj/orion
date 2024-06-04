import axios from "axios";
import { useEffect, useState } from "react";
import { address } from "../api/api";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilUser } from "@coreui/icons";

function Connections(props: {screenWidth:number, setPrimary:Function, setChatUser: Function}) {

    const [connections, setConnections] = useState([] as Array<any>)

    useEffect(()=>{
        function getConnections() {
            // console.log('test');
            axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
            axios.get(
                address+'/chats/getConnections',
            ).then((result)=>{
                const users : Array<any> = result.data.connections;
                setConnections(users)
            })
        }

        getConnections()
    }, [props])

    function onClickOnUser(user: any) {
        props.setPrimary(); 
        props.setChatUser(user)
        if(props.screenWidth<=640) {
            const div = document.getElementById('connections') as HTMLDivElement
            div.style.marginLeft='-100vw'
        }
    }

    return (
        <div id="connections" className="connections transition-all border bg-slate-100 flex flex-col w-[calc(100svw)] sm:m-0 sm:w-[calc(34svw)] shrink-0 h-full ">
            <div className="h-16 text-center flex justify-center items-center border-b-2">
                <p className="text-lg">Your Connections</p> 
            </div>
            <div className="grow flex  flex-col overflow-y-scroll scrollbar-thin scrollbar-track-slate-100 scrollbar-thumb-slate-200">
                { connections.map(
                    (user, idx)=><ClickableUser onClick={()=>onClickOnUser(user)} key={idx} info={user}/>
                )}
            </div>
        </div>
    )
}



function ClickableUser(props: any) {

    const [photo, setPhoto] = useState(null);

    

    useEffect(()=>{
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.get(
            address+'/profile/fetchPFP?user='+props.info.username,
        ).then((result)=>{
            if(result.data.success) {
                setPhoto(result.data.image)
            }
        })
    },[props.info.username])

    return (
        <div onClick={props.onClick} className="clickableuser h-16 px-2 flex gap-5 justify-between items-center bg-slate-200">
            <div className="h-12 w-12 bg-gray-300 rounded-full p-[calc(3px)]">
                <div className="h-full w-full rounded-full overflow-hidden ">
                    {(photo=='' || photo==null)
                    ?<CIcon className="h-full w-full p-1 bg-gray-400" icon={cilUser} />
                    :<Image className="h-full w-full" alt="img" height={100} width={100} src={'data:image/png;base64,'+photo} /> }
                </div>
            </div>
            <div className="grow">
                <div className="flex flex-col justify-between">
                    <p>{props.info.fullname}</p>
                    <div className="text-xs text-slate-700">
                        {props.info.lastmsg!=null && <p>{props.info.lastmsg}</p>}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
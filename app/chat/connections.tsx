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
        <div id="connections" className="connections  border-r border-slate-500 transition-all  text-white bg-slate-700 flex flex-col w-[calc(100svw)] sm:m-0 sm:w-[calc(34svw)] shrink-0 h-full ">
            {/* <div className=" text-center flex justify-center items-center  bg-slate-800">
                <p className="text-lg">Your Connections</p> 
            </div> */}
            <div className="grow flex  flex-col gap-px overflow-y-auto scrollbar-none ">
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
        <div onClick={props.onClick} className="clickableuser px-2 py-2 flex gap-5 justify-start items-center bg-slate-800 shadow-md">
            <div className="h-12 w-12 bg-slate-900 rounded-full p-[calc(3px)] shrink-0">
                <div className="h-full w-full rounded-full overflow-hidden ">
                    {(photo=='' || photo==null)
                    ?<CIcon className="h-full w-full p-1 bg-slate-950" icon={cilUser} />
                    :<Image className="h-full w-full" alt="img" height={100} width={100} src={'data:image/png;base64,'+photo} /> }
                </div>
            </div>
            <div className="grow max-w-[calc(50%)]  h-full ">
                <div className="flex h-full flex-col justify-center gap-1 ">
                    <p>{props.info.fullname}</p>
                    <div className="text-xs grow-0 max-h-4 text-slate-400 overflow-clip text-ellipsis">
                        {props.info.lastmsg!=null && <p className="">{props.info.lastmsg}</p>}
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default Connections;
import axios from "axios";
import { useEffect, useState } from "react";
import { address } from "../api/api";
import Image from "next/image";
import CIcon from "@coreui/icons-react";
import { cilUser } from "@coreui/icons";

function Connections(props: any) {

    const [connections, setConnections] = useState([] as Array<any>)



    useEffect(()=>{
        function getConnections() {
            // console.log('test');
            
            axios.post(
                address+'/chats/getConnections',
                {token: localStorage.getItem('token')}
            ).then((result)=>{
                
                const users : Array<any> = result.data.connections;
                
                var list: Array<any> = [];
                for (let i = 0; i < users.length; i++) {
                    const ob = users[i];
                    // console.log(ob);
                    
                    list.push(<ClickableUser onClick={()=>{props.toggleChat(); props.setChatUser(ob)}} key={ob.username} info={ob}/>)
                    // console.log(ob);
                    
                }
                setConnections(list)
                
            })
        }

        getConnections()
    }, [props])

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

    const [photo, setPhoto] = useState(null);

    // console.log(props.info);
    // async function fetchProfileImage() {
        
    // }

    

    useEffect(()=>{
        axios.post(
            address+'/profile/fetchProfileImage',
            {token: localStorage.getItem('token'), user: props.info.username}
        ).then((result)=>{
            // console.log(result);
            if(result.data.success) {
                console.log(result.data);
                
                setPhoto(result.data.image)
            }
        })
    },[])




    return (
        <div onClick={props.onClick} className="clickableuser h-16 px-2 flex gap-5 justify-between items-center">
            <div className="h-12 w-12 bg-gray-500 rounded-full p-[calc(3px)]">
                <div className="h-full w-full rounded-full overflow-hidden ">
                    {(photo=='' || photo==null)
                    ?<CIcon className="h-full w-full p-1 bg-gray-400" icon={cilUser} />
                    :<Image className="h-full w-full" alt="img" height={100} width={100} src={photo} /> }
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
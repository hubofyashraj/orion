import { ReactNode, useEffect, useState } from "react"
import axios from "axios"
import { address } from "../api/api"
import RequestNotification from "./requestNotification"
import { useRequests } from "./data"

interface requests {
    req_id: string,
    user: string,
    fullname: string,
    profile_image: string
}

interface result {
    success: boolean,
    reason?: string,
    requests?: Array<requests>
}

export default function Requests() {

    //TODO CREATE REQUESTS COMPONENT FETCH REQUESTS HERE ONLY
  const [fetched, setFetched] = useState(false);
  const { reqs, setReqs, push, pop } = useRequests();
    
  



    useEffect(()=>{

      async function fetchRequests() {
        await axios.post(
          address+'/notifications/getRequests', 
          {token: localStorage.getItem('token'), user: sessionStorage.getItem('user')}
        ).then((res)=>{
            const data = res.data as result;
            
            if(data.success) {
              // console.log(data.requests);
              
                var list: Array<React.JSX.Element> = [];
                data.requests!.forEach((reqst)=>{
                  // console.log(reqst);
                  
                    const comp = <RequestNotification key={reqst.req_id} data={reqst} />
                    list.push(comp)
                })
  
                setReqs(list)
            }
            
        })
      }

      fetchRequests().then(()=>{
        setFetched(true);
      })


    }, [fetched, setReqs])

    if(!fetched) return (<></>);

    return (
        <div className=" flex flex-col gap-5  p-3  overflow-y-auto scrollbar-none   ">
          {reqs.length==0 && <p className="text-center text-slate-600">No requests</p>}
          {reqs.length!=0 && reqs}
          {}
        </div>
    )
}



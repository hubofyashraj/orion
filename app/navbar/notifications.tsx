import { useState } from "react";
import images from "../images";
import Image from "next/image";
import axios from "axios";
import { address } from "../api/api";


export var pushNotification: Function;
var popNotification: Function;

export default function Notifications(){
    const [notifications, setNotifications] = useState([] as Array<any>);

    function pushNoti (ob: any){
        // console.log(ob, notifications)

        const element = <RequestNotification key={ob.id} sender={ob} />;
        var list = notifications;
        list.push(element)
        setNotifications(list)
        // console.log(notifications);
        
    }

    function popNoti(_id: string) {
      setNotifications(notifications=>notifications.filter(notification=>{return notification.key!=_id}))
      
    }

    pushNotification = pushNoti;
    popNotification = popNoti;


    return(
        <div className={" flex flex-col gap-5 w-96 p-3      "}>
            {notifications.length==0 && <p className="text-center text-slate-600">No notifications</p>}
            {notifications}
        </div>
    )
}



export function handleRequest(_id: string,resp: boolean) {
    if(resp==true) {
      axios.post(
        address+'/acceptReq',
        {cypher: _id}
      ).then((res) =>{
        if(res.data.success) {
            popNotification(_id);
        }
        else {

        }
        
      }).catch((reason)=>{

      })
    }else {
      axios.post(
        address+'/declineReq',
        {cypher: _id}
      ).then((res)=>{

      }).catch((reason)=>{
        
      })
    }
  }


export function RequestNotification(props: any) {
      
      return (
        <div className='notification   flex gap-5 px-2 py-1 bg-slate-600 border-b-2'>
          <div className='flex w-12 h-full shrink-0 items-center justify-center'>
            <div className='rounded-full bg-black w-full h-12 flex justify-center items-center p-2 '>
              <Image className='w-10 bg-white' alt='user' width={2} height={2} src={images.next.src}/>
            </div>
          </div>
          <div className='grow'>
            <p className='text-xl'>{props.sender.fullname}</p>
            <p className='text-lg'>{props.sender.username}</p>
            <div className='flex justify-end gap-5'>
              <a onClick={()=>{handleRequest(props.sender.id, true)}} className='hover:text-violet-500 cursor-pointer'>Accept</a>
              <a onClick={()=>{handleRequest(props.sender.id, false)}} className='hover:text-violet-500 cursor-pointer'>Decline</a>
            </div>
          </div>
    
        </div>
      )
    }
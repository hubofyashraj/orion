import axios from "axios";
import { useState } from "react";
import { address } from "../api/api";
import RequestNotification from "./requestNotification";

// export function useNotification() {
//   const [notifications, setNotifications] = useState([] as Array<any>);
  
//   function push (ob: any){
//       // console.log(ob, notifications)

      
//       // console.log(notifications);
      
//   }

//   function pop(_id: string) {
//     setNotifications(notifications=>notifications.filter(notification=>{return notification.key!=_id}))
    
//   }

//   return { notifications, push, pop}

// }

export function useRequests() {
  const [reqs, setReqs] = useState([] as React.JSX.Element[]);


  function push (ob: any){
      // console.log(ob, notifications)

      const element = <RequestNotification key={ob.id} data={ob} />;
      var list = reqs;
      list.push(element)
      setReqs(list)
      // console.log(notifications);
      
  }

  function pop(_id: string) {
    setReqs(preqs=>preqs.filter(reqs=>{return reqs.key!=_id}))
    
  }

  return {reqs, setReqs, push, pop}

}


export function handleRequest(_id: string,resp: boolean) {
    if(resp==true) {
      axios.post(
        address+'/acceptReq',
        {cypher: _id}
      ).then((res) =>{
        if(res.data.success) {
          useRequests().pop(_id)  
          
          // popReq(_id);
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
import axios from "axios";
import { address } from "../../api/api";

export interface NotificationContent {
  post_id: string;
  event: 'like' | 'comment';
  event_by: string
}

interface RequestContent {
  sender: string;
  sender_name: string;
}

export interface AppAlert {
  type: 'request' | 'notification',
  content: NotificationContent | RequestContent
}

export function handleRequest(_id: string,resp: boolean) {
    if(resp==true) {
      axios.post(
        address+'/acceptReq',
        {cypher: _id}
      ).then((res) =>{
        if(res.data.success) {
          // useRequests().pop(_id)  
          
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


  export const pagetitle: any = {
    'feed': 'Home',
    'profile': 'Your Profile',
    'search': 'Search',
    'chat': 'Inbox',
    'edit': 'Edit Profile',

  }
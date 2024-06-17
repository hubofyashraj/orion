import axios from "axios";
import { ReactNode, createContext, useContext, useState } from "react";
import { address } from "../../api/api";

interface NotificationContent {
  heading: string,
  text: string
}

interface RequestContent {
  
}

export interface AppAlert {
  type: 'request' | 'notification',
  content: NotificationContent | RequestContent
}

interface AlertsContextType {
  alerts: AppAlert[],
  setAlerts: React.Dispatch<React.SetStateAction<AppAlert[]>>;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export default function AlertsProvider({
  children
}: {
  children: ReactNode
}) {

  const [alerts, setAlerts] = useState<AppAlert[]>([]);

  return (
    <AlertsContext.Provider value={{alerts, setAlerts}} >
      {children}
    </AlertsContext.Provider>
  )
}

export function useAlerts() {
  const context =  useContext(AlertsContext);
  if(context==undefined) throw new Error('useAlerts only allowed inside AlertsProvider');
  
  return context;
}

// export function useRequests() {
//   const [reqs, setReqs] = useState([] as React.JSX.Element[]);


//   function push (ob: any){
//       // console.log(ob, notifications)

//       const element = <RequestNotification key={ob.id} data={ob} />;
//       var list = reqs;
//       list.push(element)
//       setReqs(list)
//       // console.log(notifications);
      
//   }

//   function pop(_id: string) {
//     setReqs(preqs=>preqs.filter(reqs=>{return reqs.key!=_id}))
    
//   }

//   return {reqs, setReqs, push, pop}

// }


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
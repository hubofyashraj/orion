import { AppAlert } from "./data"

export default function Notifications({
    notificationsAlerts
}: {
    notificationsAlerts: AppAlert[]
}){
    
    return(
        <div className=" flex flex-col gap-5  p-3  overflow-y-auto scrollbar-none   ">
          { notificationsAlerts.length==0 
          ? <p className="text-center text-slate-600">No new notifications</p>
          : <></> }
        </div>
    )
}



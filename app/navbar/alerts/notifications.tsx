import Image from "next/image"
import { useEffect, useState } from "react"

export default function Notifications({
    notificationsAlerts
}: {
    notificationsAlerts: NotificationAlert[]
}){
    
    const [oldNotifications, setOldNotification] = useState([]);

    useEffect(()=>{

    })

    return(
        <div className=" flex flex-col gap-3 h-4/5  p-3  overflow-y-auto scrollbar-none   ">
          { notificationsAlerts.length==0 
          ? <p className="text-center text-slate-600">No new notifications</p>
          : <div>

                {notificationsAlerts.map((alert, idx) => {
                     
                    if(alert.type=='like') {
                        return  <div key={idx+alert.post_id} className="flex items-center">
                            <p className="grow">{alert.from} liked your post</p>
                            <Image className="rounded-md" alt="thumbnail" width={32} height={32} src={'/api/images?type=post-asset&asset-id='+alert.post_id+'-0'} />
                        </div>
                        
                    }else if(alert.type=='comment') {
                        return  <div key={idx+alert.post_id} className="flex ">
                            <p className="grow">{alert.from} commented on your post</p>
                            <Image className="rounded-md" alt="thumbnail " width={32} height={32} src={'/api/images?type=post-asset&asset-id='+alert.post_id+'-0'} />
                        </div>
                        
                    }
                    return <></>
                })}
            </div> }
        </div>
    )
}



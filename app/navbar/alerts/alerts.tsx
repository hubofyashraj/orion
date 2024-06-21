import { useRef, useState } from "react";
import Notifications from "./notifications";
import Requests from "./requests";
import CIcon from "@coreui/icons-react";
import { cilX } from "@coreui/icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/sseProvider/store";

export default function Alerts({
}: {
}) {
    const [current, setCurrent] = useState<'notification' | 'requests'>('notification');
    const notifications = useRef<HTMLDivElement | null>(null);
    const alerts = useSelector((state: RootState) => state.alerts);
    const requests = useSelector((state: RootState) => state.requests);
    
    function close() {
        if(notifications.current) notifications.current.style.marginTop='-150vh'
    }

    return (
        <div ref={notifications} style={{ marginTop: '-150vh' }} id="notifications" className={"text-slate-200 transition-all h-96 max-w-[calc(20rem)] max-h-[calc(100svh-80px)] w-[calc(90svw)] bg-slate-800  drop-shadow-lg shadow-gray-900 absolute md:right-[calc(19rem)]  left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 z-50 duration-500 flex flex-col  rounded-lg border border-slate-900"}>
            <div className="flex rounded-t-lg   justify-center divide-x-0 divide-slate-300 text-center select-none">
                <p onClick={current=='notification'?()=>{}:()=>setCurrent("notification")} className={(current=='notification'?"w-2/3 bg-slate-800 ": "w-1/3 rounded-br-lg bg-slate-700 hover:text-slate-400")+(alerts.length==0?'':' animate-pulse ')+" p-2 transition-all duration-500 rounded-tl-lg"}>Notifications</p>
                <p onClick={current=='requests'?()=>{}:()=>setCurrent('requests')}  className= {(current=='requests'?"w-2/3 bg-slate-800 ": "w-1/3 rounded-bl-lg bg-slate-700 hover:text-slate-400 ")+(requests.length==0?'':' animate-pulse ')+" transition-all duration-500 p-2 "}>Requests</p>
                <button className={(current=="requests"?"":"bg-slate-700 ")+ " transition-all rounded-tr-lg p-2 "} onClick={close}><CIcon className="h-5" icon={cilX}/></button>
            </div>
            {current=='notification' &&  <Notifications notificationsAlerts={alerts}  /> }
            {current=='requests' &&  <Requests requestsAlerts={requests} /> }
        </div>
    )
}
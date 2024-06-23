import ProfilePictureComponent from "@/app/components/pfp"
import { acceptRequestFromUser, rejectRequestFromUser } from "@/app/api/navbar/navbar"
import useAlerts from "@/app/state-store/alertsStore";


export default function Requests({
  requestsAlerts
}: {
  requestsAlerts: {[key: string]: string}
}){


  const { removeRequest } = useAlerts();

  async function acceptRequest(from: string) {
    const result = await acceptRequestFromUser(from);
    if(result) removeRequest(from);
  }

  async function declineRequest(from: string) {
    const result = await rejectRequestFromUser(from);
    if(result) removeRequest(from);
  }

  return (
      <div className=" flex flex-col gap-3 p-3   h-[calc(88%)] overflow-y-auto scrollbar-none   ">
        { Object.keys(requestsAlerts).length==0 
        ? <p className="text-center text-slate-600">No requests</p>
        : <>
            {Object.entries(requestsAlerts)
            .map( request => 
              <div className="flex gap-2 items-center  " key={request[0]}>
                <div className="rounded-full overflow-hidden">
                <ProfilePictureComponent size={32} user={request[0]} />
                </div>
                <div className="flex   flex-col items-start ">
                  <p className="text-wrap"><span className="hover:text-white  cursor-pointer">{request[0]}  </span> want to connect</p>
                  <div className=" flex gap-5 text-xs ">
                    <button onClick={()=>acceptRequest(request[0])} className="hover:scale-105 hover:text-white">Accept</button>
                    <button onClick={()=>declineRequest(request[0])} className="hover:scale-105 hover:text-white">Decline</button>
                  </div>
                </div>
              </div>)}
              
          </> }
      </div>
  )
}






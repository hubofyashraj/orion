import ProfilePictureComponent from "@/app/components/pfp"
import { acceptRequestFromUser, rejectRequestFromUser } from "@/app/api/navbar/navbar"
import useSSE from "@/app/sseProvider/sse";


export default function Requests({
  requestsAlerts
}: {
  requestsAlerts: ConnectRequestAlert[]
}){

  const { setAlerts } = useSSE();

  async function acceptRequest(from: string) {
    const result = await acceptRequestFromUser(from);
    if(result) {
      setAlerts(prev => prev.filter(alert => {
        if(alert.from==from && 'fullname' in alert) return false;
        return true;
      }))
    }
  }

  async function declineRequest(from: string) {
    const result = await rejectRequestFromUser(from);
    setAlerts(prev => prev.filter(alert => {
      if(alert.from==from && 'fullname' in alert) return false;
      return true;
    }))
  }

  return (
      <div className=" flex flex-col gap-3 p-3   h-[calc(88%)] overflow-y-auto scrollbar-none   ">
        { requestsAlerts.length==0 
        ? <p className="text-center text-slate-600">No requests</p>
        : <>
            {requestsAlerts
            .map( request => 
              <div className="flex gap-2 items-center  " key={request.from}>
                <div className="rounded-full overflow-hidden">
                <ProfilePictureComponent size={32} user={request.from} />
                </div>
                <div className="flex   flex-col items-start ">
                  <p className="text-wrap"><span className="hover:text-white  cursor-pointer">{request.from}</span> want to connect</p>
                  <div className=" flex gap-5 text-xs ">
                    <button onClick={()=>acceptRequest(request.from)} className="hover:scale-105 hover:text-white">Accept</button>
                    <button onClick={()=>declineRequest(request.from)} className="hover:scale-105 hover:text-white">Decline</button>
                  </div>
                </div>
              </div>)}
              
          </> }
      </div>
  )
}






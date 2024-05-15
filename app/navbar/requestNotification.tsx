import { cilAt, cilUser } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import Image from "next/image"
import { handleRequest } from "./data"


interface requests {
    req_id: string,
    user: string,
    fullname: string,
    profile_image: string
}




export default function RequestNotification(props: {key: string, data: requests}) {
    
    return (
      <div className='notification select-none    flex items-center gap-5  bg-white bg-opacity-20 px-4 py-3  rounded-lg'>
        <div className='flex w-12 h-full shrink-0 items-center justify-center'>
          <div className='rounded-full border-2 w-full h-12 flex justify-center drop-shadow-md bg-inherit items-center overflow-hidden '>
            { props.data.profile_image==''
            ?<CIcon className="h-full w-full m-2" icon={cilUser} />
            :<Image className='w-full bg-white' alt='user' width={2} height={2} src={props.data.profile_image}/> }
          </div>
        </div>
        <div className='grow relative text-slate-700'>
          <p className='text-base'>{props.data.fullname}</p>
          <p className='text-sm m-0 flex gap-1 items-center'><CIcon className="h-3" icon={cilAt} />{props.data.user}</p>
          <div className='flex justify-end gap-5 absolute bottom-0 right-0'>
            <a onClick={()=>{handleRequest(props.data.req_id, true)}} className='hover:text-slate-800 drop-shadow-lg cursor-pointer'>Accept</a>
            <a onClick={()=>{handleRequest(props.data.req_id, false)}} className='hover:text-slate-800 drop-shadow-lg cursor-pointer'>Decline</a>
          </div>
        </div>
  
      </div>
    )
  }
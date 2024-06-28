import { useEffect, useState } from "react";
import { AlternateEmail, ArrowBack, Cancel, CheckCircle, Delete, Email, Notes, PeopleAlt, PersonAdd, Phone, PinDrop, Work } from "@mui/icons-material";
import { Match } from "./search";
import UserPosts from "./userPosts";
import { fetchInfo } from "../api/profile/profile";
import ProfilePictureComponent from "../components/pfp";
import { acceptRequest, cancelRequest, sendRequest } from "../api/search/search";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "../loading";


export default function UserProfile({ 
    close, action
} : {
    close: () => void, action: (action: string, _id?: string) => void
}) {
    const [info, setInfo] = useState<ProfileInfo | undefined>()

    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(refresh, [searchParams, router])

    function refresh() {
        const user = searchParams.get('user');
        if(!user) router.push('/?tab=search')
        fetchInfo(user).then((infoString)=>{
            if(infoString) {
                const info = JSON.parse(infoString);
                setInfo(info)
                document.title = `${info?.fullname} | YASMC`;
            }
        })
    }


    if(!info) return <Loading/>

    return (
        <div className="relative bg-slate-800 text-slate-300 h-full w-full ">
            {<div className="flex flex-col h-full relative  justify-start sm:justify-start sm:items-start  items-center gap-5  overflow-y-auto scrollbar-none">
                <div className="details w-full flex flex-col gap-3 justify-start sm:items-start items-center grow">
                    <div className="relative flex w-full h-36 bg-slate-900 flex-col sm:gap-6 sm:flex-row-reverse  justify-between items-center">
                        <div className="flex w-full  self-end flex-col justify-center items-center sm:items-start">
                            <p className="text-xl">{info.fullname } {info.status=='connected' && <PeopleAlt/>}</p>
                            
                            <div className="text-base flex justify-center items-center gap-1 ">
                                <AlternateEmail className="text-red-600 " fontSize="inherit" />
                                <p>{info.username}</p>
                            </div>
                        </div>
                        
                        <div className=" sm:ml-10 sm:mt-20 p-2  rounded-full bg-inherit">
                            <div className="h-32 w-32 shrink-0  profile-img relative rounded-full bg-slate-800 overflow-hidden flex justify-center items-center">
                                <ProfilePictureComponent size={128} user={info.username} hasPFP={info.pfp_uploaded} />
                            </div>
                        </div>
                        <ArrowBack className="absolute top-2 left-2 hover:scale-105" onClick={close} />
                        
                    </div>
                    <div className=" pl-12 mt-10 self-start select-none flex flex-col gap-2">
                        <p className="flex gap-1 items-start text-sm"><Notes className="text-red-300 " fontSize="small"/>   {info.bio}</p>
                        {
                            info.status=='connected' && 
                            <>
                                <p className="flex gap-1 items-start text-sm"><Phone className="text-red-300 " fontSize="small" /> {info.contact}</p>
                                <p className="flex gap-1 items-start text-sm"><Email className="text-red-300 " fontSize="small"  /> {info.email}</p>
                                    
                                <p className="flex gap-1 items-start text-sm"><PinDrop className="text-red-300 " fontSize="small"  /> {info.location}</p>
                                <p className="flex gap-1 items-start text-sm"><Work className="text-red-300 " fontSize="small"  /> {info.profession}</p>
                            </>
                        }
                    </div>
                    { info.status=='connected' 
                    ? <div className="grow px-2  w-full ">
                        <p className="text-xl py-2 sm:ml-16 sm:px-2 text-center sm:text-left">Posts</p>
                        <UserPosts user={info.username} />
                      </div>    
                    : <ConnectionComponent info={info} action={action} refresh={refresh}/>}


                </div>
            </div>}
        
          </div>
    )

}

function ConnectionComponent({
    info, action, refresh
}: {
    info: ProfileInfo, action: (action:string, _id?: string) => void,refresh: () => void
}) {
    
    async function sendrequest() {
        const req_id = await sendRequest(info.username);
        if(req_id) {
            action('send', req_id);
            refresh();
        }
    }

    async function cancelrequest() {
        const result = await cancelRequest(info.id as string);
        if(result) {
            action('cancel');
            refresh();
        }
    }

    async function acceptrequest() {
        const result = await acceptRequest(info.id as string);
        if(result) { 
            action('accept')
            refresh()
        }
    }

    async function declinerequest() {
        const result = await cancelRequest(info.id as string);
        if(result) {
            action('cancel');
            refresh();
        }
    }
    
    const btnStyle = 'w-max bg-slate-800 bg-opacity-70 hover:bg-opacity-100 py-2 px-5 rounded-full hover:scale-105 flex justify-center items-center gap-2'
    return (
        <div className="mt-5 flex gap-2 justify-center items-center w-full flex-col sm:flex-row">
            { info.status=='none' && <button onClick={sendrequest}  className={btnStyle}><PersonAdd  /><p className="text-sm">Send Request</p></button>}
            { info.status=='incoming' 
                && <div className="flex flex-col gap-2 items-center justify-center">
                    <p>{info.fullname} wants to connect</p>
                    <div className="flex gap-2 sm:gap-5 max-w-[calc(80svw)] flex-col sm:flex-row ">
                        <button onClick={acceptrequest} className={btnStyle}><CheckCircle /><p className="text-sm">Accept Request</p></button>
                        <button onClick={declinerequest} className={btnStyle}><Delete /><p className="text-sm">Delete Request</p></button>
                    </div>    
                </div> }
            { info.status=='outgoing' && <button onClick={cancelrequest} className={btnStyle}><Cancel /><p className="text-sm">Cancel Request</p></button> } 
        </div> 
    )
}
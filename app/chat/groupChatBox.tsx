import { ArrowBack } from "@mui/icons-material";
import { useReducer, useState } from "react"


export default function GChatBOX({group_id, back}: {group_id: string, back: () => void}) {

    const reducer = (messages: GroupMessage[], action: {type: string, action: any}) => {

        return messages;
    }

    const [messages, dispatch] = useReducer(reducer, []);

    const [info, setInfo] = useState<GroupInfo | null>(null)

    function onBack(){
        const div = document.getElementById('connections') as HTMLDivElement
        div.style.marginLeft='0'
        back()
    }

    return(
        <div id="groupchatbox" className=" text-slate-200   overflow-y-auto w-[calc(100svw)] sm:w-[calc(66svw)] bg-slate-800 flex flex-col justify-start">
            <div className="h-16 shrink-0 flex gap-2 justify-start items-center px-4 drop-shadow-sm  bg-slate-800 ">
                <ArrowBack onClick={onBack} />
                <div className="rounded-full overflow-hidden">
                    {/* <ProfilePictureComponent key={user.username} size={40} user={user.username} hasPFP={user.pfp_uploaded} /> */}
                </div>
                <div className="text-lg">
                    <p>{info?.group_name}</p>
                </div> 
                <div className="grow"></div>
            </div>
            
        </div>
    )

}


type GroupInfo = {
    group_id: string,
    group_name: string,
    admin: string,
    members: string[],
}

type GroupMessage = {
    group_id: string,
    sender: string,
    ts: string,
    msg: string,
    readBy: string[]
}
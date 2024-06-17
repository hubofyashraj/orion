import { Message } from "./types";
import { Loop } from "@mui/icons-material";



export default function MessageComp({
    msg, user
}: {
    msg: Message, user: string
}) {

    return (
        <div className={(msg.sender==user?"rounded-l-sm":"self-end rounded-r-sm")+" max-w-[calc(90svw)] sm:max-w-[calc(60%)] rounded-xl bg-slate-700 text-slate-200  py-2 px-4 my-0.5 flex items-center gap-2 "}>
            <p>{msg.msg}</p>
            {msg.sending && <Loop className="animate-spin text-sm"/>}
        </div>
    )
}

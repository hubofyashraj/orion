import CIcon from "@coreui/icons-react";
import { Message } from "./types";
import { Loop } from "@mui/icons-material";



export default function MessageComp(props: any) {
    const msg: Message = props.msg;

    return (
        <div className={(msg.sender!=localStorage.getItem('user')?"rounded-l-sm":"self-end rounded-r-sm")+" max-w-[calc(90svw)] sm:max-w-[calc(60%)] rounded-xl bg-slate-700 text-slate-200  py-2 px-4 my-0.5 flex gap-2 "}>
            <p>{msg.msg}</p>
            {msg.sending && <Loop className="animate-spin"/>}
        </div>
    )
}

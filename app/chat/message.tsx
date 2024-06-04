import { Message } from "./types";



export default function MessageComp(props: any) {
    const msg: Message = props.msg;

    return (
        <div className={(msg.sender!=localStorage.getItem('user')?"rounded-l-sm":"self-end rounded-r-sm")+"  bg-slate-100 rounded-full py-2 px-4 my-1 "}>
            <p>{msg.msg}</p>
        </div>
    )
}

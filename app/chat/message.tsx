

export interface message {sender: string, receiver: string, msg: string, ts: string}

export default function MessageComp(props: any) {
    const msg: message = props.msg;

    return (
        <div key={props.key1} className={(msg.sender!=sessionStorage.getItem('user')?"rounded-l-sm":"self-end rounded-r-sm")+"  bg-slate-100 rounded-full py-2 px-4 my-1 "}>
            <p>{msg.msg}</p>
        </div>
    )
}

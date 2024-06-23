import usePing from "../state-store/pingStore";
export default function Ping() {
    const {ping} = usePing();


    return (
        <p className="absolute bottom-0 right-0 text-xs text-slate-50">{ping}</p>
    )
}
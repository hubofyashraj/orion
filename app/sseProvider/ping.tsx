import { useSelector } from "react-redux";
import { RootState } from "./store";

export default function Ping() {
    const ping = useSelector((state: RootState) => state.ping);
    


    return (
        <p className="absolute bottom-0 right-0 text-xs text-slate-50">{ping}</p>
    )
}
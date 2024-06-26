import { CircularProgress } from "@mui/material";

export default function CircularLoader() {
    return (
        <div className="w-full h-full flex flex-col gap-5 justify-center bg-slate-900 text-slate-200  items-center">
            <CircularProgress className=" h-20 w-20 " />
            <p className="animate-bounce text-xl ">Loading</p>
        </div>
    )
}
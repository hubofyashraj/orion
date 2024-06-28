import { CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <div className="w-full h-full flex flex-col gap-5 justify-center items-center bg-slate-900 text-slate-200">
            <CircularProgress className=" h-20 w-20 " />
            <p className="animate-bounce text-xl ">Loading</p>
        </div>
    )
}   
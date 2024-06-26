import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function FloatingActionButton() {
    const router = useRouter();

    return (
       <div className=" overflow-hidden z-10  bg-slate-900 hover:rotate-90 scale-90 hover:scale-100 transition-all text-slate-200 absolute bottom-5 right-5 sm:bottom-10  sm:right-10 rounded-full">
            <div onClick={()=>{router.push('/?tab=create')}} className= " btn rounded-full float-right m-2 shadow-lg w-12 h-12 flex justify-center items-center ">
                <Add fontSize="large" />
            </div>
       </div>

    )
}


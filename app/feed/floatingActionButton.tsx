import { Add } from "@mui/icons-material";

export default function FloatingActionButton(props: {setShowSelectComponent: Function}) {
    return (
       <div className=" overflow-hidden  bg-slate-900 hover:rotate-90 scale-90 hover:scale-100 transition-all text-slate-200 absolute bottom-10 right-10 rounded-full">
            <div onClick={()=>{props.setShowSelectComponent();}} className= " btn rounded-full float-right m-2 shadow-lg w-12 h-12 flex justify-center items-center ">
                <Add fontSize="large" />
            </div>
       </div>

    )
}


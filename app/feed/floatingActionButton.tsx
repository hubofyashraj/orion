import CIcon from "@coreui/icons-react";
import { Add } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function FloatingActionButton(props: {setShowSelectComponent: Function}) {
    const [hovering, setHover] = useState(false);
    const [img, setImg] = useState();

    function selectImg() {
        // const inpt: HTMLInputElement=document.getElementById('selected')
        // inpt.click()
        // if(inpt.value) {
        //     setImg(inpt.value)        
        // }
        
    }

    return (
       <div className=" overflow-hidden  bg-white absolute bottom-10 right-10 rounded-full">
            <div onClick={()=>{props.setShowSelectComponent()}} onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} className={(hovering?"":"") + " btn rounded-full float-right m-2 shadow-lg w-12 h-12 flex justify-center items-center "}>
                <Add fontSize="large" />
            </div>
            
            {/* <input type="file" id="selected" hidden /> */}
       </div>


    )
}


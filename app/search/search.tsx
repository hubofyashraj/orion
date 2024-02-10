import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import axios from "axios";
import { address } from "../api/api";

export default function Search() {

    function keyPressed(e: any) {

        if(e.key=='Enter') {
            axios.post(
                address+'/search',
                {searchTxt: e.target.value}
            ).then((result)=>{
                console.log(result);
                
            })
            
        }
    }


    return (
        <div className="flex flex-col justify-center items-start">
            <div className="w-full h-12 flex  justify-center items-center bg-inherit gap-2">
                <input className="bg-inherit  border-b-2 outline-none shadow-lg text-center" onKeyDown={keyPressed}  placeholder="Search"/>
                {/* <button><CIcon className="h-5 " icon={cilSearch }/></button> */}
            </div>
            <div></div>
        </div>
    );
}
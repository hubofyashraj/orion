"use client"
import { cilList, cilMenu, cilX } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { useState } from "react";

export default function Navbar(props: any) {
    const [isCollapsed, setCollapsed] = useState(true);
    function toggleCollapse() {
        setCollapsed(!isCollapsed);
    }

    function login() {

        if(!isCollapsed)    setCollapsed(true);
        if(props.loginState==false) {
            props.calllogin();
        }else {
            props.calllogout();
        }
    }

    
    return (
        <div id="navbar" className="fixed  top-0 px-2 py-1 w-full flex justify-between items-center">
            <p className="text-2xl">Orion</p>
            <div className="w-5 h-5 md:hidden">
                <button onClick={toggleCollapse} className="w-6"><CIcon className="text-white" icon={cilMenu} size="xxl" /></button>
            </div>
            <div className={(isCollapsed?"-right-32 ":"right-0 ")+"transition-all w-1/2 max-w-32 md:max-w-none md:w-auto self-start absolute  md:static px-5 py-2 bg-blue-700"}>
                <ul className=" flex flex-col md:flex-row gap-2 justify-start items-end ">
                    <li className="md:hidden"><button onClick={toggleCollapse} className="w-6 "><CIcon className="text-white w-6 " icon={cilX}  /></button></li>
                    {/* <li><a>Profile</a></li> */}
                    {props.loginState==true && <li><button onClick={()=>{props.router('feed')}} className="p-2">Home</button></li>}
                    {props.loginState==true && <li><button onClick={()=>{props.router('search')}} className="p-2">Search</button></li>}
                    {props.loginState==true && <li><button onClick={()=>{props.router('profile')}} className="p-2">Profile</button></li>}
                    <li><button onClick={()=>login()} className="p-2" >{props.loginState==false?'Login':'Logout'}</button></li>
                </ul>
            </div>
        </div>
    );
}
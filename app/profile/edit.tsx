import CIcon from "@coreui/icons-react"
import { cilAt, cilPencil, cilSave, cilX } from "@coreui/icons"

import { updateInfo } from "../api/profile/profile"
import { useState } from "react"


export default function Edit({
    info, close
}: {
    info: ProfileInfo , close: (refresh: boolean) => void 
}) {
    

    const [disabled, setDisabled] = useState(true);

    interface UpdatedInfo {
        [key: string]: string | boolean | Blob | null;
    }
    
    function update(formData: FormData) {
        var newInfo: UpdatedInfo={};
        formData.forEach((value, key)=>{
            const val = value.toString().trim()
            if(val!='' && val!=info[key]) newInfo[key]=val;
        })
        updateInfo(newInfo).then((success)=>goBack(success))
    }

    function goBack(refresh: boolean) {
        close(refresh);
    }

    const roundButton = "rounded-full text-slate-200 bg-slate-900 active:bg-slate-950 hover:shadow-md outline-none"

    return (
        <div className=" w-full py-12 h-full text-white flex justify-center  md:items-center overflow-y-scroll bg-slate-700">
            <div className="w-[calc(90svw)] max-w-[calc(40rem)] h-max shadow-lg px-5 sm:px-8 md:px-10 py-6 shrink transition-all bg-slate-800 rounded-lg ">

                <div className="flex gap-2 justify-between">
                    <div className="flex gap-1 bg-slate-900 px-4 rounded-full text-slate-300 font-bold">
                        <CIcon className="w-4 h-full"   icon={cilAt}/>
                        <p className="h-full flex items-center text-lg ">{info.username}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className={"h-8 w-8 p-2 "+roundButton} onClick={()=>setDisabled(!disabled)}>
                            <CIcon icon={cilPencil}/>
                        </button>
                        <button className={"h-8 w-8  p-2 "+roundButton} type="submit" form="updateform" >
                            <CIcon icon={cilSave}/>
                        </button>
                        <button className={"h-8 w-8  p-2 "+roundButton} onClick={()=>{close(false)}}>
                            <CIcon icon={cilX}/>
                        </button>
                    </div>
                </div>
                <form id="updateform" action={update} autoComplete="off">
                    <FormBody info={info} disabled={disabled}/>
                </form>
            </div>
        </div>
    )
}


function FormBody({
    info, disabled
}:{
    info: ProfileInfo, disabled: boolean
}) {



    return (
        <>
            <EditInput type="text" label="Full name" name="fullname" value={info.fullname} disabled={disabled}/>
            <EditInput type="date" label="DOB" name="dob" value={info.dob?info.dob.replace('/','-'):''} disabled={disabled}/>
            <EditInput type="text" label="Profession" name="profession" value={info.profession} disabled={disabled}/>
            <EditInput type="text" label="Location" name="location" value={info.location} disabled={disabled}/>
            <EditInput type="text" label="Bio" name="bio" value={info.bio} disabled={disabled}/>
            <EditInput type="" label="Gender" name="gender" value={info.gender} disabled={disabled}/>
            <EditInput type="email" label="Email" name="email" value={info.email} disabled={disabled}/>
            <EditInput type="tel" label="Contact" name="contact" value={info.contact} disabled={disabled}/>
        </>
    )
}

function EditInput(props: {type: string, label: string, name: string, value: string, disabled: boolean}) {
    return (
        <div className="py-2 shrink text-slate-300 flex gap-5 justify-between items-center">
            <label className="shrink-0 w-14 sm:w-16 md:w-20 text-xs sm:text-sm md:text-base" htmlFor={props.name}>{props.label}</label>
            <input name={props.name}  type={props.type} id={props.name} max={props.type=='date'?(new Date().toISOString().split("T")[0]):undefined} disabled={props.disabled} defaultValue={props.value} className="min-w-20 border-b shrink grow outline-none px-2 py-1 shadow-sm focus:shadow-md  text-xs sm:text-sm md:text-base bg-slate-800 disabled:text-slate-500 disabled:border-slate-700 " />
        </div>
    )
}
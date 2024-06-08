import axios from "axios"
import { address } from "../api/api"
import CIcon from "@coreui/icons-react"
import { cilAt, cilPen, cilPencil, cilSave, cilX } from "@coreui/icons"
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from "react"
import { setGlobal } from "next/dist/trace"

import { Bounce, ToastContainer, toast } from "react-toastify"
import 'react-toastify/ReactToastify.css'
interface Info {
    username: string, fullname: string, dob: string, profession: string, 
    location: string, bio: string, gender: string, 
    email: string, contact: string, contact_privacy: boolean
    profile_image: Blob | null,
    [key: string]: string | boolean | Blob | null
}

const dummyInfo: Info = {
    username: 'john_doe',
    fullname: 'John Doe',
    dob: '1990-01-01',
    profession: 'Software Engineer',
    location: 'City, Country',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    gender: 'Male',
    email: 'john@example.com',
    contact: '1234567890',
    contact_privacy: true,
    profile_image: null, // or Blob if you have the actual data
};


export default function Edit(props: { user: string , setPage: Function }) {
    

    const [disabled, setDisabled] = useState(true);
    const [info, setInfo] = useState(dummyInfo);

    const [fullname, setFullname] = useState('');
    const [dob, setDob] = useState('');
    const [profession, setProfession] = useState('');
    const [location, setLocation] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');



    useEffect(()=>{
        function fetchInfo() :Promise<Info>{
            return new Promise((resolve, reject)=>{
                axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

                axios.get(
                    address+'/profile/fetchinfo',
                ).then((result)=>{
                    // console.log(result.data);
                    
                    if(result.data.success) {
                        const info = result.data.info
                        console.log(info);
    
                        setInfo(result.data.info);
                        setFullname(info.fullname)
                        setDob(info.dob)
                        setProfession(info.profession)
                        setLocation(info.location)
                        setBio(info.bio)
                        setGender(info.gender)
                        setEmail(info.email)
                        setContact(info.contact)
                        // setProfilepic(info.profile_image)
                    }else {
                        
                    }
    
                    resolve(result.data.info)
                })
            })
        }
    
        fetchInfo().then((data)=>{
            console.log('info', data);
            
            setInfo(data as Info)
        })
    }, [props.user])

    var newInfo: Info = info;
    var updatedInfo: {[key: string]: string | boolean | Blob | null}={}

    function save() {
        updatedInfo.username = info.username;
        if(info.fullname!==fullname)    updatedInfo.fullname=fullname;
        if(info.dob!==dob)    updatedInfo.dob=dob;
        if(info.profession!==profession)    updatedInfo.profession=profession;
        if(info.location!==location)    updatedInfo.location=location;
        if(info.bio!==bio)    updatedInfo.bio=bio;
        if(info.gender!==gender)    updatedInfo.gender=gender;
        if(info.email!==email)    updatedInfo.email=email;
        if(info.contact!==contact)    updatedInfo.contact=contact;

        // console.log(updatedInfo);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
        axios.post(
            address+'/profile/saveinfo',
            {updatedInfo}
        ).then((result)=>{
            toast('Updated!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            })
        })
    }

    const roundButton = "rounded-full text-slate-200 bg-slate-900 active:bg-slate-950 hover:shadow-md outline-none"

    return (
        <div className=" w-full py-12 h-full text-white flex justify-center  md:items-center overflow-y-scroll bg-slate-700">
            <div className="w-[calc(90svw)] max-w-[calc(40rem)] h-max shadow-lg px-5 sm:px-8 md:px-10 py-6 shrink transition-all bg-slate-800 rounded-lg ">

                <div className="flex gap-2 justify-between">
                    <div className="flex gap-1 bg-slate-900 px-4 rounded-full text-slate-300 font-bold">
                        <CIcon className="w-4 h-full"   icon={cilAt}/>
                        <p className="h-full flex items-center text-lg ">{props.user}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className={"h-8 w-8 p-2 "+roundButton} onClick={()=>setDisabled(!disabled)}>
                            <CIcon icon={cilPencil}/>
                        </button>
                        <button className={"h-8 w-8  p-2 "+roundButton} onClick={save}>
                            <CIcon icon={cilSave}/>
                        </button>
                        <button className={"h-8 w-8  p-2 "+roundButton} onClick={()=>{props.setPage('profile')}}>
                            <CIcon icon={cilX}/>
                        </button>
                    </div>
                </div>
                <form >
                    <EditInput type="text" label="Full name" name="fullname" value={fullname} disabled={disabled} onChange={(e)=>{setFullname((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="date" label="DOB" name="dob" value={dob?dob.replace('/','-'):''} disabled={disabled} onChange={(e)=>{setDob((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="text" label="Profession" name="profession" value={profession} disabled={disabled} onChange={(e)=>{setProfession((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="text" label="Location" name="location" value={location} disabled={disabled} onChange={(e)=>{setLocation((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="text" label="Bio" name="bio" value={bio} disabled={disabled} onChange={(e)=>{setBio((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="" label="Gender" name="gender" value={gender} disabled={disabled} onChange={(e)=>{setGender((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="email" label="Email" name="email" value={email} disabled={disabled} onChange={(e)=>{setEmail((e.currentTarget as HTMLInputElement).value)}}/>
                    <EditInput type="tel" label="Contact" name="contact" value={contact} disabled={disabled} onChange={(e)=>{setContact((e.currentTarget as HTMLInputElement).value)}}/>
                </form>
            </div>
            <ToastContainer />
        </div>
    )
}


function EditInput(props: {type: string, label: string, name: string, value: string, disabled: boolean, onChange: ChangeEventHandler}) {
    return (
        <div className="py-2 shrink text-slate-300 flex gap-5 justify-between items-center">
            <label className="shrink-0 w-14 sm:w-16 md:w-20 text-xs sm:text-sm md:text-base" htmlFor={props.name}>{props.label}</label>
            <input type={props.type} className="min-w-20 border-b shrink grow outline-none px-2 py-1 shadow-sm focus:shadow-md  text-xs sm:text-sm md:text-base bg-slate-800 disabled:text-slate-500 disabled:border-slate-700" id={props.name} disabled={props.disabled} value={props.value} onChange={props.onChange}/>
        </div>
    )
}
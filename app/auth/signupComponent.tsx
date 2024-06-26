'use client'
import { ChangeEvent, SetStateAction, useRef, useState } from "react";
import { checkUserNameAvailability, signup } from "../api/auth/signup";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export default function SignupComponent(props: {setPage: () => void}) {

    const [ userNameAvailability, setAvailability ] = useState(false);
    const [ filled, setFilled ]= useState(false);
    const [ passwordsMatch, setIfMatch ] = useState(false);
    const [ visible, setVisible ] = useState(false);

    const form = useRef<HTMLFormElement | null>(null);

    let timeout: NodeJS.Timeout | null = null;



    function onChangeHandlerInput(event: ChangeEvent<HTMLInputElement>) {
        setFilled(false)
        if(!form.current) return;
        const ele = document.getElementById('warning')!

        const formData = new FormData(form.current);
        const username = formData.get('username')?.toString() 
        const fullname = formData.get('name')?.toString() 
        const password = formData.get('password')?.toString() 
        const cnfpassword = formData.get('cnfpassword')?.toString()
        setTimeout(()=>{
            if(event.target.name=='password' || event.target.name=='cnfpassword'){
                if(password==cnfpassword) {
                    setIfMatch(true);
                    ele.innerText=''
                }
                else {
                    if(password!='' && cnfpassword!=''){
                        setIfMatch(false);
                        ele.innerText = 'Passwords do not match!'
                    }
                    else ele.innerText=''
                }
            }

            setFilled( username!='' &&  fullname!='' &&  password!='' &&  cnfpassword!='')
        }, 500)
    }


    function userNameOnChangedHandler(event: ChangeEvent<HTMLInputElement>) {
        if(timeout) clearTimeout(timeout);
        timeout=setTimeout(async ()=>{
            var uInput = event.target
            if(!uInput.value) return

            const ele = document.getElementById('warning')!
            const available = await checkUserNameAvailability(uInput.value)
            
            if(available) ele.innerHTML = ''
            else ele.innerHTML = 'Username not available'
            setAvailability(available)
        }, 1000)

        onChangeHandlerInput(event)
    }

    async function action(formData: FormData) {
        const result =  await signup(formData);
        if(result) props.setPage()
    }

    const common = 'outline-none bg-slate-900 bg-opacity-50 rounded-lg  hover:bg-opacity-70 px-3 py-2 text-center border-b border-slate-600'
    const btn1 = 'outline-none bg-slate-800  rounded-lg   px-3 py-2 text-center border border-slate-900 hover:border-slate-800 dropshadow'
    const btn=' cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed'
    

    return (
        <>
            <form ref={form} action={action} autoComplete="off" autoSave="off" id="inputform" className={' overflow-hidden flex flex-col gap-2'}>
                <input className={common}  onChange={userNameOnChangedHandler} name='username' type='text' placeholder='username' />
                <input className={common}  onChange={onChangeHandlerInput} name='name' type='text' placeholder='full name'/>
                <div className={"flex items-center relative     "+common}>
                    <input className={' bg-transparent autofill:bg-transparent outline-none text-center '}  onChange={onChangeHandlerInput} name='password'  type={visible?'text':'password'} placeholder='password'/>
                    <span onClick={()=>setVisible(!visible)} className=" absolute right-2 text-slate-500">{visible?<VisibilityOutlined />:<VisibilityOffOutlined />}</span>
                </div>
                <input className={common}  onChange={onChangeHandlerInput} name='cnfpassword' type='password' placeholder='confirm password'/>
                <button id="submitbtn" className={ btn1 + btn } disabled={!(userNameAvailability && filled && passwordsMatch )}>{'Signup'}</button>
            </form>
        </>
    )
}



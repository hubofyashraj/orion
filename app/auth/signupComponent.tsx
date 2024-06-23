'use client'
import { ChangeEvent, FormEvent, SetStateAction, useEffect, useState } from "react";
import { checkUserNameAvailability, signup } from "../api/auth/signup";
import { useFormStatus } from "react-dom";

export default function SignupComponent(props: {setPage: React.Dispatch<SetStateAction<number>>}) {

    return (
        <>
            <form action={signup} autoComplete="off" id="inputform" className={' overflow-hidden flex flex-col gap-2'}>
                <FormBody />
            </form>
        </>
    )
}



function FormBody() {

    const [ userNameAvailability, setAvailability ] = useState(false);
    const [ filled, setFilled ]= useState(false);
    const [ passwordsMatch, setIfMatch ] = useState(false);

    const { pending, data, action, method } = useFormStatus();

    let timeout: NodeJS.Timeout | null = null;

    function onChangeHandlerInput(event: ChangeEvent<HTMLInputElement>) {
        setFilled(false)
        const form = event.target.parentElement as HTMLFormElement
        const formData = new FormData(form);
        setTimeout(()=>{
            if(event.target.name=='password' || event.target.name=='cnfpassword')
                setIfMatch(formData.get('password')==formData.get('cnfpassword'))

            setFilled( 
                    formData.get('username')?.toString()!='' 
                &&  formData.get('name')?.toString()!='' 
                &&  formData.get('password')?.toString()!='' 
                &&  formData.get('cnfpassword')?.toString()!=''
            )
        }, 1000)
    }
    
    useEffect(()=>{
        if(data) {
            const form = document.getElementById('inputform') as HTMLFormElement;
            form.reset();
            setFilled(false);
            setAvailability(false)
            setIfMatch(false)
        }        
    }, [data])

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

    const common = 'outline-none bg-slate-900 bg-opacity-50 rounded-lg  hover:bg-opacity-70 px-3 py-2 text-center border-b border-slate-600'
    const btn=' cursor-pointer disabled:opacity-50 disabled:hover:bg-opacity-50 disabled:cursor-not-allowed'
    return (
        <>
            <input className={common}  onChange={userNameOnChangedHandler} name='username' type='text' placeholder='username' />
            <input className={common}  onChange={onChangeHandlerInput} name='name' type='text' placeholder='full name'/>
            <input className={common}  onChange={onChangeHandlerInput} name='password' type='password' placeholder='password'/>
            <input className={common}  onChange={onChangeHandlerInput} name='cnfpassword' type='password' placeholder='confirm password'/>
            <button id="submitbtn" className={ common + btn } disabled={!(userNameAvailability && filled && passwordsMatch )}>{pending?'Wait':'Signup'}</button>
        </>
    )
}
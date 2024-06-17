'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { login } from "../api/actions/authentication";
import { useAuth } from "./ds";
import { sockInit } from "../handleSocket";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { useFormStatus } from "react-dom";

export default function LoginComponent() {
    function submit(formData: FormData) {
        const ele = document.getElementById('warning')

        login(formData).then((result) =>{
            if(result) {
                ele!.innerHTML = ''
                sockInit()
                // window.location.href='/'
            }else {

                if(result==false ) ele!.innerHTML = 'Wrong Credentials';        
            }
        }).catch((reason: string)=>{
            console.log(reason);
        });
        
    }

    
    return (
        <form action={submit} autoComplete="off" className={'overflow-hidden flex flex-col gap-2'}>
            <FormBody />
        </form>
    )
}

function FormBody() {
    const { pending } = useFormStatus();

    const [filled, setFilled] = useState(false);

    function onChangeHandler(event: ChangeEvent<HTMLInputElement>) {
        const form = event.target.parentElement as HTMLFormElement;
        const formData = new FormData(form);
        
        setFilled(formData.get('username')?.toString()!='' && formData.get('password')?.toString()!='')

    }

    const common = 'outline-none bg-slate-900 bg-opacity-50 rounded-lg  hover:bg-opacity-70 px-3 py-2 text-center border-b border-slate-600'
    const btn=' cursor-pointer disabled:opacity-50 disabled:hover:bg-opacity-50 disabled:cursor-not-allowed'
    return (
        <>
            <input onChange={onChangeHandler} className={common} name='username' type='text' autoComplete="off" placeholder='username' />
            <input onChange={onChangeHandler} className={common} name='password' type='password' placeholder='password'/>
            <input className={ common+ btn} disabled={!filled} type='submit' value={pending?'Logging In':'Login'}/>
        </>
    )
}
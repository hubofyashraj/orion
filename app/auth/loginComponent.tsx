import { ChangeEvent, FormEvent } from "react";
import { login } from "../api/events/login";
import { useAuth } from "./ds";
import { sockInit } from "../handleSocket";

export default function LoginComponent() {

    const { isLoggedIn, setIsLoggedIn} = useAuth();


    function submit(event: FormEvent) {

        const ele = document.getElementById('warning')

        event.preventDefault();
        const form:HTMLFormElement = event['target'] as HTMLFormElement;
        const entries = (new FormData(form)).entries();
        const username = entries.next().value[1] as string;
        const password = entries.next().value[1] as string;

        if(username=='' || password=='') {
            ele!.innerHTML = 'Please fill all the details'
            return;
        }

        ele!.innerHTML = ''

        var data = {
            username: username.trim(),
            password: password.trim(),
        }

        login(data).then((result:boolean) =>{
            ele!.innerHTML = ''
            setIsLoggedIn(true)
            sockInit()
            // setLoggedIn(true)
        }).catch((reason: string)=>{
            ele!.innerHTML = reason;        
        });
        
    }

    
    return (
        <>
            <form onSubmit={submit} autoComplete="off" className={'overflow-hidden flex flex-col gap-2'}>
                <input className='outline-none bg-slate-300 bg-opacity-50 rounded-lg hover:bg-opacity-70 px-3 py-2 text-center border-b-2' name='username' type='text' autoComplete="off" placeholder='username' />
                <input className='outline-none bg-slate-300 bg-opacity-50 rounded-lg hover:bg-opacity-70 px-3 py-2 text-center border-b-2' name='password' type='password' placeholder='password'/>
                {<input className='bg-slate-300 bg-opacity-50 hover:bg-opacity-80 rounded-md p-1 text-slate-700 cursor-pointer'  type='submit' value={'Login'}/>}
            </form>
        </>
    )
}


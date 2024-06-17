'use client'

import { useState } from "react";
import LoginComponent from "./loginComponent";
import SignupComponent from "./signupComponent";

export function Form() {
    const [page, setPage] = useState(0);

    return (
        <>
            <div  className='flex w-full bg-slate-700 text-center cursor-pointer rounded-t-lg '>
                <div onClick={()=>setPage(0)} className={(page==0?' grow  ':' rounded-br-lg w-1/3 ')+ ' shrink-0 bg-slate-900  rounded-tl-lg select-none transition-all  '}>
                    <p  className={(page==0?' bg-slate-700  rounded-t-lg ':' rounded-bl-lg ')+ ' py-1 select-none transition-all  text-slate-200 '}>Login</p>
                </div>
                <div onClick={()=>setPage(1)} className={(page==1?' grow ':' rounded-bl-lg w-1/3')+ ' shrink-0 bg-slate-900 rounded-tr-lg select-none transition-all'}>
                    <p  className={(page==1?' bg-slate-700 rounded-t-lg ':' rounded-br-lg ')+ ' py-1  select-none transition-all text-slate-200'}>Signup</p>
                </div>
            </div>
            <div id='component' className='bg-slate-700 w-full h-72 py-2 flex justify-center items-center  rounded-b-lg'>
                {/* {
                    <form action={}>
                        {
                            page==0 ? <LoginComponent /> : <SignupComponent />
                        }
                    </form>
                } */}
                {   page==0? <LoginComponent /> : <SignupComponent setPage={()=>setPage(0)} />} 
            </div>
        </>
    )
}

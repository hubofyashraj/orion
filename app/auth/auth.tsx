import CIcon from '@coreui/icons-react';
import './login.css'
import { cilCircle, cilX } from '@coreui/icons';
import { useEffect, useState } from 'react';
import LoginComponent from './loginComponent';
import SignupComponent from './signupComponent';



export default function Auth() {
    
    const [page, setPage] = useState(0);
    let interval = null

    useEffect(()=>{
        console.log('auth');
        
    }, [])

    return (
        <div id='outer' className={'w-full bg-slate-900 text-slate-200  h-full select-none flex justify-center items-center p-5 '}>
            <div id='inner' className={' h-full max-h-[calc(30rem)] bg-slate-800 w-full max-w-96 rounded-lg  p-5 flex flex-col  justify-start items-center'}>
                <CIcon className='h-24 ' icon={cilCircle}  />
                <p id='orion'  className=' text-xl '>ORION</p>

                <p id='warning' className='text-red-400 h-6 my-2'></p>
                
                <div  className='flex w-full bg-slate-700 text-center cursor-pointer rounded-t-lg '>
                    <div onClick={()=>setPage(0)} className={(page==0?' grow  ':' rounded-br-lg w-1/3 ')+ ' shrink-0 bg-slate-900  rounded-tl-lg select-none transition-all  '}>
                        <p  className={(page==0?' bg-slate-700  rounded-t-lg ':' rounded-bl-lg ')+ ' py-1 select-none transition-all  text-slate-200 '}>Login</p>
                    </div>
                    <div onClick={()=>setPage(1)} className={(page==1?' grow ':' rounded-bl-lg w-1/3')+ ' shrink-0 bg-slate-900 rounded-tr-lg select-none transition-all'}>
                        <p  className={(page==1?' bg-slate-700 rounded-t-lg ':' rounded-br-lg ')+ ' py-1  select-none transition-all text-slate-200'}>Signup</p>
                    </div>
                </div>
                <div id='component' className='bg-slate-700 w-full h-72 py-2 flex justify-center items-center  rounded-b-lg'>
                    {   page==0? <LoginComponent /> : <SignupComponent setPage={()=>setPage(0)} />} 
                </div>
                                
            </div>
        </div>
    );
}

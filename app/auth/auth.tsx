import CIcon from '@coreui/icons-react';
import './login.css'
import { cilCircle, cilX } from '@coreui/icons';
import { useState } from 'react';
import LoginComponent from './loginComponent';
import SignupComponent from './signupComponent';



export default function Auth() {
    
    const [page, setPage] = useState(0);

    return (
        <div id='outer' className={'w-full h-full select-none flex justify-center items-center p-5'}>
            <div id='inner' className={' h-full max-h-[calc(30rem)] bg-slate-300 w-full max-w-96 rounded-lg  p-5 flex flex-col  justify-start items-center'}>
                <CIcon className='h-24' icon={cilCircle}  />
                <p id='warning' className='text-red-400 h-6 my-2'></p>
                
                <div  className='flex w-full bg-slate-200 text-center cursor-pointer rounded-t-lg '>
                    <div onClick={()=>setPage(0)} className={(page==0?' grow  ':' rounded-br-lg w-1/3 ')+ ' shrink-0 bg-slate-300   select-none transition-all  '}>
                        <p  className={(page==0?' bg-slate-200  rounded-t-lg ':' rounded-bl-lg ')+ '  select-none transition-all  text-slate-700 '}>Login</p>
                    </div>
                    <div onClick={()=>setPage(1)} className={(page==1?' grow ':' rounded-bl-lg w-1/3')+ ' shrink-0 bg-slate-300 select-none transition-all'}>
                        <p  className={(page==1?' bg-slate-200 rounded-t-lg ':' rounded-br-lg ')+ '  select-none transition-all text-slate-700'}>Signup</p>
                    </div>
                </div>
                <div id='component' className='bg-slate-200 w-full h-72 py-2 flex justify-center items-center  rounded-b-lg'>
                    {   page==0? <LoginComponent /> : <SignupComponent setPage={()=>setPage(0)} />} 
                </div>
                                
            </div>
        </div>
    );
}

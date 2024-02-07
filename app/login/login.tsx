import CIcon from '@coreui/icons-react';
import './login.css'
import { cilCircle, cilX } from '@coreui/icons';
import { ChangeEvent, FormEvent, useState } from 'react';
import { checkUserNameAvailability } from '../api/events/signup';

export default function Login(props: {close: Function, loginHandler: Function}) {
    const [loginPage, setPage] = useState(true); 
    const [warning, setWarning] = useState('');



    function submit(event: FormEvent) {
        event.preventDefault();
        const form:HTMLFormElement = event['target'] as HTMLFormElement;
        const entries = (new FormData(form)).entries();
        const username = entries.next().value[1] as string;
        var fullname;
        if(!loginPage) {
            fullname = entries.next().value[1] as string;
        }
        const password = entries.next().value[1] as string;

        if(username=='' || password=='') {
            setWarning('Please fill all the details')
            return;
        }


        var data = {
            username: username.trim(),
            password: password.trim(),
            fullname: fullname?.trim()
        }

        if(loginPage) {
            console.log(data);
            setWarning('')
            props.loginHandler('login',data, setWarning, setPage)
        }
        else {
            const cnfpassword = entries.next().value[1] as string;
            if(cnfpassword=='' || fullname=='') {
                setWarning('Please fill all the details');
                return;
            }
            if(password!=cnfpassword) {
                setWarning('passwords do not match')
                return;
            }
            setWarning('')
            props.loginHandler('signup', data, setWarning, setPage)
        }

        
    }

    function onChangeHandler(event: ChangeEvent) {
        if(!loginPage) {
            if(event.target!=null) {
                var uInput: HTMLInputElement = event.target as HTMLInputElement;
                checkUserNameAvailability(uInput.value).then((available: boolean)=>{
                    // console.log(available);
                
                    if(available==false) {
                        setWarning('Username not available');
                        // console.log(warning);
                        
                    } else {
                        setWarning('');
                        // console.log(warning);
                    }
                });
                
            }
        }
    }

    return (
        <div id='outer' className='flex justify-center items-center'>
            <div id='inner' className=' bg-white bg-opacity-10 py-6 px-4 flex flex-col gap-2 justify-start items-center rounded-md'>
                <div className='w-full flex justify-end'>
                    <button onClick={()=>props.close()} className='shrink-0 w-5'>
                        <CIcon icon={cilX} />
                    </button>
                </div>
                <CIcon className='h-24' icon={cilCircle}  />
                <p className='text-red-400'>{warning}</p>
                <form onSubmit={submit} className={'transition-all overflow-hidden flex flex-col gap-2'}>
                    <input className='outline-none bg-transparent px-3 py-2 text-center border-b-2' onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeHandler(event)} name='username' type='text' placeholder='username' />
                    {!loginPage && <input className='outline-none bg-transparent px-3 py-2 text-center border-b-2' name='name' type='text' placeholder='full name'/>}
                    <input className='outline-none bg-transparent px-3 py-2 text-center border-b-2' name='password' type='password' placeholder='password'/>
                    {!loginPage && <input className='outline-none bg-transparent px-3 py-2 text-center  border-b-2' name='cnfpassword' type='password' placeholder='confirm password'/>}
                    {!loginPage && <input className='bg-white bg-opacity-10 rounded-md p-1' type='submit' value={'Signup'} />}
                    {!loginPage && <input className='bg-white bg-opacity-10 rounded-md p-1' onClick={()=>{setPage(true)}} type='button' value={'Login'}/>}
                    {loginPage && <input className='bg-white bg-opacity-10 rounded-md p-1'  type='submit' value={'Login'}/>}
                    {loginPage && <input className='bg-white bg-opacity-10 rounded-md p-1' onClick={()=>setPage(false)} type='button' value={'Signup'} />}
                </form>
                                
            </div>
        </div>
    );
}
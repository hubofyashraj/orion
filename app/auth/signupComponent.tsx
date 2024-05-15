import { ChangeEvent, FormEvent, SetStateAction } from "react";
import { checkUserNameAvailability, signup } from "../api/events/signup";

export default function SignupComponent(props: {setPage: React.Dispatch<SetStateAction<number>>}) {



    let timer: ReturnType<typeof setTimeout>

    function onChangeHandler(event: ChangeEvent) {
        const ele = document.getElementById('warning')

        if(event.target!=null) {
            
            var uInput: HTMLInputElement = event.target as HTMLInputElement;
            clearTimeout(timer)
            timer = setTimeout(()=>{
                // console.log(new Date());
                
                checkUserNameAvailability(uInput.value).then((available: boolean)=>{
                    // console.log(available);
                
                    if(available==false) {
                        ele!.innerHTML = 'Username not available'
                        // console.log(warning);
                        
                    } else {
                        ele!.innerHTML = ''

                        // console.log(warning);
                    }
                });
            }, 1000)
        }
    }


    function submit(event: FormEvent) {
        event.preventDefault();
        const form:HTMLFormElement = event['target'] as HTMLFormElement;
        const entries = (new FormData(form)).entries();
        
        const username = entries.next().value[1] as string;
        const fullname = entries.next().value[1] as string;
        const password = entries.next().value[1] as string;
        const cnfpassword = entries.next().value[1] as string;
        
        
        const ele = document.getElementById('warning')

        if(username=='' || password=='' || cnfpassword=='' || fullname=='') {
            ele!.innerHTML = 'Please fill all the details'
            return;
        }

        if(password!=cnfpassword) {
            ele!.innerHTML = 'passwords do not match'
            return;
        }

        ele!.innerHTML = ''

        var data = {
            username: username.trim(),
            password: password.trim(),
            fullname: fullname.trim()
        }
        console.log(data);
        
        signup(data).then((result)=>{
            ele!.innerHTML = '';
            props.setPage(0)
        }).catch((result)=>{
            console.log(result);
            
            // ele!.innerHTML = result.data.reason;
        })
        
    }

    
    return (
        <>
            <form onSubmit={submit} className={' overflow-hidden flex flex-col gap-2'}>
                <input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2' onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeHandler(event)} name='username' type='text' placeholder='username' />
                {<input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2' name='name' type='text' placeholder='full name'/>}
                <input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2' name='password' type='password' placeholder='password'/>
                {<input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center  border-b-2' name='cnfpassword' type='password' placeholder='confirm password'/>}
                {<input className='bg-slate-300 bg-opacity-50 hover:bg-opacity-80 rounded-md p-1 text-slate-700 cursor-pointer' type='submit' value={'Signup'} />}
            </form>
        </>
    )
}
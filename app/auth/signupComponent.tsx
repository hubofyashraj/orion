import { ChangeEvent, FormEvent, SetStateAction, useEffect, useState } from "react";
import { checkUserNameAvailability, signup } from "../api/events/signup";

export default function SignupComponent(props: {setPage: React.Dispatch<SetStateAction<number>>}) {

    const [available, setAvailable] = useState(false);
    const [filled, setFilled] = useState(false);

    type Formdata = {
        username: string,
        fullname: string,
        password: string,
        cnfpassword: string
    }

    const [formdata, setFormdata] = useState({
        username: '',
        password: '',
        cnfpassword: '',
        fullname: ''
    } as Formdata)


    useEffect(()=>{
        
        const btn = document.getElementById('submitbtn')! as HTMLButtonElement;

        const res = Object.values(formdata).some(value=>value.trim()==='');
        
        setFilled(!res)
        btn.disabled = res && available
        

        console.log(formdata);

        const ele = document.getElementById('warning')!

        if(res) {
            if(ele.innerHTML=='')
                ele.innerHTML = 'Please fill all the fields'
            return;
        }

        if(formdata.password!=formdata.cnfpassword) {
            ele.innerHTML = 'passwords do not match'
            btn.disabled=true
        }else {
            ele.innerHTML = ''
        }

        
        
    }, [available, formdata])

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const ele = document.getElementById('warning')!
        ele.innerHTML = ''
        const data = {
            username: formdata.username.trim(),
            password: formdata.password.trim(),
            fullname: formdata.fullname.trim()
        }
        
        console.log(data);
        
        signup(data).then((result)=>{
            ele.innerHTML = '';
            props.setPage(0)
        }).catch((result)=>{
            // console.log(result);
            ele.innerHTML = result.data.reason;
        })
        
    }



    

    let timer: ReturnType<typeof setTimeout>


  

    function onChangeHandlerInput(event: ChangeEvent<HTMLInputElement>): void {
        
        clearTimeout(timer)
            timer = setTimeout(()=>{
            const form = document.getElementById('inputform')! as HTMLFormElement;
            const formData = new FormData(form);
            const entries = Array.from(formData.entries());

            const newFormData: Formdata = {
                username: entries[0][1].toString(),
                fullname: entries[1][1].toString(),
                password: entries[2][1].toString(),
                cnfpassword: entries[3][1].toString()
            }

            const ele = document.getElementById('warning')!
            if(event.target.name==='username') {
                var uInput = event.target
                
                if(uInput.value=='') return;

                checkUserNameAvailability(uInput.value).then((available: boolean)=>{
                    if(!available) {
                        ele.innerHTML = 'Username not available'
                        setAvailable(false)
                    }
                    else {
                        ele.innerHTML = ''
                        setAvailable(true)
                    }
                }).catch((err)=>{
                    ele.innerHTML = 'API err'
                    setAvailable(false)
                })
            
            }

            setFormdata(newFormData);
            
        }, 1000)
    }


    return (
        <>
            <form onSubmit={submit} autoComplete="off" id="inputform" className={' overflow-hidden flex flex-col gap-2'}>
                <input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2' onChange={onChangeHandlerInput} name='username' type='text' placeholder='username' />
                {<input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2'  onChange={onChangeHandlerInput} name='name' type='text' placeholder='full name'/>}
                <input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center border-b-2'  onChange={onChangeHandlerInput} name='password' type='password' placeholder='password'/>
                {<input className='outline-none bg-slate-300 bg-opacity-50 hover:bg-opacity-70 px-3 py-2 text-center  border-b-2'  onChange={onChangeHandlerInput} name='cnfpassword' type='password' placeholder='confirm password'/>}
                {<button id="submitbtn" className='bg-slate-300 bg-opacity-50 hover:bg-opacity-80 rounded-md p-1 text-slate-700 cursor-pointer disabled:opacity-50 disabled:hover:bg-opacity-50 disabled:cursor-not-allowed' type='submit' disabled>Signup</button>}
            </form>
        </>
    )
}


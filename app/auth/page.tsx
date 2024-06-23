import './login.css';
import { Form } from './form';
import { redirect } from 'next/navigation';
import { validSession } from '../api/auth/authentication';
import Image from 'next/image';

export default async function Auth() {
    const {status} = await validSession();

    if (status==200) {
        redirect('/');
    }

    return (
        <div id="outer" className="w-full bg-slate-900 text-slate-200 h-full select-none flex justify-center items-center p-5">
            <div id="inner" className="h-full max-h-[calc(30rem)] bg-slate-800 w-full max-w-96 rounded-lg p-5 flex flex-col justify-start items-center">
                <Image priority alt='logo' width={200} height={0} src={'/icons/yasmc@3x.png'} />
                <p id="warning" className="text-red-400 h-6 my-2"></p>
                <Form />
            </div>
        </div>
    );
}

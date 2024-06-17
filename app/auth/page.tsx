import './login.css';
import { Form } from './form';
import { CircleOutlined } from '@mui/icons-material';
import { getToken } from '../api/actions/cookie_store';
import { redirect } from 'next/navigation';

export default async function Auth() {
    const token = await getToken();

    if (token) {
        redirect('/');
        return null; 
    }

    return (
        <div id="outer" className="w-full bg-slate-900 text-slate-200 h-full select-none flex justify-center items-center p-5">
            <div id="inner" className="h-full max-h-[calc(30rem)] bg-slate-800 w-full max-w-96 rounded-lg p-5 flex flex-col justify-start items-center">
                <CircleOutlined style={{ height: '6rem', width: '6rem' }} />
                <p id="orion" className="text-xl">ORION</p>
                <p id="warning" className="text-red-400 h-6 my-2"></p>
                <Form />
            </div>
        </div>
    );
}

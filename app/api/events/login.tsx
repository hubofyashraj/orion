import axios from "axios";
import { address } from "../api";

export function login(data: {username:string, password: string, fullname: string | undefined}): Promise<any> {
    return new Promise((resolve, reject)=>{
        axios.post(
            address + '/login',
            data
        ).then((result) => {
            if (result.data.verified == true) {
                localStorage.setItem('token', result.data.token);
                sessionStorage.setItem('user', data.username);
                console.log('login success: ', result);
                
                resolve(true);
            } else {
                reject('wrong credentials');
            }
        }).catch((result) => {
            console.log('err', result);
            reject('Server error');
        });
    })
}

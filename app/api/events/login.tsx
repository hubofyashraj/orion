import axios from "axios";
import { address } from "../api";

export function login(data: {username:string, password: string}): Promise<any> {
    return new Promise((resolve, reject)=>{
        axios.defaults.auth = { username: data.username , password: data.password};
        axios.post(
            address + '/login',
        ).then((result) => {
            axios.defaults.auth=undefined
            if (result.data.verified == true) {
                localStorage.setItem('token', result.data.token);
                localStorage.setItem('user', data.username);
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

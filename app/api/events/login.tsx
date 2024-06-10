'use server'
import axios from "axios";
import { address } from "../api";
import { cookies } from "next/headers";

async function saveToken(token: string) {
    cookies().set('authorization', token, {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 60 * 60 * 1000),
    });
}

export async function login(data: {username:string, password: string}): Promise<any> {
    return new Promise((resolve, reject)=>{
        axios.defaults.auth = { username: data.username , password: data.password};
        axios.post(
            address + '/login',
        ).then((result) => {
            axios.defaults.auth=undefined
            if (result.data.verified == true) {
                saveToken(result.data.token)
                
                console.log('login success: ', result);
                resolve(result.data.token);
            } else {
                reject('wrong credentials');
            }
        }).catch((result) => {
            console.log('err', result);
            reject('Server error');
        });
    })
}


export async function getToken() {
    const token  = cookies().get('authorization')?.value
    if(token) return token;
        
    throw Error('NoTokenErr', {cause: 'Token Not Present'})
}
import axios from "axios";
import { address } from "../api";

export function signup(data: {username: string, password: string, fullname: string | undefined}) :Promise<object>{
    return new Promise((resolve, reject)=>{
        axios.post(
            address+'/signup',
            data
        ).then((result)=>{
            resolve(result.data);            
        }).catch((result)=>{
            console.log('err', result);
            reject(result.data);
        })
    })
}

export function checkUserNameAvailability(username: string) :Promise<boolean> {
    return new Promise((resolve, reject)=>{
        axios.get(
            address+'/checkusernameavailability',
            {params:{username}}
        ).then((result: any)=>{
            // console.log(result.data);
            resolve(result.data.result);
        }).catch((result: any)=>{
            // console.log(result);
            console.log( 'err');
                    
            reject(false);
        })
    })
    
    
}
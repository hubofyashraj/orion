'use server';
import axios from "axios";
import { address } from "../api";

async function validate(formData: FormData) {
    if(
        formData.get('username')?.toString()=='' 
    ||  formData.get('name')?.toString()=='' 
    ||  formData.get('password')?.toString()=='' 
    ||  formData.get('cnfpassword')?.toString()==''
    )
        return false;
    if(formData.get('password')?.toString()!=formData.get('cnfpassword')?.toString()) return false;
    if(await checkUserNameAvailability(formData.get('username')!.toString())) return true;
    return false;
}

export async function signup(formData: FormData) {
    const validated = await validate(formData);
    if(!validated) throw 'Data not validated'

    const data = {
        username: formData.get('username'), 
        fullname: formData.get('name'), 
        password: formData.get('password')
    }
    
    try {
        const result : { data: {success: boolean} } = await axios.post( address+'/signup', data )
        return result.data.success;

    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function checkUserNameAvailability(username: string) {
    try {
        const result = await axios.get( address+'/checkusernameavailability', {params:{username}} )
        return result.data.available
    } catch (error) {
        console.log(error);
        return false;
    }
    
}
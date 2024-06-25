'use server';
import { userExists, userSignup } from "../db_queries/auth";

async function validate(formData: FormData) {
    if(
        formData.get('username')?.toString()=='' 
    ||  formData.get('name')?.toString()=='' 
    ||  formData.get('password')?.toString()=='' 
    ||  formData.get('cnfpassword')?.toString()==''
    )
        return false;
    if(formData.get('password')?.toString()!=formData.get('cnfpassword')?.toString()) return false;
    if(await checkUserNameAvailability(formData.get('username')!.toString().toLowerCase())) return true;
    return false;
}

export async function signup(formData: FormData) {
    const validated = await validate(formData);
    if(!validated) throw 'Data not validated'

    const data = {
        username: formData.get('username')!.toString().toLowerCase(), 
        fullname: formData.get('name')!.toString(), 
        password: formData.get('password')!.toString()
    }
    
    try {
        const result = await userSignup(data);
        return result;

    } catch (error) {
        console.log(error);
        throw error
    }
}

export async function checkUserNameAvailability(username: string) {
    const exists = await userExists(username.toLowerCase());
    return !exists;
}
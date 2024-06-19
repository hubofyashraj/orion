'use server'
import { addSession, checkCredentials, endSession } from "@/app/api/db_queries/auth";
import { deleteToken, insertToken, getToken } from "./cookie_store";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
    const username = formData.get('username')?.toString();
    const password = formData.get('password')?.toString();
    
    if (username && password) {
        const result = await checkCredentials({ username, password });
        if (result) {
            const token = sign({ username: username }, 'MY_JWT_SECRET', { expiresIn: '1h' });
            await insertToken(token);
            // Optionally, you can log this session in your database
            // await addSession({ user: username, token: token });
            redirect('/');
            return true;
        }
    }
    return false;
}

export async function logout(username?: string) {
    await deleteToken();
    redirect('/auth');
}

/**
 * 
 * @returns username, if a valid cookie is present containing valid token else status 401
 */

export async function validSession() {
    const token = await getToken();
    if(token) {
        try {
            const payload = verify(token, 'MY_JWT_SECRET') as {username: string} & JwtPayload;
            return {status: 200, user: payload.username};
        }
        catch (error) { console.log('Error while verifying token\n', error) } 
    } 
    return {status: 401};
}
'use server'
import { cookies } from "next/headers";

export async function insertToken(token: string) {
    const cookieStore = cookies();
    cookieStore.set('authorization', token, {
        httpOnly: true,
        sameSite: false,
        expires: new Date(Date.now() + 60 * 60 * 1000),
    });
}

export async function deleteToken() {
    const cookieStore = cookies();
    // Setting the cookie to expire immediately to delete it
    cookieStore.set('authorization', '', { expires: new Date(0), httpOnly: true });
}

export async function getToken() {
    const cookieStore = cookies();
    const token = cookieStore.get('authorization')?.value;
    return token;    
}

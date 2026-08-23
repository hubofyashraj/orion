'use server';
import { compareSync } from 'bcrypt';
import { genSaltSync, hashSync } from 'bcrypt';
import { authRepository } from '../repositories/auth.repository';


export async function checkCredentials(username: string, password: string) {
    const result = await authRepository.getUser({ username }, { _id: 0, password: 1, username: 1 });
    const passwordhash = result?.password;
    if (result && passwordhash && compareSync(password, passwordhash)) return true;
    else return false;
}



export async function userExists(username: string) {
    try {
        const result = await authRepository.getUser({ username });
        return !!result;
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function userSignup(data: UserType) {
    var salt = genSaltSync(10);
    data.password = hashSync(data.password, salt);
    await authRepository.register(data);
    return true;
}


export async function addSession(user: string) {
    await authRepository.createSession(user);
}


export async function endSession(user: string) {
    await authRepository.deleteSession(user);
}
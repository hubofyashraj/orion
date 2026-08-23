'use server'


import { profileRepository } from "../repositories/profile.repository";
import { authRepository } from '../repositories/auth.repository'

/**
 * 
 * @param user username 
 * @returns true if username has profile picture uploaded
 */
export async function hasPFP(user: string) {

    const haspfp = profileRepository.hasPFP(user);
    return !!haspfp;
}

export async function getInfo(user: string) {
    const baseuserdata = await authRepository.getUser({ username: user }, { _id: 0, password: 0 });
    const userProfile = await profileRepository.getProfile(user);
    return { ...userProfile, ...baseuserdata };
}


export async function saveInfo(user: string, updatedInfo: InfoUpdate) {
    return await profileRepository.update(user, updatedInfo);

}


export async function readUserPostFromDb(user: string) {
    const ids = profileRepository.getPostIds(user);
    return ids;
}
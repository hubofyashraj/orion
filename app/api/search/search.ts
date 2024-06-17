'use server';

import { validSession } from "../actions/authentication";
import { searchUser } from "../db_queries/search";

export async function searchUsers(keyword: string) {
    const username = await validSession();
    if(!username) return;
    try {
        const users = await searchUser(keyword, username);
        return users;
    } catch(error) {
        return [];
    }
}

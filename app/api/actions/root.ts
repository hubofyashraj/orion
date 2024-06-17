import { getToken } from "./cookie_store";

export async function getRootServerProps() {
    const token = await getToken();
    if(token) return token;
    else return false;
}


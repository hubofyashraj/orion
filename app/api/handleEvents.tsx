import { login } from "./events/login";

export function handleEvent(event: string, data: any) {
    if(event=='login') {
        login(data);
    }
}
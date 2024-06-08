'use server';

import { address } from "../api/api";

export  async function sendMessageToServer (data: any, token: string) {
    
    await fetch(
        address+'/chats/sendText',
        {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        }
    )
}
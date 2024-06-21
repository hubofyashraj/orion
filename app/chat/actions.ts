'use server';

const address = process.env.express_uri as string;

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
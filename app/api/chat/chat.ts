'use server';

import { sendEvent } from "@/app/utils/server-only";
import { validSession } from "../auth/authentication";
import { getConnections, getMessagesFromDb, getUnreadMessagesFromDB, insertMessage, readMessages } from "../db_queries/chat";


export async function fetchConnections() {
    const {user, status} = await validSession();
    if(status==401) return [];
    const connections = await getConnections(user!);
    return connections;
}


export async function getMessages(connection: string) {
    const {user, status} = await validSession();
    if(status==401) return []
    const messages = await getMessagesFromDb(user!, connection);
    return messages;
}

/**
 * 
 * @param user receiver
 * @param text message
 * @returns message object if successfull else false
 */
export async function sendMessage(msg: Message) {
    const {user, status} = await validSession();
    if(status==401) return false;
    const message: Message = {
        ...msg,
        sender: user!,
        sending: undefined,
        unread: true
    }
    const inserted = await insertMessage(message);
    if(inserted) {
        try {
            const event = {
                type: 'message',
                payload: message
            }

            sendEvent(message.receiver, event);
            return JSON.stringify(message)
        } catch (error) {
            console.error('while sending sse request to express\n ', error);
        }
    }
    return false;

}


export async function setAllRead(connection: string) {
    const {user, status} = await validSession();
    if(status==401) return;
    const modifiedCount = await readMessages(connection, user!);
    return modifiedCount;
}

export async function getUnreadMessages() {
    const {user, status} = await validSession();
    if(status==401) return;

    const messages = await getUnreadMessagesFromDB(user!);
    if(messages) return JSON.stringify({messages});

    return ;
}
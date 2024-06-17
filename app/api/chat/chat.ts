'use server';

import { Message } from "@/app/chat/types";
import { validSession } from "../actions/authentication";
import { getConnections, getMessagesFromDb, insertMessage, readMessages } from "../db_queries/chat";
import axios from "axios";
import { address } from "../api";

export async function fetchConnections() {
    const self = await validSession();
    if(self) {
        const connections = await getConnections(self);
        return connections;
    }
    return []
}


export async function getMessages(user: string) {
    const self = await validSession();
    if(!self) return []
    const messages = await getMessagesFromDb(self, user);
    return messages;
}

/**
 * 
 * @param user receiver
 * @param text message
 * @returns message object if successfull else false
 */
export async function sendMessage(msg: Message) {
    const self = await validSession();
    if(!self) return false;
    const message: Message = {
        ...msg,
        sender: self,
        sending: undefined,
        unread: true
    }
    const inserted = await insertMessage(message);
    if(inserted) {
        try {
            axios.post(address+'/sse/sendMessage?user='+self, {message})
            return JSON.stringify(message)
        } catch (error) {
            console.error('while sending sse request to express\n ', error);
        }
    }
    return false;

}


export async function setAllRead(user: string) {
    const self = await validSession();
    if(self) {
        const modifiedCount = await readMessages(user, self);
        return modifiedCount;
    } else return "auth";
}
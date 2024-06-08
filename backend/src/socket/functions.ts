import { Messages } from "../types/db_schema";
import { getSocket } from "./socket";

export function socketSendMsg(msg: Messages) {
    const soc = getSocket(msg.receiver);
    if(soc) {
        soc.emit('new message', JSON.stringify(msg));
        // console.log('msg sent to', msg.receiver);
    }
}

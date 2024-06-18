import { validSession } from "../actions/authentication";
import { readAlertsFromDb, readRequestId } from "../db_queries/navbar";
import { acceptRequest, cancelRequest } from "../search/search";


export async function fetchAlerts() {
    const self = await validSession();
    if(!self) return [];

    const requests = await readAlertsFromDb(self);
    return requests;
}


export async function acceptRequestFromUser(user: string) {
    const self = await validSession();
    if(!self) return false;

    const req_id = await readRequestId(user, self);
    if(!req_id) return false;

    const result = await acceptRequest(req_id);
    return result;
}

export async function rejectRequestFromUser(user: string) {
    const self = await validSession();
    if(!self) return false;

    const req_id = await readRequestId(user, self);
    if(!req_id) return false;

    const result = await cancelRequest(req_id);
    return result;
}


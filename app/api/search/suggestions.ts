'use server'
import assert from "assert";
import { validSession } from "../auth/authentication";
import { collections } from "../db_queries/collections";

const connectionsCollection = collections.connectionsCollection;
const infoCollection = collections.infoCollection;

async function generateSuggestions() {
    const {status, user} = await validSession();
    if(status==401) return;
    assert(user);
    const suggestions: string[] = [user];
    const connections = (await connectionsCollection.findOne({username: user}))?.connections;

    if(!connections) return;
    const promises = connections.map(async (connection) => {
        const connections_of_connection = (await connectionsCollection.findOne({username: connection}))!.connections;
        for( const connection_of_connection of connections_of_connection) {
            if(suggestions.indexOf(connection_of_connection)==-1 && connections.indexOf(connection_of_connection)==-1) {
                suggestions.push(connection_of_connection);
            }
        }
    })
    await Promise.all(promises);

    return suggestions.filter((_,idx) => idx!=0);
}

export async function getSuggestions() {
    const suggestions =  await generateSuggestions();
    
    const datas = suggestions?.map(async (suggestion) => {
        const data = await fetchMatchData(suggestion);
        return data;
    })
    if(datas) await Promise.all(datas);
    return datas;
}

export async function fetchMatchData(user: string) {
    const info = await infoCollection.findOne({username: user}, {projection: {username: 1, fullname: 1}});
    return {...info, status: 'none'} as Match
}
import {MongoClient} from 'mongodb';
import { resolve } from 'path';
import { getInfo } from './profileDB';

const client = new MongoClient(process.env.MONGO_LOCAL!);
client.connect()

const db = client.db('demo')


interface request {
    req_id: string,
    sender: string
}

export async function getReqObjs(user: string) : Promise<Array<request>> {
    return new Promise(async (resolve, reject)=>{

        const collection = db.collection('connect_request');
        const res = collection.find({receiver: user});
        console.log('requests found: ', await res.hasNext());
        
        var list: Array<request> = [];

        while(await res.hasNext()) {
            const doc = await res.next();
            list.push({req_id: doc!._id.toString(), sender: doc!.sender});
        }

        

        resolve(list);

    })
}

export function getRequests(user: string) : Promise<Array<any>> {
    return new Promise(
        async (resolve, reject)=>{
            var list: Array<any> = [];
            
            await getReqObjs(user).then(async (objs: Array<request>)=>{

                const promises = objs.map(async (obj)=>{
                    await getInfo(obj.sender).then((info)=>{
                        list.push({req_id: obj.req_id, user, fullname: info.fullname, profile_image: info.profile_image})

                    })
                })
                await Promise.all(promises);
                resolve(list);
            })
            // console.log(list);
            //TODO NOT WORKING!!!! list going out empty
        }
    )
}
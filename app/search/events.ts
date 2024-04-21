import axios from "axios"
import { address } from "../api/api"

export async function sendConnectionRequest(user: string) {
    const res = await axios.post(
        address+'/connectionRequest',
        {token: localStorage.getItem('token'), user}
    )

    return res.data.id;
    
    
}

export async function pullbackReq(req_id: string) {
    await axios.post(
        address+'/pullbackReq',
        {token: localStorage.getItem('token'), req_id},

    )
    console.log('testst');
    


}
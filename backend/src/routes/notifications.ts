import express, {Request, Response} from 'express'
import { getRequests } from './notificationsDb';


const notificationRouter = express.Router()
module.exports=notificationRouter;

notificationRouter.get('/getRequests', (req: any, res: Response)=>{
    getRequests(req.user).then((requests: any[])=>{
        // console.log(requests);
        
        res.json({success: true, requests});
    }).catch((reason)=>{
        res.json({success: false, reason});
    })
    
})
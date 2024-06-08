import express, {Request, Response} from 'express'
import { getRequests } from './notificationsDb';
import { RequestExtended } from '../types/types_local';


const notificationRouter = express.Router()
module.exports=notificationRouter;

notificationRouter.get('/getRequests', (req: RequestExtended, res: Response)=>{
    getRequests(req.user!).then((requests: any[])=>{
        res.json({success: true, requests});
    }).catch((reason)=>{
        res.json({success: false, reason});
    })
    
})
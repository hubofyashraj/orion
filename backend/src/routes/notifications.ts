import express, {Request, Response} from 'express'
import { verify_token } from '..';
import { getRequests } from './notificationsDb';


const notificationRouter = express.Router()
module.exports=notificationRouter;

notificationRouter.post('/getRequests', (req: Request, res: Response)=>{
    console.log('Requests fetching');
    
    
    verify_token(req.body.token).then((data)=>{
        getRequests(data.username!).then((requests: any[])=>{
            // console.log(requests);
            
            res.json({success: true, requests});
        }).catch((reason)=>{
            res.json({success: false, reason});
        })
    }).catch((reason)=>{
        res.json({success: false, reason});
    })
})
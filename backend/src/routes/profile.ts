import express, {Request, Response} from "express";
import { Info, addConnectionStatus, getInfo, saveImage, saveInfo } from "./profileDB";
import { verify_token } from "..";
import { getprofileData } from "../database/db";

const profileRouter = express.Router();
module.exports = profileRouter;




profileRouter.post('/fetchinfo', (req: Request, res: Response)=>{
    verify_token(req.body.token).then((data)=>{
        getInfo(req.body.user).then((result)=>{
            // console.log(result);
            console.log(req.body.user, data.username!, 'hello');
            
            if(req.body.user!=data.username!) {
                addConnectionStatus(result, req.body.user, data.username!).then(result=>{
                    res.json({success: true, result})
                })
            }else {
                res.json({success: true, info: result});    
            }
        }).catch(async (reason)=>{
            var info: Info = {
                username: req.body.user,
                fullname: '',
                bio:'',
                contact: '',
                contact_privacy: false,
                dob: '',
                email: '',
                gender: '',
                location: '',
                profession: '',
                profile_image: '',
            }
            res.json({success: true, info: info});
            
        })
    }).catch(reason=>res.json({success: false, reason}))
})


profileRouter.post('/saveinfo', (req: Request, res: Response)=>{
    verify_token(req.body.token).then((data)=>{
        saveInfo(data.username!, req.body.updatedInfo).then(()=>{
            res.json({success: true});
        })
    })
})

profileRouter.post('/saveimage', (req:Request, res: Response)=>{
    console.log('bhbii');
    console.log(req.body.image);
    
    verify_token(req.body.token).then((data)=>{
        saveImage(data.username!, req.body.image).then(()=>{
            res.json({success: true});
        })
    })
})
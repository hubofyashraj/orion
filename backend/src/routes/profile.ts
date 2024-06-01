import express, {Request, Response} from "express";
import { Info, addConnectionStatus, getInfo, saveImage, saveInfo } from "./profileDB";
import { getprofileData } from "../database/db";
import { pfpUploadMiddleware } from "./upload";
import fs from 'fs';
import path from "path";
import { readImage } from "../readFile";
import { customRequest } from "../types/customTypes";
const profileRouter = express.Router();
module.exports = profileRouter;

/**
 * Fetches info of user whose username comes with request.
 * If 'user' is attached with request that means some user is
 * trying to fetch info of another user so connection status with 
 * that user is added to the object.
 * 
 * 'user' is sent with request and 'username' is added to body after 
 * jwt token is verified. 
 */

profileRouter.get('/fetchinfo', (req: customRequest, res: Response)=>{
    getInfo(req.query.user as string??req.user!).then((result)=>{
        if(req.query.user) {
            addConnectionStatus(result, req.query.user as string, req.body.username!).then(result=>{
                res.json({success: true, result})
            })
        }else {
            res.json({success: true, info: result});    
        }
    }).catch(async (reason)=>{
        console.log(reason, req.body.user);
        
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
            pfp_uploaded: false,
        }
        res.json({success: true, info: info});
        
    })
})


profileRouter.post('/saveinfo', (req: Request, res: Response)=>{
    saveInfo(req.body.username!, req.body.updatedInfo).then(()=>{
        res.json({success: true});
    })
})

profileRouter.post('/saveimage', pfpUploadMiddleware.single('files'), (req:any, res: Response)=>{
    console.log('profile image save request', req.user);
    saveImage(req.user).then(()=>{
        res.json({success: true});
        console.log('image saved', req.user);
    })
})

profileRouter.get('/fetchPFP', (req: any, res: Response)=>{
    let user = req.user;  

    if(req.query.user) user = req.query.user
    
    getInfo(user).then((result)=>{
        if(result.pfp_uploaded) {
            readImage(user, 'pfp').then((result)=>{
                res.json({success: true, image: result})
            }).catch((err)=>{
                console.log('someerr', err);
                res.json({success: true, image: ''})
            })
        }else {
            res.json({success: true, image: ''})
        }
    }).catch((reason)=>{
        res.json({success: false, reason});
    })
})
import express, { Response} from "express";
import { addConnectionStatus, getInfo, getUserPosts, saveImage, saveInfo } from "./profileDB";
import { pfpUploadMiddleware } from "./upload";
import path from "path";
import { readImage, srcpath } from "../readFile";
import { RequestExtended } from "../types/types_local";
import sharp from "sharp";
import { Info } from "../types/types_local";
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

profileRouter.get('/fetchinfo', (req: RequestExtended, res: Response)=>{
    getInfo(req.query.user as string??req.user!).then(async (result: Info)=>{
        if(result.pfp_uploaded) {
            const pfp = await readImage(result.username, 'pfp')
            result.pfp=pfp;
        }
        if(req.query.user) {
            addConnectionStatus(result, req.query.user as string, req.user!).then(result=>{
                res.json({success: true, result})
            })
        }else {
            res.json({success: true, info: result});    
        }
    }).catch( (reason)=>{
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


profileRouter.post('/saveinfo', (req: RequestExtended, res: Response)=>{
    saveInfo(req.body.username!, req.body.updatedInfo).then(()=>{
        res.json({success: true});
    })
})

profileRouter.post('/saveimage', pfpUploadMiddleware.single('file'), (req:RequestExtended, res: Response)=>{
    console.log('profile image save request', req.user);
    saveImage(req.user!).then(async ()=>{

        await sharp(req.file!.buffer)
        .resize(512)
        .jpeg({quality: 80})
        .toFile(path.join(srcpath, '..', 'uploads', 'pfp', req.user!))
        req.file=undefined
        res.json({success: true});
        console.log('image saved', req.user);
    })
})

profileRouter.get('/fetchPFP', (req: RequestExtended, res: Response)=>{
    let user = req.user!;  

    if(req.query.user) user = req.query.user as string
    
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

profileRouter.get('/fetchUserPosts', (req: RequestExtended, res: Response)=>{
    const user = req.user!;

    getUserPosts(user).then((result)=>{
        res.json({success: true, posts: result})
    }).catch((err)=>{
        res.json({success: false, reason: err})
    })
})
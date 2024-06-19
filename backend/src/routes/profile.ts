import express, { Response} from "express";
import { pfpUploadMiddleware } from "./upload";
import path from "path";
import { readImage, srcpath } from "../readFile";
import { RequestExtended } from "../types/types_local";
import sharp from "sharp";
const profileRouter = express.Router();
module.exports = profileRouter;

profileRouter.post('/savePFP', pfpUploadMiddleware.single('file'), async (req:RequestExtended, res: Response)=>{
    try {
        await sharp(req.file!.buffer)
            .resize(512)
            .jpeg({quality: 80})
            .toFile(path.join(srcpath, '..', 'uploads', 'pfp', req.user!))
        req.file=undefined
        res.json({success: true});
    } catch (error) {
        res.json({success: false});
        console.error('while saving pfp image', error);
    }
})

profileRouter.get('/fetchPFP', (req: RequestExtended, res: Response)=>{
    let user = req.user!;  
    if(req.query.user) user = req.query.user as string
    
    readImage(user, 'pfp').then((result)=>{
        res.json({success: true, image: result})
    }).catch((err)=>{
        console.error('error while reading pfp for user:', user);
        console.error(err);
        res.json({success: true, image: ''})
    })
})

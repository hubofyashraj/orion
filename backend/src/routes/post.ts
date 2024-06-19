import express, { Response } from "express";
import { postUploadMiddleware } from './upload';
import { RequestExtended } from "../types/types_local";
import { readImage, srcpath } from "../readFile";
import { join, resolve } from "path";
import sharp from 'sharp';
import { existsSync, rmSync } from "fs";


const postRouter = express.Router();

module.exports = postRouter;


postRouter.post('/upload', postUploadMiddleware.array('files'), async (req: RequestExtended, res: Response, next: Function)=>{
    const files = req.files!
    if(Array.isArray(files)) {
        const post_id = req.body.post_id;

        const storageDestination = join(srcpath, '..', 'uploads')

        const promises = files.map( 
            async (file, idx)=>{
                const filename = post_id+'-'+idx
                return await sharp(file.buffer)
                .resize(1024)
                .jpeg({ quality: 80 })
                .toFile(join(storageDestination, filename));
            }
        )

        await Promise.all(promises)
        req.files=undefined            
    }
    res.json({success: true})
})
    


postRouter.get('/fetchPostAssets', (req: RequestExtended, res: Response) => {
    const asset_id = req.query.asset_id;
    if(!asset_id) {res.status(404); return;}

    readImage(asset_id+'')
    .then((imgsrc)=>{
        res.json({asset: imgsrc})
    })
    .catch((err)=>{
        console.error('while reading images to send');
        console.error(err);
        res.status(404);        
    })
})

postRouter.post('/deletePost', (req: RequestExtended, res:Response)=>{
    const post_id = req.query.post_id as string;
    let idx=0;
    try {
        const path = resolve(srcpath, '..', 'uploads')
        while(existsSync(join(path, post_id+'-'+idx))) {
            rmSync(join(path, post_id+'-'+idx));
            idx++;
        }
        res.status(200);
    } catch(error) {
        console.error('while trying to delete post files');
        console.error(error);
        res.status(500);
    }
})
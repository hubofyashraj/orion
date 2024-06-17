import express, { Response } from "express";
import { addNewComment, deleteComment, deletePost, fetchPost, fetchPosts, likePost, savePost, unlikePost, unsavePost, upload } from "./postDB";
import { postUploadMiddleware } from './upload';
import { RequestExtended } from "../types/types_local";
import { readImage, srcpath } from "../readFile";
import path from "path";
import sharp from 'sharp';


const postRouter = express.Router();

module.exports = postRouter;


postRouter.post('/upload', postUploadMiddleware.array('files'), async (req: RequestExtended, res: Response, next: Function)=>{
    console.log('saving images', req.files);
    
    const files = req.files!
    if(Array.isArray(files)) {
        const post_id = req.body.post_id;

        const storageDestination = path.join(srcpath, '..', 'uploads')

        const promises = files.map( 
            async (file, idx)=>{
                const filename = post_id+'-'+idx
                return await sharp(file.buffer)
                .resize(1024)
                .jpeg({ quality: 80 })
                .toFile(path.join(storageDestination, filename));
            }
        )

        await Promise.all(promises)
        req.files=undefined            
    }
    res.json({success: true})
})
    

// postRouter.post('/upload', postUploadMiddleware.array('files'), (req: RequestExtended, res: Response, next: Function)=>{
//     upload({post_user: req.user!, ...req.body}).then(async (result)=>{
//         const files = req.files!
//         if(Array.isArray(files)) {
//             const dest = path.join(srcpath, '..', 'uploads')

//             const promises = files.map( async (file, idx)=>{
//                 const filename = result.post_id+'-'+idx
//                 await sharp(file.buffer)
//                     .resize(1024)
//                     .jpeg({ quality: 80 })
//                     .toFile(path.join(dest, filename));
//             })

//             await Promise.all(promises)
//             req.files=undefined            
//         }
//         res.json({success: true})
//     }).catch((reason)=>{
//         res.json({success: false, reason})
//     })
// })


postRouter.post('/fetchPosts', (req: RequestExtended, res: Response)=>{
    fetchPosts(req.user!).then((posts: Array<{post_id: string, post_user: string, post_type: 'image' | 'video' | 'text'}>)=>{
        res.json({success: true, posts})
    }).catch((reason)=>{
        res.json({success: false, reason})
    })
})

postRouter.post('/like', (req: RequestExtended, res: Response)=>{
    likePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/unlike', (req: RequestExtended, res: Response)=>{
    unlikePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/save', (req: RequestExtended, res: Response)=>{
    savePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })

})

postRouter.post('/unsave', (req: RequestExtended, res: Response)=>{
    unsavePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })

})

postRouter.post('/newComment', (req: RequestExtended, res: Response)=>{
    addNewComment(req.body.post_id, req.body.username!, req.body.comment_text).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/deleteComment', (req: RequestExtended, res: Response)=>{
    deleteComment(req.body.post_id, req.body.comment_id, req.body.username!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.get('/fetchPost', (req: RequestExtended, res: Response)=>{
    fetchPost(req.query.post_id! as string, req.user!).then((result)=>{
        res.json(result)
    }).catch((resp)=>{
        res.json(resp)
    })
    
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
    deletePost(req.body.post_id).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: false, reason: 'DBMS err'})
    })
    
})
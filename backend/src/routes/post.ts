import express, {Request, Response, Express} from "express";
import { Post, addNewComment, deleteComment, deletePost, fetchPost, fetchPosts, likePost, savePost, unlikePost, unsavePost, upload } from "./postDB";
import { postUploadMiddleware } from './upload';
import { customRequest } from "../types/customTypes";
import { Multer } from "multer";
import { srcpath } from "../readFile";
import path from "path";
import { unlinkSync, writeFileSync } from "fs";
import sharp from 'sharp';


const postRouter = express.Router();

module.exports = postRouter;


postRouter.post('/upload', postUploadMiddleware.array('files'), (req: customRequest, res: Response, next: Function)=>{
    upload({post_user: req.user!, ...req.body}).then(async (result)=>{
        const files = req.files!
        if(Array.isArray(files)) {
            const dest = path.join(srcpath, '..', 'uploads')

            const promises = files.map( async (file, idx)=>{
                const filename = result.post_id+'-'+idx
                await sharp(file.buffer)
                    .resize(1024)
                    .jpeg({ quality: 80 })
                    .toFile(path.join(dest, filename));
                // unlinkSync(file.path);
            })

            await Promise.all(promises)
            req.files=undefined            
            // files.forEach((file, idx)=>{
            //     const filename = result.post_id+'-'+idx
            //     writeFileSync(path.join(dest, filename), file.buffer)
            // })
        }
        res.json({success: true})
    }).catch((reason)=>{
        res.json({success: false, reason})
    })
})


postRouter.post('/fetchPosts', (req: customRequest, res: Response)=>{
    fetchPosts(req.user!).then((posts: Array<{post_id: string, post_user: string, post_type: 'image' | 'video' | 'text'}>)=>{
        res.json({success: true, posts})
    }).catch((reason)=>{
        res.json({success: false, reason})
    })
})

postRouter.post('/like', (req: customRequest, res: Response)=>{
    likePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/unlike', (req: customRequest, res: Response)=>{
    unlikePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/save', (req: customRequest, res: Response)=>{
    savePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })

})

postRouter.post('/unsave', (req: customRequest, res: Response)=>{
    unsavePost(req.body.post_id, req.user!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })

})

postRouter.post('/newComment', (req: Request, res: Response)=>{
    addNewComment(req.body.post_id, req.body.username!, req.body.comment_text).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.post('/deleteComment', (req: Request, res: Response)=>{
    deleteComment(req.body.post_id, req.body.comment_id, req.body.username!).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: true, reason: 'DBMS err'})
    })
    
})

postRouter.get('/fetchPost', (req: customRequest, res: Response)=>{
    fetchPost(req.query.post_id! as string, req.user!).then((result)=>{
        res.json(result)
    }).catch((resp)=>{
        res.json(resp)
    })
    
})

postRouter.post('/deletePost', (req: Request, res:Response)=>{
    deletePost(req.body.post_id).then(()=>{
        res.json({success: true})
    }).catch(()=>{
        res.json({success: false, reason: 'DBMS err'})
    })
    
})
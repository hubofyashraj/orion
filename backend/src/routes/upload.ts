import multer from 'multer'


// const postStorage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, 'uploads/');
//     },
//     filename: (req: any, file, cb)=>{
//         const post_id = req.user+'-'+req.ts
//         console.log(req.body);
        
//         cb(null, post_id+'-'+(file.originalname));
//     }
// });

const postStorage = multer.memoryStorage();


export const postUploadMiddleware = multer({storage: postStorage})

const pfpStorage = multer.memoryStorage();

export const pfpUploadMiddleware = multer({storage: pfpStorage})
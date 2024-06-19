import multer from 'multer'

const postStorage = multer.memoryStorage();

export const postUploadMiddleware = multer({storage: postStorage})

const pfpStorage = multer.memoryStorage();

export const pfpUploadMiddleware = multer({storage: pfpStorage})
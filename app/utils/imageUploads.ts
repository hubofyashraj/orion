import 'server-only';
import sharp from 'sharp';
import { join } from 'path';
import { existsSync, mkdirSync, readFile, readFileSync, rmSync } from 'fs';


const uploads = 'uploads';
const pfp = join(uploads, 'pfp');


export async function saveImages(formData: FormData) {
    const files = formData.getAll('files') as Blob[]
    const post_id = formData.get('post_id')

    
    if(!existsSync(join(uploads))) mkdirSync(uploads)


    const promise = files.map( async (file, idx) => {
        const filename = post_id+'-'+idx
        return await sharp(await file.arrayBuffer())
        .resize(1024)
        .jpeg({quality: 80})
        .toFile(join(uploads, filename))
    })

    await Promise.all(promise);

    return true;

}

export async function savePFP(file: File, username: string) {
    if(!existsSync(uploads)) mkdirSync(uploads);

    if(!existsSync(pfp)) mkdirSync(pfp);

    await sharp(await file.arrayBuffer())
    .resize(512)
    .jpeg({quality: 80})
    .toFile(join(pfp, username))

    return true;
}



export function readImage(name:string, subdir?: string) {

    try {
        let filePath = uploads
        if(subdir) filePath =join(filePath, subdir);

        filePath = join(filePath, name);
        console.log(filePath);
        
        const data  = readFileSync(filePath);
        return data.toString('base64');

    } catch (error) {
        console.log('while reading image file');
        console.log(error);
    }
    
    
}


export function deleteImage(assetId: string, subdir?: string) {
    try {
        let filePath = uploads;
        if(subdir) filePath = join(filePath, subdir)
        if(existsSync(join(filePath, assetId)))  {
            rmSync(join(filePath, assetId))
        }

        return true
    } catch (error) {
        console.error('while deleting asset:', assetId);
        console.error(error);
        return false
    }
}
import fs from 'node:fs/promises'
import path from 'node:path'

export async function readImage(name:string, subdir?: string) {

    try {
        let filePath = path.join(__dirname, '..', 'uploads');
        if(subdir) filePath =path.join(filePath, subdir);

        filePath = path.join(filePath, name);

        const data  = await fs.readFile(filePath);
        return data.toString('base64');

    } catch (error) {
        // console.log(error);
        throw error;
    }
    
    
}

export const srcpath = __dirname


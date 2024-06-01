const jwt = require('jsonwebtoken')
import { Request, Response } from "express";
import { customRequest } from "../types/customTypes";


export function verify_token(token: string): Promise<{username?: string}> {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, authorizedData: any)=>{
            
            if(err) {
                // console.log('token not verified!', token, '\n', err);
                reject(err)
            }
            // console.log('token verified!', authorizedData);
            resolve(authorizedData)
        })
    })
}


export const jwt_middleware = async (req: customRequest, res: Response, next: Function)=>{
    console.log('request: '+req.path);
    if(
        req.path=='/login' 
        || req.path=='/signup' 
        || req.path=='/checkusernameavailability'
    ) next();
    else {
        const token = req.headers.authorization!;
        verify_token(token.split(' ')[1]).then((data)=>{
            req.user=data.username
            next();
        }).catch((reason)=>{
            console.log(token);
            console.log(reason);
            
            
            res.json({success: false, reason})
        })
    }
    
}
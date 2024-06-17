import { JwtPayload, verify } from 'jsonwebtoken'
import { Response } from "express";
import { RequestExtended } from "../types/types_local";

export async function verify_token(token: string) {
    try {
        const data = verify(token, process.env.JWT_SECRET as string) as JwtPayload & {username: string}
        return data.username
    }
    catch (err) {
        throw err
    }
}

export const jwt_middleware = async (req: RequestExtended, res: Response, next: Function)=>{
    const path = req.path;
    console.log('request: '+path);
    if( path=='/login' || path=='/signup' || path=='/checkusernameavailability') next();
    else if( path.startsWith('/sse') ) {
        req.user = req.query.user as string;
        next(); 
    }
    else {
        let token = req.headers.authorization!;
        
        if(token.match(' ')) token = token.split(' ')[1];
        verify_token(token).then((username)=>{
            req.user=username,
            next();
        }).catch((reason)=>{
            console.log(reason);
            
            res.json({success: false, reason: reason.name})
        })
    }
}
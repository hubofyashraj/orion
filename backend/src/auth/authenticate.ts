import { JwtPayload, verify } from 'jsonwebtoken'
import { Response } from "express";

const jwt_secret = process.env.jwt_secret as string;

export async function verify_token(token: string) {
    try {
        const data = verify( token, jwt_secret ) as JwtPayload & {username: string}
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
            console.log(token);
            
            console.log(reason);
            res.json({success: false, reason: reason.name})
        })
    }
}

import { Request } from "express"

type RequestExtended = Request & {
    user?: string
} 

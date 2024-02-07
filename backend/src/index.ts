
import { checkUserNameAvailable, checkCredentials, signup, getprofileData } from "./database/db";

import express, { Request, Response } from "express";
import https from 'https';
import cors from 'cors';

import morgan from 'morgan';

import jwt from 'jsonwebtoken';
import { json } from "stream/consumers";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
// app.use(morgan('combined'));

const PORT = process.env.PORT || 6789;


app.post('/' , (req: Request, res: Response)=>{
    // console.log('requested homepage', req.body);
    jwt.verify(req.body.token, process.env.JWT_SECRET as string, (err: any, authorizedData:any)=>{
        if(err) {
            res.sendStatus(403);

        }
        
        else    res.json({ authorizedData});
    })
    
    // res.send("welcome to express server");
})

app.post('/getProfileData', (req, res)=>{
    jwt.verify(req.body.token, process.env.JWT_SECRET as string, (err: any, authorizedData: any)=>{
        if(err) {
            res.json({success: false, reason: 'TokenERR'})
        }else {
            getprofileData(authorizedData.username).then((data)=>{
                res.json({success: true, user: data});
            }).catch((err)=>{
                res.json({success: false});
            })
        }
    })
})

app.post('/login', async (req: Request, res: Response)=>{
    const result = await checkCredentials(req.body);
    if(result==true) {
        jwt.sign({username: req.body.username}, process.env.JWT_SECRET as string, { expiresIn: '1h' }, (err, token)=>{
            if(err) {
                console.log(err);
            }
            res.json({verified: true, token});            
        });
    } else {
        res.json({verified: false})
    }
})

app.post('/logout', (req, res)=>{
    // jwt.verify(req.body.token, process.env.JWT_SECRET as string, (err: any, authorizedData: any)=>{
    //     if(err) {
            
    //     }
    // })
    res.json({});
})

app.get('/checkusernameavailability', async (req: Request, res: Response)=>{
    // console.log(req.query.username);
    var result = await checkUserNameAvailable(req.query.username+'');
    
    res.json({result: result})

    return true;
})

app.post('/signup', (req: Request, res: Response)=>{
    
    signup(req.body).then((_id)=>{
        res.json({success: true, _id});
    }).catch((reason)=>{
        res.json({success: false, reason});
    });
})

// const server = https.createServer();

app.listen(PORT, ()=>{
    console.log('listning on port', PORT);
    
})
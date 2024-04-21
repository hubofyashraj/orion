import { verify_token } from "..";

// const express = require('express');
import express, { Request, Response } from "express";
import { getConnections,  } from "../database/db";
import { getTexts, sendText } from "./chatDb";
import { socketSendMsg } from "../handleSocket";
import { ObjectId } from "mongodb";

const router = express.Router();
module.exports = router;
router.post('/getChats', (req: Request, res: Response)=>{
    console.log('here');
    
    verify_token(req.body.token).then(async (data)=>{
        const user = data.username!;
        console.log('data', data);
        const chatUser = req.body.user;

        const texts = getTexts(user, chatUser);
        




        const connections = await getConnections(user);
        if(connections==null) {
            res.json({success: false, reason: 'connections not found'});
        }else {
            res.json({success: true, connections});
        }
    }).catch((reason: any)=>{
        
        res.json({success: false, reason})
    })
})

router.post('/sendText', (req: Request, res: Response)=>{
    console.log('sending text', req.body);

    const receiver = req.body.receiver;
    const msg = req.body.msg;
    const ts = req.body.timeStamp;
    
    verify_token(req.body.token).then((data)=>{
        const ob = {
            sender: data.username!,
            receiver,
            msg, 
            ts,
        }

        sendText(ob).then((insertID)=>{
            socketSendMsg(receiver, data.username!, {...ob, id: insertID as string})
            res.json({success: true, insertID});

        })

    })
    
})


router.post('/getUserTexts', (req: Request, res: Response)=>{
    verify_token(req.body.token).then((data)=>{
        getTexts(data.username!, req.body.user).then((chats)=>{
            console.log(chats);
            res.json({chats});
            
        })
    })
})
import { verify_token } from "..";

// const express = require('express');
import express, { Request, Response } from "express";
import { getConnections,  } from "../database/db";
import { getTexts, sendText } from "./chatDb";
import { socketSendMsg } from "../handleSocket";

const router = express.Router();
module.exports = router;
router.post('/getConnections', (req: Request, res: Response)=>{
    // console.log('fetching chats for ');
    
    verify_token(req.body.token).then(async (data)=>{
        const user = data.username!;
        
        

        


        const connections = await getConnections(user);
        // console.log(connections);
        
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
    // console.log('sending text', req.body);

    
    
    verify_token(req.body.token).then((data)=>{
        const receiver = req.body.receiver;
        const msg = req.body.msg;
        const ts = req.body.timeStamp;

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


router.post('/getChats', (req: Request, res: Response)=>{
    verify_token(req.body.token).then((data)=>{
        
        getTexts(data.username!, req.body.receiver).then((chats)=>{
            // console.log(chats);
            res.json({chats});
            
        })
    })
})
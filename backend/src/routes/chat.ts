import { verify_token } from "../auth/authenticate";

// const express = require('express');
import express, { Request, Response } from "express";
import { getConnections,  } from "../database/db";
import { getTexts, sendText } from "./chatDb";
import { socketSendMsg } from "../handleSocket";

const router = express.Router();
module.exports = router;
router.get('/getConnections', async (req: any, res: Response)=>{
    const user = req.user;
    const connections = await getConnections(user);
    if(connections==null) {
        res.json({success: false, reason: 'connections not found'});
    }else {
        res.json({success: true, connections});
    }
})

router.post('/sendText', (req: any, res: Response)=>{
    const receiver = req.body.receiver;
    const msg = req.body.msg;
    const ts = req.body.timeStamp;
    const ob = {
        sender: req.user,
        receiver,
        msg, 
        ts,
    }
    sendText(ob).then((insertID)=>{
        socketSendMsg(receiver, req.user, {...ob, id: insertID as string})
        res.json({success: true, insertID});

    })

    
})


router.get('/getChats', (req: any, res: Response)=>{
    getTexts(req.user, req.query.receiver).then((chats)=>{
        res.json({chats});
    })
})
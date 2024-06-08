import express, { Response } from "express";
import { getConnections, getTexts, sendText } from "./chatDb";
import { socketSendMsg } from "../socket/functions";
import { RequestExtended } from "../types/types_local";
import { Messages } from "../types/db_schema";

const router = express.Router();
module.exports = router;

router.get('/getConnections', async (req: RequestExtended, res: Response)=>{
    const user = req.user!;
    const connections = await getConnections(user);
    res.json({success: true, connections});
})

router.post('/sendText', (req: RequestExtended, res: Response)=>{
    const ob: Messages = {
        sender: req.user!,
        receiver: req.body.receiver,
        msg: req.body.msg,
        ts: req.body.ts
    }
    sendText(ob).then((insertID)=>{
        ob.id=insertID
        socketSendMsg(ob)
        res.json({success: true, insertID});
    }).catch((error)=>{
        res.json({success: false, reason: error});
    })

    
})


router.get('/getChats', (req: any, res: Response)=>{
    getTexts(req.user, req.query.receiver).then((chats)=>{
        res.json({chats});
    })
})
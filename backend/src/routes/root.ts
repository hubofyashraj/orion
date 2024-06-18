import express, { Response } from 'express';
import { acceptReq, cancelRequest, checkCredentials, checkUserNameAvailable, getRequestsData, search, sendNotification, sendRequest, signup } from './rootDB';
import { sign } from 'jsonwebtoken';
import { RequestExtended } from '../types/types_local';
// import { removeUser } from '../socket/socket';

const rootRouter = express.Router();
module.exports = rootRouter;




rootRouter.post('/login', async (req: RequestExtended, res: Response)=>{
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const credentials = atob(authHeader.split(' ')[1]).split(':')
        const result = await checkCredentials(credentials);
        if(result) {
            sign(
                { username: credentials[0] }, 
                process.env.JWT_SECRET as string, 
                { expiresIn: '1d' }, 
                (err, token)=>{
                    if(err) {
                        console.log(err);
                        res.json({verified: false})
                    }
                    res.json({verified: true, token});
                }
            );
        } else {
            res.json({verified: false})
        }
    }
    else {
        res.json({verified: false, reason: 'credentials not provided'})
    }
    
})


rootRouter.get('/checkusernameavailability', async (req: RequestExtended, res: Response)=>{
    var result = await checkUserNameAvailable(req.query.username+'');
    res.json({available: result})
})

rootRouter.post('/signup', (req: RequestExtended, res: Response)=>{
    console.log(req.body);
    
    signup(req.body).then(()=>{
        res.json({success: true});
    }).catch((reason)=>{
        res.json({success: false, reason});
    });


})

rootRouter.post('/logout', (req: RequestExtended, res: Response)=>{
    // removeUser(req.user!)
    res.json({});
})



rootRouter.post('/' , (req: RequestExtended, res: Response)=>{
    getRequestsData(req.user!).then((list)=>{
        res.json({success: true, user: req.user, requests: list})
    }).catch((reason)=>{
        console.log('reason: ', reason);
        res.json({success: false, reason})
        res.sendStatus(403);
    })
    
})

rootRouter.post('/search', (req: RequestExtended, res: Response)=>{
    search(req.body.searchTxt, req.body.user).then((list)=>{
        res.json({success: true, results: list})
    }).catch((err)=>{
        console.log(err);
        res.json({success: false, reason: 'caught err on server sise'})
    })
})




rootRouter.post('/connectionRequest', (req: RequestExtended, res: Response)=>{
    // console.log(req.body);
    sendRequest(req.body.username??'', req.body.user).then((result)=>{
        sendNotification(req.body.user)
        res.json(result);
    })
})


rootRouter.post('/acceptReq', (req:RequestExtended, res: Response)=>{
    const id = req.body.cypher;
    // console.log(id);
    acceptReq(id).then((r: object)=>{
        res.json(r);

    }).catch((r)=>{
        res.json(r);

    })
})


rootRouter.post('/declineReq', async (req:RequestExtended, res: Response)=>{
    const id = req.body.cypher;
    await cancelRequest(id);
    res.json({success: true})
})

rootRouter.post('/pullbackReq', async (req: RequestExtended, res: Response)=>{
    const id = req.body.req_id;
    await cancelRequest(id);
    res.json({success: true})
})

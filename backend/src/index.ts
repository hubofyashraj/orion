
import  { sendRequest, checkUserNameAvailable, checkCredentials, signup, getprofileData, search, getRequestsData, acceptReq, sendNotification, cancelRequest } from "./database/db";

import express, { Request, Response } from "express";
import cors from 'cors';

import morgan from 'morgan';

import jwt from 'jsonwebtoken';
import { Server } from "socket.io";
import { addClient, clients } from "./handleSocket";
import { insertOnlineUser } from "./onlineDS";

const app = express();
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
// app.use(morgan('combined'));

const PORT = process.env.PORT || 6789;


export function verify_token(token: string): Promise<{username?: string}> {
    return new Promise((resolve, reject)=>{
        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, authorizedData: any)=>{
            
            if(err) {
                reject(err)
            }
            else resolve(authorizedData)
        })
    })
}

app.post('/' , (req: Request, res: Response)=>{
    

    verify_token(req.body.token).then((data: any)=>{
        // console.log('token verified!');
        console.log(data);
        
        getRequestsData(data.username).then((list)=>{
            // console.log('list: ', list);
            
            res.json({ userdata: data, requests: list});

        }).catch((reason)=>{
            console.log('reason: ', reason);
            
            res.sendStatus(403);
        })
    }).catch((reason)=>{
        console.log('Expired Token');
        
        res.sendStatus(403);
    })
    
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
    console.log('Credentials Match: ', result);
    
    if(result==true) {
        jwt.sign({username: req.body.username}, process.env.JWT_SECRET as string, { expiresIn: '1d' }, (err, token)=>{
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


app.post('/search', (req: Request, res: Response)=>{
    search(req.body.searchTxt, req.body.user).then((list: Array<object| null> | null)=>{
        if(list) {
            res.json({success: true, results: list})
        }else {
            res.json({success: false, reason: 'Server Err'})
        }
    }).catch(()=>[
        res.json({success: false, reason: 'caught err on server sise'})
    ])
})

app.post('/connectionRequest', (req: Request, res: Response)=>{
    // console.log(req.body);
    verify_token(req.body.token).then((data: {username?: string})=>{
        sendRequest(data.username??'', req.body.user).then((result)=>{
            sendNotification(req.body.user)
            res.json(result);
        })
    }).catch(()=>{

    }) 
    
})


app.post('/acceptReq', (req:Request, res: Response)=>{
    const id = req.body.cypher;
    // console.log(id);
    acceptReq(id).then((r: object)=>{
        res.json(r);

    }).catch((r)=>{
        res.json(r);

    })
})


app.post('/declineReq', async (req:Request, res: Response)=>{
    const id = req.body.cypher;
    await cancelRequest(id);
    res.json({success: true})
})

app.post('/pullbackReq', async (req: Request, res: Response)=>{
    const id = req.body.req_id;
    await cancelRequest(id);
    res.json({success: true})
})
// const server = https.createServer();


const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
app.use('/chats', chatRoutes);
app.use('/profile', profileRoutes);
// app.post('/getChats', (req: Request, res: Response)=>{
    
// })

const server = app.listen(PORT, ()=>{
    console.log('listning on port', PORT);
    
})

const io = new Server(server, {cors: {origin: "*"}});

io.on('connection', (socket)=>{
    console.log('new user');
    console.log(socket.id);
    
    socket.on('ping', (m)=>{
        console.log('ping from client');
        
    })

    socket.on('verify',(token)=>{
        verify_token(token).then((data)=>{
                var user = data.username!
                console.log(user);
                
                // var id = socket.id
                var soc = socket
                addClient({user, soc});
                insertOnlineUser(data.username!, soc)

             getRequestsData(data.username!).then((list)=>{
                // console.log(list);
                
                socket.emit('new notification', JSON.stringify(list));
             })
        }).catch((reason)=>{
            console.log(reason);
            socket.emit('autherr', 'Invalid Token')
        })
    })
    
    socket.on('onlineSocket', (token)=>{
        verify_token(token).then((data)=>{
            var soc = socket;
            insertOnlineUser(data.username!, soc)
        })
    })


    socket.on('chat', (message:string)=>{
        console.log(message);
        
        socket.emit('from server',message)
    });


    
})





setInterval(()=>{
    console.log('Clients');
    const list = Array.from(clients.keys());
    list.forEach(user => {
        var  soc = clients.get(user)!;
        soc.emit('ping', 'ping from server')
        console.log(user, 'active: ', soc.connected);

        
    });
    
}, 10000)
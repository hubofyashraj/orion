
import  { sendRequest, checkUserNameAvailable, checkCredentials, signup, getprofileData, search, getRequestsData, acceptReq, sendNotification, cancelRequest } from "./database/db";
import express, { Request, Response } from "express";
import cors from 'cors';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import { Server, Socket } from "socket.io";
import { addClient, clients, socIdToUserMap } from "./handleSocket";
import { insertOnlineUser } from "./onlineDS";
import { ObjectId } from "mongoose";
import { verify_token } from "./auth/authenticate";

import { jwt_middleware } from './auth/authenticate';
import { customRequest } from "./types/customTypes";
const http = require('http');
const socketio = require('socket.io');
const PORT = process.env.PORT || 6789;
const app = express();
const server = http.createServer(app);
// const io = socketio(server);

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
// app.use(morgan('combined'));
app.use(jwt_middleware)








app.post('/' , (req: customRequest, res: Response)=>{
    getRequestsData(req.user!).then((list)=>{
        res.json({success: true, user: req.body.username, requests: list})
    }).catch((reason)=>{
        console.log('reason: ', reason);
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
    const authHeader = req.headers.authorization;

    if(authHeader) {
        const credentials = atob(authHeader.split(' ')[1]).split(':')
        const result = await checkCredentials(credentials);
        if(result) {
            jwt.sign(
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

app.post('/logout', (req, res)=>{

    var soc: Socket| undefined = clients.get(req.body.username!);
    if(soc) soc.disconnect(true)
    clients.delete(req.body.username!)
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
    type Match = {
        username: string, 
        fullname: string, 
        status?: string, 
        id?: ObjectId
    }
    search(req.body.searchTxt, req.body.user).then((list)=>{
        res.json({success: true, results: list})
    }).catch((empty: Array<Match>)=>[
        res.json({success: false, reason: 'caught err on server sise'})
    ])
})

app.post('/connectionRequest', (req: Request, res: Response)=>{
    // console.log(req.body);
    sendRequest(req.body.username??'', req.body.user).then((result)=>{
        sendNotification(req.body.user)
        res.json(result);
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


const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
const notificationRouter = require('./routes/notifications');
const postRouter = require('./routes/post');
app.use('/chats', chatRoutes);
app.use('/profile', profileRoutes);
app.use('/notifications', notificationRouter);
app.use('/post', postRouter)

server.listen(PORT, ()=>{
    console.log('listning on port', PORT);
    
})

const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }

});


io.on('connection', (socket: Socket)=>{
    console.log('new user', socket.id);
    // console.log(socket.id);

    if(socIdToUserMap.has(socket.id)) {
        console.log('same user ', clients.get(socIdToUserMap.get(socket.id)!));
        
    }

    socket.on('reconnect', (reconnect_count)=>{
        console.log(`socket reconnected after #${reconnect_count} try`);
        socket.emit('reverify');
        
    })
    socket.on('reconnect_attempt', () => {
        // Handle reconnection attempts
        console.log('attempt to reconnect');
        
    });

    // if(socket.recovered) {
    //     console.log('socket recovered', socket.id);
        
    // }

    socket.on('error', function()
    {
        console.log("Sorry, there seems to be an issue with the connection!");
    });

    socket.on('connect_error', function(err: any)
    {
        console.log("connect failed"+err);
    });

    
    socket.on('ping', ()=>{        
        if(!socIdToUserMap.has(socket.id)) {
            socket.emit('reverify')
        }
        
    })


    socket.on('verify',(token: string)=>{
        // console.log('socket verification');
        
        verify_token(token).then((data)=>{
            var user = data.username!
            // console.log(user);
            // console.log('socket varified', user);
            
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
    
    socket.on('onlineSocket', (token: string)=>{
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
    // console.log('Clients', clients.size);
    // console.log('clients');
    // clients.forEach((soc,usr, map)=>{
    //     console.log(usr, soc.id);
        
    // })
    // console.log('map', socIdToUserMap)
    // console.clear()
    const list = Array.from(clients.keys());
    list.forEach(user => {
        var  soc = clients.get(user)!;
        
        soc.emit('ping', 'ping from server')
        console.log(user, 'active: ', soc.connected);

        
    });
    
}, 10000)
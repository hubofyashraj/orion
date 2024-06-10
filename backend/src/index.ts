import express from "express";
import { createServer } from 'node:http';
import cors from 'cors';
import morgan from 'morgan';
import { Server } from "socket.io";

import { jwt_middleware } from './auth/authenticate';
import init from "./socket/init_socket";


const rootRouter = require('./routes/root');
const chatRoutes = require('./routes/chat');
const profileRoutes = require('./routes/profile');
const notificationRouter = require('./routes/notifications');
const postRouter = require('./routes/post');


const PORT = process.env.PORT || 6789;
const app = express();
const server = createServer(app);

const io = new Server(
    server, 
    { cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }}
);
init(io)

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
// app.use(morgan('combined'));
app.use(jwt_middleware)

app.use('/', rootRouter);
app.use('/chats', chatRoutes);
app.use('/profile', profileRoutes);
app.use('/notifications', notificationRouter);
app.use('/post', postRouter)


server.listen(PORT, ()=>{
    console.log('listning on port', PORT);    
})







// setInterval(()=>{
//     const list = Array.from(users.keys());
//     list.forEach(user => {
//         var  soc = io.sockets.sockets.get(users.get(user)!);
        
//         if(soc) {
//             soc.emit('ping', 'ping from server')
//             console.log(user, 'active: ', soc.connected);
//         }
        
//     });
    
// }, 10000)
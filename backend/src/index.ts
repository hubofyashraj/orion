import express from "express";
import { createServer } from 'node:http';
import cors from 'cors';
import morgan from 'morgan';

import { jwt_middleware } from './auth/authenticate';

const PORT = process.env.PORT || 6789;
const app = express();
const server = createServer(app);


const profileRoutes = require('./routes/profile');
const postRouter = require('./routes/post');
const sse = require('./sse/sse');



app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(jwt_middleware)
// app.use(morgan('combined'));

app.use('/sse', sse);
app.use('/profile', profileRoutes);
app.use('/post', postRouter)


server.listen(PORT, ()=>{
    console.log('listning on port', PORT);    
})

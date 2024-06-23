"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_http_1 = require("node:http");
const cors_1 = __importDefault(require("cors"));
const authenticate_1 = require("./auth/authenticate");
const PORT = process.env.PORT || 6789;
const app = (0, express_1.default)();
const server = (0, node_http_1.createServer)(app);
const profileRoutes = require('./routes/profile');
const postRouter = require('./routes/post');
const sse = require('./sse/sse');
app.use(express_1.default.json({ limit: '20mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use(authenticate_1.jwt_middleware);
// app.use(morgan('combined'));
app.use('/sse', sse);
app.use('/profile', profileRoutes);
app.use('/post', postRouter);
server.listen(PORT, () => {
    console.log('listning on port', PORT);
});

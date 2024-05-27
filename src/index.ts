import { envLocal } from "./config/env.config"; envLocal();
// import { envProd } from "./config/env.config"; envProd();

// UNCOMMENT THIS 2 LINES FOR STARTING TUNNEL TO ENABLE SOCIAL STRATEGIES AUTHETICATION
// import { startTunnel } from "./services/tunnel.service"; startTunnel();

import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";


// AUTH STRATEGIES
import "./strategies/local.strategy";
import "./strategies/google.strategy";
import "./strategies/facebook.strategy";
import "./strategies/github.strategy";


// CONFIG FILES
import { sessionConfig } from "./config/session.config";
import { corsConfig } from "./config/cors.config";
import { xpb } from "./services/xpb.service";


// INIT SERVERS
const app: Express = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


// SOCKET CONNECTION
io.on('connection', socket => {
    socket.on('room', data => {
        socket.join(data)
    })
});


// INIT MIDDELWARES
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(cors(corsConfig));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.xssFilter());
app.use(passport.initialize());
app.use(passport.session());
app.use(xpb);



// IMPORT AND USE ROUTES
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import emailRoutes from "./routes/email.routes";
import accountRoutes from "./routes/account.route";
app.use('/api/v1/auth',     authRoutes);
app.use('/api/v1/user',     userRoutes);
app.use('/api/v1/email',    emailRoutes);
app.use('/api/v1/account',  accountRoutes);


// UNDEFINED NAD HOME ROUTE
app.all('/', (
    req: Request, res: Response, next: NextFunction
) => {
    return res.status(200).json({ msg: '/' }).end()
});
app.all('*', (
    req: Request, res: Response, next: NextFunction
) => {
    return res.status(200).json({ msg: '/404' }).end()
});


// BOOTSTRAP
server.listen(
    process.env.PORT, 
    // () => console.log(`Start APIs On http://${process.env.SERVER}:${process.env.PORT}`)
    () => console.log(`Start APIs On Port ${process.env.PORT}`)
);

// EXPORT SOCKET OBJECT
export { io };
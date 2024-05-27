import { SessionOptions } from "express-session"

export const sessionConfig: SessionOptions = {
    secret: String(process.env.SESSION_SECRET),
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}
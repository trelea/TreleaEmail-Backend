import { Request, Response, NextFunction } from "express";

const authorized = (req: Request, res: Response, next: NextFunction) => {
    if (!req?.user && !req?.session?.passport?.user) return res.status(401).end();
    next();
}

export { authorized };
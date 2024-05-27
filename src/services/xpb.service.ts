import { NextFunction, Request, Response } from "express";

export const xpb = (req: Request, res: Response, next: NextFunction) => {
    res.header('X-Powered-By', 'Trelea-FullStack-Dev');
    next();
}
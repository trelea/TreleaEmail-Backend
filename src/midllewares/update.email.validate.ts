import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";


const validateUpdateEmailReq = (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ msg: err.array() }).end();
    next();
}

export { validateUpdateEmailReq };
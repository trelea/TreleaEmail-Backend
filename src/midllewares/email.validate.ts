import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { emailBodyDTO } from "../dtos/email.body.dto";

const validateEmailReq = (req: Request<{}, {}, emailBodyDTO>, res: Response, next: NextFunction) => {
    const err = validationResult(req);
    if (!err.isEmpty()) return res.status(400).json({ msg: err.array() }).end();
    next();
}

export { validateEmailReq };
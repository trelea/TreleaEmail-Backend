import { Request, Response, NextFunction } from "express";
import db from "../services/database.service";

const updateEmailMidlleware = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    const { rowCount } = await db.query(
        `SELECT email_sent_id FROM emails_sent WHERE email_id=$1 AND email_sent_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    )
    if (rowCount === 0) return res.status(201).json({ msg: 'Invalid Operation' }).end();
    next();
};


export { updateEmailMidlleware };
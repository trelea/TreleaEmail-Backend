import { Request, Response, NextFunction } from "express";
import db from "../services/database.service";


const starEmailMidlleware = async (req: Request, res: Response, next: NextFunction) => {
    const $inInbox = await db.query(`SELECT email_inbox_id FROM emails_inbox WHERE email_id=$1 AND email_recived_by_id=$2`, [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    const $inSent = await db.query(`SELECT email_sent_id FROM emails_sent WHERE email_id=$1 AND email_sent_by_id=$2`, [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);

    if (!($inInbox.rows.length || $inSent.rows.length)) return res.status(200).json({ msg: 'Invalid Operation' }).end();
    next();
};

export { starEmailMidlleware };
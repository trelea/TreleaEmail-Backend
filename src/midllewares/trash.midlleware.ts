import { Request, Response, NextFunction } from "express";
import db from "../services/database.service";


const trashEmailMidlleware = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    const isArchived = await db.query(
        `SELECT email_spammed_id FROM emails_archived WHERE email_id=$1 AND email_archived_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    if (isArchived.rowCount !== 0) return res.status(201).json({ msg: 'Invalid Operation' }).end();

    const deleteFromInbox = await db.query(`DELETE FROM emails_inbox WHERE email_id=$1 AND email_recived_by_id=$2`, [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    const deleteFromSent = await db.query(`DELETE FROM emails_sent WHERE email_id=$1 AND email_sent_by_id=$2`, [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    const deleteFromStarred = await db.query(`DELETE FROM emails_starred WHERE email_id=$1 AND email_starred_by_id=$2`, [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);

    if (!( deleteFromInbox.rows.length || deleteFromSent.rows.length || deleteFromStarred.rows.length )) return res.status(201).json({ msg: 'Invalid Operation' }).end();
    next();
}

export { trashEmailMidlleware };
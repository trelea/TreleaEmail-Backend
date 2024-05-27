import { Request, Response, NextFunction } from "express";
import db from "../services/database.service";


const spamEmailMidlleware = async (req: Request<{ email_id: string }, {}, { original_labels: string[] }>, res: Response, next: NextFunction) => {

    // CHECK IF ITS IN TRASH
    const isTrashed = await db.query(
        `SELECT email_trashed_id FROM emails_trashed WHERE email_id=$1 AND email_trashed_by_id=$2`, 
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    if (isTrashed.rowCount !== 0) return res.status(201).json({ msg: 'Invalid Operation' }).end();

    // CHECK IF ITS IN ARCHIVE
    const isArchived = await db.query(
        `SELECT email_spammed_id FROM emails_archived WHERE email_id=$1 AND email_archived_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    if (isArchived.rowCount !== 0) return res.status(201).json({ msg: 'Invalid Operation' }).end();

    // IMPORTANAT DB OPRATIONS TO DEFINE & DELETE FROM ORIGINAL LOCATIONS 
    const deleteFromInbox = await db.query('DELETE FROM emails_inbox WHERE email_id=$1 AND email_recived_by_id=$2', [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    const deleteFromSent = await db.query('DELETE FROM emails_sent WHERE email_id=$1 AND email_sent_by_id=$2', [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    const deleteFromStarred = await db.query('DELETE FROM emails_starred WHERE email_id=$1 AND email_starred_by_id=$2', [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    
    req.body.original_labels = [];
    if (deleteFromInbox.rowCount !== 0) req.body.original_labels = [...req.body.original_labels, 'emails_inbox'];
    if (deleteFromSent.rowCount !== 0) req.body.original_labels = [...req.body.original_labels, 'emails_sent'];
    if (deleteFromStarred.rowCount !== 0) req.body.original_labels = [...req.body.original_labels, 'emails_starred'];

    if (req.body.original_labels.length === 0) return res.status(403).json({ msg: 'Invalid Operation' }).end();
    next();

};


export { spamEmailMidlleware };
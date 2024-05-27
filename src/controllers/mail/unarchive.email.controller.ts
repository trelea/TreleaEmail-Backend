import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";

const unarchiveEmail = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    
    const emailArchived = await db.query(
        `SELECT * FROM emails_archived WHERE email_id=$1 AND email_archived_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    if (emailArchived.rowCount === 0) return res.status(201).json({ msg: 'Invalid Operation' }).end();


    if (emailArchived.rows[0].email_original_labels.includes('emails_sent')) {
        await db.query(
                `INSERT INTO emails_sent (email_id, email_sent_by_id) VALUES ($1, $2)`,
                [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    }
    if (emailArchived.rows[0].email_original_labels.includes('emails_inbox')) {
        await db.query(
                `INSERT INTO emails_inbox (email_id, email_recived_by_id) VALUES ($1, $2)`,
                [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    }
    if (emailArchived.rows[0].email_original_labels.includes('emails_starred')) {
        await db.query(
                `INSERT INTO emails_starred (email_id, email_starred_by_id) VALUES ($1, $2)`,
                [req.params.email_id, req?.session?.passport?.user?.email_addr_id]);
    }


    const { command } = await db.query(
        `DELETE FROM emails_archived WHERE email_id=$1 AND email_archived_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    
    return res.status(200).json(command).end();

};

export { unarchiveEmail };
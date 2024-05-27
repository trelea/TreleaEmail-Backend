import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const getTrashedEmails = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { rows } = await db.query(
            `SELECT * FROM emails WHERE email_id IN (SELECT email_id FROM emails_trashed WHERE email_trashed_by_id=$1) ORDER BY email_id DESC`, 
            [req?.session?.passport?.user?.email_addr_id]
        );
        return res.status(200).json(rows).end();
    } catch (err) { return res.status(500).json(err).end(); }
    
}


const getTrashedEmailsById = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {

    try {
        const { rows } = await db.query(
            `SELECT * FROM emails WHERE email_id IN (SELECT email_id FROM emails_trashed WHERE email_trashed_by_id=$1) AND email_id=$2`, 
            [req?.session?.passport?.user?.email_addr_id, req.params.email_id]
        );
        return res.status(200).json(rows).end();
    } catch (err) { return res.status(500).json(err).end() };
    
}


export { getTrashedEmails, getTrashedEmailsById };
import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const spamEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { command } = await db.query(
            `INSERT INTO emails_spammed (email_id, email_spammed_by_id, email_original_labels) VALUES ($1, $2, $3)`,
            [req.params.email_id, req?.session?.passport?.user?.email_addr_id, req.body.original_labels]
        );
        return res.status(200).json(command).end();
    } catch (err) { return res.status(500).json(err).end() };
};


export { spamEmail };
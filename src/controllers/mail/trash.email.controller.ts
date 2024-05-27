import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const trashEmail = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {

    try {
        const { command } = await db.query(
            `INSERT INTO emails_trashed (email_id, email_trashed_by_id) VALUES ($1, $2)`,
            [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
        );
        return res.status(200).json(command).end();
    } catch (err) { return res.status(500).json(err).end() }

};

export { trashEmail };
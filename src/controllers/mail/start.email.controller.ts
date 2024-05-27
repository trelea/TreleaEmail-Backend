import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";

const startEmail = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    const email = await db.query(
        `SELECT * FROM emails_trashed WHERE email_id=$1 AND email_trashed_by_id=$2`,
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );

    if (email.rowCount !== 0) return res.status(201).json({ msg: 'This Email Is Trashed' }).end();

    const { rows } = await db.query(
        `INSERT INTO emails_starred (email_id, email_starred_by_id) VALUES ($1, $2) RETURNING *`, 
        [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
    );
    return res.status(200).json(rows).end();
};

export { startEmail };
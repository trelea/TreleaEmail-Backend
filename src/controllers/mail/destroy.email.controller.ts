import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const destroyEmail = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    try {
        const _delete = await db.query(
            `DELETE FROM emails WHERE email_id=$1 AND email_sender_id=$2`,
            [req.params.email_id, req?.session?.passport?.user?.email_addr_id]
        )
        if (_delete.rowCount === 0) return res.status(201).json({ msg: 'Invalid Operation'}).end();
        return res.status(200).json(_delete.command).end();
    } catch (err) { return res.status(500).json(err).end() };
};

export { destroyEmail };
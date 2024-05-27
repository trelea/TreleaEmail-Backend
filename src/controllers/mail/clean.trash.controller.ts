import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const cleanupTrash = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { command } = await db.query(
            `DELETE FROM emails_trashed WHERE email_trashed_by_id=$1`,
            [req?.session?.passport?.user?.email_addr_id]
        )
        return res.status(200).json(command).end();
    } catch (err) { return res.status(403).json(err).end() };
    
};

export { cleanupTrash };
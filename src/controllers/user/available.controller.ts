import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";


const available = async (req: Request<{}, {}, {}, { name: string }>, res: Response, next: NextFunction) => {
    const { rows } = await db.query(`SELECT local_user_id FROM local_users WHERE local_user_name=$1`, [req.query.name]);
    if (!rows[0]) return res.status(201).json({ msg: true }).end();
    return res.status(201).json({ msg: false }).end();
}

export { available };
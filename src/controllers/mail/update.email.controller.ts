import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";
import { updateEmailBodyDTO } from "../../dtos/update.email.dto";


const updateEmail = async (req: Request<{ email_id: string }, {}, updateEmailBodyDTO>, res: Response, next: NextFunction) => {
    if (Object.keys(req.body).length === 0) return res.status(201).json({ msg: 'Invalid Operations' }).end();

    try {

        let values = Object.values(req.body);
        values = [...values, true, req.params.email_id, req?.session?.passport?.user?.email_addr_id];

        const { rows } = await db.query(
            `UPDATE emails
            SET ${Object.keys(req.body).map((i, k) => `${i}=$${k+1}`).join(',')}, email_status_edited=$${Object.keys(req.body).length + 1}
            WHERE email_id=$${Object.keys(req.body).length + 2} AND email_sender_id=$${Object.keys(req.body).length + 3} RETURNING *`,
            values
        );
        return res.status(200).json(rows).end();
    } catch (err) { return res.status(500).json(err).end() };
    
};

export { updateEmail };
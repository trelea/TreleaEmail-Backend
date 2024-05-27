import { Request, Response, NextFunction } from "express";
import { emailBodyDTO } from "../../dtos/email.body.dto";
import db from "../../services/database.service";
import { io } from "../../index";



const sendEmail = async (req: Request<{}, {}, emailBodyDTO>, res: Response, next: NextFunction) => {

    req.body.email_sender_id = req?.session?.passport?.user?.email_addr_id

    const { rows } = await db.query(
        `INSERT INTO emails (
            ${Object.keys(req.body).join(',')}
        ) VALUES (
            ${Object.values(req.body).map((i, k) => { return `$${k + 1}`}).join(', ')}
        ) RETURNING *`,
        Object.values(req.body)
    );

    // SET MAIL IN SENT AND INBOX LABELS
    await db.query(`INSERT INTO emails_sent (email_id, email_sent_by_id) VALUES ($1, $2)`, [rows[0].email_id, req.body.email_sender_id]);
    
    const usersExists = await db.query(`SELECT email_addr_id, email_addr_name FROM emails_address WHERE email_addr_name IN (${(req.body.email_recivers).map((i, k) => { return `$${k+1}` }).join(',')})`, req.body.email_recivers);

    if (usersExists.rows){
        usersExists.rows.map(async (data) => {
            await db.query(
                `INSERT INTO emails_inbox (email_id, email_recived_by_id) VALUES ($1, $2)`,
                [rows[0].email_id, data.email_addr_id]
            )
            io.to(data.email_addr_name).emit('notification', {
                type: 'Notification',
                msg: 'Check Your Inbox'
            });
        })
    }
    
    return res.status(200).json(rows).end();

}

export { sendEmail };
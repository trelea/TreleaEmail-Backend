import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";
import { join } from "path";

// select /inbox /sent /archived
const getAllEmails = async (req: Request, res: Response, next: NextFunction) => {
    let _ids: any[] = []

    const inboxEmailsId = await db.query(
        `SELECT emails_inbox.email_id FROM emails_inbox
        INNER JOIN emails_address ON emails_inbox.email_recived_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    const sentEmailsId = await db.query(
        `SELECT emails_sent.email_id FROM emails_sent
        INNER JOIN emails_address ON emails_sent.email_sent_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    const archivedEmailsId = await db.query(
        `SELECT emails_archived.email_id FROM emails_archived
        INNER JOIN emails_address ON emails_archived.email_archived_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    inboxEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})
    sentEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})
    archivedEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})

    try {
        const { rows } = await db.query(`SELECT * FROM emails WHERE email_id IN (${_ids.map((i, k) => { return `$${k+1}`}).join(',')}) ORDER BY email_created_at DESC`, _ids);
        return res.status(200).json(rows).end();
    } catch (err) { return res.status(500).json(err).end() };

}


const getAllEmailsById = async (req: Request<{ email_id: string }>, res: Response, next: NextFunction) => {
    let _ids: any[] = []

    const inboxEmailsId = await db.query(
        `SELECT emails_inbox.email_id FROM emails_inbox
        INNER JOIN emails_address ON emails_inbox.email_recived_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    const sentEmailsId = await db.query(
        `SELECT emails_sent.email_id FROM emails_sent
        INNER JOIN emails_address ON emails_sent.email_sent_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    const archivedEmailsId = await db.query(
        `SELECT emails_archived.email_id FROM emails_archived
        INNER JOIN emails_address ON emails_archived.email_archived_by_id=emails_address.email_addr_id 
        WHERE emails_address.email_addr_id=$1`,
        [req?.session?.passport?.user?.email_addr_id]
    )

    inboxEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})
    sentEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})
    archivedEmailsId.rows.map(id => { return id.email_id }).map(i => { return _ids.push(i)})

    if (!_ids.includes(Number(req.params.email_id))) return res.status(403).json({ msg: 'Invalid Operation' }).end();

    try {
        const { rows } = await db.query(`SELECT * FROM emails WHERE email_id=$1`, [req.params.email_id]);
        return res.status(200).json(rows).end();
    } catch (err) { return res.status(500).json(err).end() };
}


export { getAllEmails, getAllEmailsById }
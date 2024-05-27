import { Request, Response, NextFunction } from "express";
import db from "../../services/database.service";
import bycrypt from "bcrypt";


const deleteAccount = async (req: Request<{}, {}, { user_password: string }>, res: Response, next: NextFunction) => {

    if (req?.session?.passport?.user?.trelea_mail) {
        try {
            const { command } = await db.query(
                `DELETE FROM social_users WHERE social_user_id=$1`, 
                [req.session.passport.user.trelea_mail.email_addr_social_user]
            );
            return res.status(200).json(command).end();
        } catch (err) { return res.status(500).json(err).end() };
    }

    try {
        const { rows } = await db.query(`SELECT local_user_password FROM local_users  WHERE local_user_id=$1`, [req?.session?.passport?.user?.email_addr_local_user]);
        if (!bycrypt.compareSync(req.body.user_password, rows[0].local_user_password)) return res.status(401).json().end();

        const { command } = await db.query(
            `DELETE FROM local_users WHERE local_user_id=$1`, 
            [req?.session?.passport?.user?.email_addr_local_user]
        );
        return res.status(200).json(command).end();
    } catch (err) { return res.status(500).json(err).end() };

}

export { deleteAccount }
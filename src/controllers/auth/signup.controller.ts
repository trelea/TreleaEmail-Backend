import { Request, Response, NextFunction } from "express";
import { signupBodyDTO } from "../../dtos/signup.body.dto";
import db from "../../services/database.service";
import bcrypt from "bcrypt";


const signupController = async (req: Request<{}, {}, signupBodyDTO>, res: Response, next: NextFunction) => {
    
    const user = await db.query(`SELECT local_user_name FROM local_users WHERE local_user_name=$1`, [req.body.user_name]);
    if (user.rowCount === 1) return res.status(201).json({ msg: 'User Already Exists' }).end();

    req.body.user_password = bcrypt.hashSync(req.body.user_password, bcrypt.genSaltSync(10));

    const _sqlQuery: string = `INSERT INTO local_users (
        ${Object.keys(req.body).map(e => { return `local_${e}`})}
    ) VALUES (
        ${Object.values(req.body).map((i, k) => { return `$${k + 1}`}).join(', ')} 
    ) RETURNING *`;
    
    const { rows } = await db.query(_sqlQuery, Object.values(req.body));

    let newAddr = await db.query(
        `INSERT INTO emails_address (email_addr_name, email_addr_local_user) VALUES ($1, $2) RETURNING *`, 
        [
            `${req.body.user_name}@trelea.com`,
            `${rows[0].local_user_id}`
        ]
    );

    newAddr = newAddr.rows[0];
    return res.status(200).json({ user: rows[0], mail: newAddr }).end();
}

export { signupController };
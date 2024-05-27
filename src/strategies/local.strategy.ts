import passport from "passport";
import { Strategy } from "passport-local";
import db from "../services/database.service";
import bcrypt from "bcrypt";


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));


passport.use(
    new Strategy({
        usernameField: "user_mail",
        passwordField: "user_password",
    },
    async (user_mail: string, user_password: string, done: any) => {
        const { rows } = await db.query(`SELECT * FROM emails_address WHERE email_addr_name=$1 AND email_addr_social_user IS NULL`, [user_mail])
        if (!rows[0]) return done(null, false, { msg: "Invalid Credentials" });

        const user = await db.query(`SELECT * FROM local_users WHERE local_user_id=$1`, [rows[0].email_addr_local_user])
        if (!bcrypt.compareSync(user_password, user.rows[0].local_user_password)) return done(null, false, { msg: "Invalid Credentials" });

        done(null, rows[0]);
    })
)
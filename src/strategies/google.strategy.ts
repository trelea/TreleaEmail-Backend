import passport from "passport";
import { Strategy, Profile } from "passport-google-oauth20";
import db from "../services/database.service";


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));


passport.use(
    new Strategy({
        clientID: String(process.env.GOOGLE_ID),
        clientSecret: String(process.env.GOOGLE_SECRET),
        callbackURL: String(process.env.GOOGLE_CALLBACK),
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        let googleUser = await db.query(`SELECT * FROM social_users WHERE social_user_provider_data=$1`, [JSON.stringify(profile)]);
        let googleUserAddr = await db.query(`SELECT * FROM emails_address WHERE email_addr_social_user=$1`, [googleUser?.rows[0]?.social_user_id]);

        if (googleUser.rowCount === 0) {
            googleUser = await db.query(`INSERT INTO social_users (social_user_provider_data) VALUES ($1) RETURNING *`, [JSON.stringify(profile)]);
            googleUserAddr = await db.query(
                `INSERT INTO emails_address (email_addr_name, email_addr_social_user) VALUES ($1, $2) RETURNING *`,
                [
                    `${profile.displayName.split(' ').join('')}@trelea.google.com`,
                    `${googleUser.rows[0].social_user_id}`
                ]
            )
        }   
        
        done(null, { google_user: googleUser.rows[0], trelea_mail: googleUserAddr.rows[0] });
    })  
);
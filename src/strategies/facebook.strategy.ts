import passport from "passport";
import { Strategy, Profile } from "passport-facebook";
import db from "../services/database.service";


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));


passport.use(
    new Strategy({
        clientID: String(process.env.FACEBOOK_ID),
        clientSecret: String(process.env.FACEBOOK_SECRET),
        callbackURL: String(process.env.FACEBOOK_CALLBACK),
        state: true
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        let facebookUser = await db.query(`SELECT * FROM social_users WHERE social_user_provider_data=$1`, [JSON.stringify(profile)]);
        let facebookUserAddr = await db.query(`SELECT * FROM emails_address WHERE email_addr_social_user=$1`, [facebookUser?.rows[0]?.social_user_id]);

        if (facebookUser.rowCount === 0) {
            facebookUser = await db.query(`INSERT INTO social_users (social_user_provider_data) VALUES ($1) RETURNING *`, [JSON.stringify(profile)]);
            facebookUserAddr = await db.query(
                `INSERT INTO emails_address (email_addr_name, email_addr_social_user) VALUES ($1, $2) RETURNING *`,
                [
                    `${profile.displayName.split(' ').join('')}@trelea.facebook.com`,
                    `${facebookUser.rows[0].social_user_id}`
                ]
            )
        }

        done(null, { facebook_user: facebookUser.rows[0], trelea_mail: facebookUserAddr.rows[0] });
    })
)
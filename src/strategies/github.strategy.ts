import passport from "passport";
import { Strategy, Profile } from "passport-github";
import db from "../services/database.service";


passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));


passport.use(
    new Strategy({
        clientID: String(process.env.GITHUB_ID),
        clientSecret: String(process.env.GITHUB_SECRET),
        callbackURL: String(process.env.GITHUB_CALLBACK),
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: any) => {
        let githubUser = await db.query(`SELECT * FROM social_users WHERE social_user_provider_data=$1`, [JSON.stringify(profile)]);
        let githubUserAddr = await db.query(`SELECT * FROM emails_address WHERE email_addr_social_user=$1`, [githubUser?.rows[0]?.social_user_id]);

        if (githubUser.rowCount === 0) {
            githubUser = await db.query(`INSERT INTO social_users (social_user_provider_data) VALUES ($1) RETURNING *`, [JSON.stringify(profile)]);
            githubUserAddr = await db.query(
                `INSERT INTO emails_address (email_addr_name, email_addr_social_user) VALUES ($1, $2) RETURNING *`,
                [
                    `${profile.displayName.split(' ').join('')}@trelea.github.com`,
                    `${githubUser.rows[0].social_user_id}`
                ]
            )
        }

        done(null, { facebook_user: githubUser.rows[0], trelea_mail: githubUserAddr.rows[0] });
    })
)
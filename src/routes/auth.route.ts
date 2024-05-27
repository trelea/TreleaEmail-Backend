import { Router } from "express";
import passport from "passport";
import { signupController } from "../controllers/auth/signup.controller";
import { signinController } from "../controllers/auth/signin.controller";
import { signoutController } from "../controllers/auth/signout.controller";
import { Request, Response, NextFunction } from "express";
import { validateSignupReq  } from "../midllewares/signup.validate";
import { signupReqBody } from "../dtos/signup.body.validation";
import { authorized } from "../services/authorized.service";


const router: Router = Router();


router.post('/signup', signupReqBody, validateSignupReq, signupController)
router.post('/signout', authorized, signoutController);


// LOCAL AUTH
router.post(
    '/signin', 
    passport.authenticate('local'),
    signinController
)


// GOOGLE AUTH
router.get(
    '/google',
    passport.authenticate('google', { scope: 'profile' })
);
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req: Request, res: Response, next: NextFunction) => { 
        return res.status(200).json(req.session.passport.user).end()
    }
);


// FACEBOOK AUTH
router.get(
    '/facebook',
    passport.authenticate('facebook')
);
router.get(
    '/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }), 
    (req: Request, res: Response, next: NextFunction) => { 
        return res.status(200).json(req.session.passport.user).end()
    }
);


// GITHUB AUTH
router.get(
    '/github',
    passport.authenticate('github')
);
router.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    (req: Request, res: Response, next: NextFunction) => { 
        return res.status(200).json(req.session.passport.user).end()
    }
);


export default router;
import { Request, Response, NextFunction } from "express"

const signoutController = (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('connect.sid');
    req.logout((err) => {
        if (err) next(err);
        req.session.destroy((err) => {
            if (err) next(err);
            res.redirect('/')
        })
    })
}

export { signoutController };
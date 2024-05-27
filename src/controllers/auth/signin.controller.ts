import { Request, Response, NextFunction } from "express"

const signinController = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json(req.session.passport).end()
}

export { signinController };
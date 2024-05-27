import { body } from "express-validator";

const updateEmailReqBody = [
    body('email_subject')
        .optional()
        .isString(),

    body('email_text')
        .optional()
        .isString(),

    body('email_links')
        .optional()
        .isArray({ min: 1, max: 100 }),
]

export { updateEmailReqBody };
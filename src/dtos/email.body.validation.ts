import { body } from "express-validator";

const emailReqBody = [
    body('email_recivers')
        .not()
        .isEmpty()
        .isArray({ min: 1, max: 100})
        .withMessage('Please Specify An Array Of Recivers Email'),

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

export { emailReqBody };
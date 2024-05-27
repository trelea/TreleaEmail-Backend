import { body } from "express-validator";

const signupReqBody = [
    body('user_name')
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 8, max: 30 })
        .customSanitizer(value => String(value).replace(/\s+/g, ''))
        .withMessage('Min Length Is 8 And Max Length Is 30'),


    body('user_phone')
        .not()
        .isEmpty()
        .trim()
        .isMobilePhone('any'),

    body('user_birth_date')
        .not()
        .isEmpty()
        .trim()
        .isISO8601()
        .withMessage('Date Ss Required In Format: YYYY-MM-DD'),

    body('user_gender')
        .optional()
        .trim()
        .isIn(['male', 'female'])
        .withMessage('We Support Only Males And Females.'),

    body('user_recovery_email')
        .optional()
        .isEmail()
        .trim(),

    body('user_password')
        .not()
        .isEmpty()
        .trim()
        .isLength({ min: 10, max: 30 })
        .withMessage('Min Length Is 10 And Max Length Is 30')

]

export { signupReqBody };
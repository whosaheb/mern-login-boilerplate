const { check, body, validationResult } = require('express-validator')
const userValidationRules = () => {
    return [
        //name should be charecter only
        check('name')
            .isLength({ min: 3 })
            .withMessage('Name must be of 3 characters long.')
            .matches(/^[A-Za-z\s]+$/)
            .withMessage('Name must be alphabetic.'),
        // email mush be valid format
        body('email').isEmail(),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5 }),
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(422).json({
        errors: extractedErrors,
    })
}

module.exports = {
    userValidationRules,
    validate,
}
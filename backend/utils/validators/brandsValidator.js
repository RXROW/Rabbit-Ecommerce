const {check }= require('express-validator')
const ValidatorMiddleware = require('../../middleware/validators')



exports.getBrandValidator = [
    check('id').isMongoId().withMessage(' invalid Brand id format ')  , ValidatorMiddleware
] ;

exports.creatBrandValidator = [
    check('name').notEmpty().withMessage('Brand name required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters') , ValidatorMiddleware
]

exports.deleteBrandValidator = [
    check('id').isMongoId().withMessage(' invalid Brand id format ')  , ValidatorMiddleware
] ;

exports.updateBrandValidator = [
    check('id').isMongoId().withMessage(' invalid Brand id format ') ,
    check('name').notEmpty().withMessage('Brand name required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters') , ValidatorMiddleware
] ;


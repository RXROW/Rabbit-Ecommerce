const {check }= require('express-validator')
const ValidatorMiddleware = require('../../middleware/validators')



exports.getCategoryValidator = [
    check('id').isMongoId().withMessage(' invalid category id format ')  , ValidatorMiddleware
] ;

exports.creatCategoryValidator = [
    check('name').notEmpty().withMessage('category name required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters') , ValidatorMiddleware
]

exports.deleteCategoryValidator = [
    check('id').isMongoId().withMessage(' invalid category id format ')  , ValidatorMiddleware
] ;

exports.updateCategoryValidator = [
    check('id').isMongoId().withMessage(' invalid category id format ') ,
    check('name').notEmpty().withMessage('category name required')
    .isLength({ min: 3, max: 30 }).withMessage('Name must be between 3 and 30 characters') , ValidatorMiddleware
] ;


const { check } = require("express-validator");
const ValidatorMiddleware = require("../../middleware/validators");
const User = require("../../models/user");

exports.getUserValidator = [
  check("id").isMongoId().withMessage(" invalid User id format "),
  ValidatorMiddleware,
];

exports.creatUserValidator = [
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 2 })
    .withMessage("Name is too short"),
  check("email")
    .isEmail()
    .withMessage("invalid email address")
    .notEmpty()
    .withMessage(" email required")
    .custom((val) =>
      User.findOne(
        { email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error("Wrong email or password"));
          }
        })
    ),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    ).custom((password , {req})=>{
        if ( password !== req.body.passwordConfirm){
            throw new Error ('wrong password')
        }
        return true ;
    }),
    check('passwordConfirm').notEmpty().withMessage('password confirm is required'),

    check('avatar').optional(),
    check('role').optional(),
    check('phone').isMobilePhone('ar-EG').withMessage('invalid phone number'),

  ValidatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage(" invalid User id format "),
  ValidatorMiddleware,
];

exports.updateUserValidator = [
  check("id").isMongoId().withMessage(" invalid User id format "),
  check("name")
    .notEmpty()
    .withMessage("User name required")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters"),
  ValidatorMiddleware,
];

const { check } = require("express-validator");
const ValidatorMiddleware = require("../../middleware/validators");

exports.addSubCtegorievalidator = [
  check("name")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters ")
    .notEmpty(),
  check("category")
    .notEmpty()
    .withMessage("name must be not empty")
    .isMongoId()
    .withMessage(" invalid id formate "),
  ValidatorMiddleware,
];
exports.getSpecificSubCtegorievalidator = [
  check("id").isMongoId().withMessage(" invalid id formate "),
  ValidatorMiddleware,
];
exports.deleteSubCtegorievalidator = [
  check("id").isMongoId().withMessage(" invalid id formate "),
  ValidatorMiddleware,
];
exports.updateSubCtegorievalidator = [
  check("id").isMongoId().withMessage(" invalid id formate "),
  check("name")
    .notEmpty()
    .withMessage("name must be not empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be between 3 and 30 characters "),
  ValidatorMiddleware,
];

const { check } = require("express-validator");
const { capitalizeFirstLetter } = require("../../utils/utils");

// for validating empty texts
exports.baseTextValidator = (text) =>
  check(text, `Invalid ${text} entered`)
    .trim()
    .notEmpty()
    .withMessage(`${capitalizeFirstLetter(text)} cannot be empty`)
    .bail();

// for validating email
exports.baseEmailValidator = () =>
  check("email", "Invalid email address")
    .trim()
    .notEmpty()
    .withMessage("Email address cannot be empty")
    .isEmail()
    .bail();

// for validating passwords
exports.basePasswordValidator = () =>
  check("password")
    .trim()
    .exists()
    .withMessage("Password is required")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 6 })
    .withMessage("Password cannot be less than 6 characters")
    .bail();

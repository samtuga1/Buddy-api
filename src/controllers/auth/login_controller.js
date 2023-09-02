const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const User = require("../../models/user.js");

module.exports = async (req, res, next) => {
  try {
    // handle validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    //destruct the request body
    const { email, password } = req.body;

    const savedUserDoc = await User.findOne({ email: email });

    if (!savedUserDoc.isVerified) {
      return res.status(200).json({
        message: "Account has not yet been verified",
      });
    }

    // check if password is correct
    var isEqual = await bcrypt.compare(password, savedUserDoc.password);

    // handle password incorrect error
    if (!isEqual) {
      const error = Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }

    const jwtToken = jwt.sign(
      {
        userId: savedUserDoc._id,
        programme: savedUserDoc.programme,
      },
      process.env.staging.JWT_TOKEN
    );

    res.status(200).json({
      user: savedUserDoc.toObject(),
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};

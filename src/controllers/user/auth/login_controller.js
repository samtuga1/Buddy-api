const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config({ path: ".env" });
const User = require("../../../models/user.js");

module.exports = async (req, res, next) => {
  try {
    // handle validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    //destruct the request body
    const { email, password } = req.body;

    const savedUserDoc = await User.findOne({ email: email });

    // check if password is correct
    var isEqual = await bcrypt.compare(password, savedUserDoc.password);

    // handle password incorrect error
    if (!isEqual) {
      const error = Error("Incorrect password");
      error.statusCode = 401;
      throw error;
    }

    if (!savedUserDoc.isVerified) {
      return res.status(401).json({
        message: "Account has not yet been verified",
      });
    }

    const jwtToken = jwt.sign(
      {
        userId: savedUserDoc._id,
        programme: savedUserDoc.programme,
      },
      process.env.JWT_TOKEN
    );

    const userObject = { ...savedUserDoc.toObject() };

    // avoid sending the password to the frontend
    delete userObject.password;

    res.status(200).json({
      user: userObject,
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};

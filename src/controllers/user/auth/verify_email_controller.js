const { validationResult } = require("express-validator");

const Token = require("../../../models/token.js");
const User = require("../../../models/user.js");

module.exports = async (req, res, next) => {
  try {
    // check if there are validation errors
    const errors = validationResult(req);

    // if any, then we handle it and throw it to the next function
    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    // destract the user body
    const { email, token } = req.body;

    // get token in the documents
    const savedToken = await Token.findOne({ token: token }).populate("userId");

    // check if email has been expired, therefore does not exist
    if (!savedToken) {
      const error = new Error("An error occured");
      error.data = "Invalid token, please check verification token again";
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findOne({
      _id: savedToken.userId._id,
      email: email,
    });

    // handle case if user does not exist
    if (!user) {
      const error = new Error("An error occured");
      error.data = "No account is associated with this email address";
      error.statusCode = 404;
      throw error;
    }

    // check if user has already been verified
    if (user.isVerified) {
      const error = new Error();
      error.data = "Account has already been verified please login";
      error.statusCode = 401;
      throw error;
    }

    user.isVerified = true;

    await user.save();

    await savedToken.deleteOne();

    res.status(200).json({
      message: "Your account has been successfully verified",
    });
  } catch (err) {
    next(err);
  }
};

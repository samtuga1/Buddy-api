const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const User = require("../../../models/user");
const Token = require("../../../models/token");

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

    // retrieve email from the body
    const { email, token, password } = req.body;

    // get token in the documents
    const savedToken = await Token.findOne({ token: token }).populate("userId");

    // check if email has been expired, therefore does not exist
    if (!savedToken) {
      const error = new Error("An error occured");
      error.data = "Invalid token, please check verification token again";
      error.statusCode = 401;
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
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // change the password to the new hashedpassword
    user.password = hashedPassword;

    // delete the token that was sent
    await savedToken.deleteOne();

    // save the user data with the new password
    await user.save();

    return res.status(200).json({
      message: "Password has been successfully changed",
    });
  } catch (error) {
    next(error);
  }
};

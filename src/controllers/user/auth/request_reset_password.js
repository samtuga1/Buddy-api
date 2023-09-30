const { validationResult } = require("express-validator");
require("dotenv").config({ path: ".env" });
const nodemailer = require("nodemailer");

const User = require("../../../models/user");
const Token = require("../../../models/token");
const { randomCharacters } = require("../../../utils/utils");

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
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    // check if email is associated with any account
    if (!user) {
      const error = new Error("No account found for this email address");
      error.statusCode = 404;
      throw error;
    }

    // find and delete all tokens associated with user incase the user request it multiple times
    await Token.deleteMany({ userId: user._id });

    // create a new token and associate it with the user
    const token = await Token({
      userId: user._id,
      token: randomCharacters(4),
    });

    await token.save();

    var emailSubject = "Password reset link";
    var emailText = `
    Hello ${user.name}\n\n 
    To reset your password, please enter the code below in the token field on Buddy\n
    ${token.token}
    `;

    // define the tranporter for sending emails
    const transporter = nodemailer.createTransport({
      host: process.env.NODE_MAILER_HOST,
      port: process.env.NODE_MAILER_PORT,
      auth: {
        user: process.env.NODE_MAILER_EMAIL,
        pass: process.env.NODE_MAILER_PASSWORD,
      },
    });

    // use our transporter to send the email to the user
    transporter.sendMail(
      {
        from: process.env.APP_NAME + "@gmail.com",
        to: email,
        subject: emailSubject,
        text: emailText,
      },
      (err) => {
        if (err) {
          const error = new Error("Something happened, please try again later");
          error.statusCode = 500;
          throw error;
        }

        res.status(201).json({
          message: "A password reset token has been sent to your email",
        });
      }
    );
  } catch (error) {
    next(error);
  }
};

const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const User = require("../../../models/user");
const Token = require("../../../models/token.js");
const { randomCharacters } = require("../../../utils/utils.js");

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

    // destruct the user data here
    const { name, email, password } = req.body;

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userDoc = new User({
      name: name,
      email: email,
      password: hashedPassword,
      isVerified: false,
    });

    // save the user to
    const savedUser = await userDoc.save();

    // setup a new token
    const token = new Token({
      userId: savedUser._id,
      token: randomCharacters(4),
    });

    const savedToken = await token.save();

    var emailSubject = "Account Verification Link";
    var emailText = `
    Hello ${name}\n\n 
    To verify your email, please enter the code below in the verification box in UniPassco\n
    ${savedToken.token}
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
          message: "A verification token has been sent to your email",
        });
      }
    );
  } catch (err) {
    next(err);
  }
};

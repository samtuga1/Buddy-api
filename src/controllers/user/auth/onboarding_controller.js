const User = require("../../../models/user.js");
const { validationResult } = require("express-validator");

module.exports = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new Error("Validation error");
      error.statusCode = 401;
      error.data = errors.array();
      throw error;
    }

    const { email, college } = req.body;

    // find user with the email provided
    const savedUserDoc = await User.findOne({ email: email });

    savedUserDoc.college = college;

    await savedUserDoc.save();

    return res.status(200).json({
      message: "Succuess",
    });
  } catch (err) {
    next(err);
  }
};

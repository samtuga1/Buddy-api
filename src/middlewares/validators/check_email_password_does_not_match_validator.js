const User = require("../../models/user");

module.exports = async (email, { req }) => {
  const savedUserDoc = await User.findOne({ email: email });

  if (!savedUserDoc) {
    return Promise.reject(
      "Could not find account associated with this email/password"
    );
  }
};

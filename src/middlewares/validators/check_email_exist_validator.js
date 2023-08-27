const User = require("../../models/user");

module.exports = async (email, { req }) => {
  return User.findOne({ email: email }).then((userDoc) => {
    // check if email is already existing
    if (userDoc) {
      return Promise.reject("Email address already exists, please login");
    }
  });
};

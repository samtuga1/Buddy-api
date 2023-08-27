const User = require("../../models/user");

module.exports = async (req, res, next) => {
  try {
    // get the userId save in the request from the authorization token
    const userId = req.userId;

    // get the user with the id
    const userDoc = await User.findById(userId);

    // handle error is user was not found
    if (!userDoc) {
      const error = Error("An error occured");
      error.statusCode = 404;
      error.data = "User not found";
      throw error;
    }

    res.status(200).json({
      user: userDoc.toObject(),
    });
  } catch (err) {
    next(err);
  }
};

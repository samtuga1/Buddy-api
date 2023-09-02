const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    // throw error if auth header is not set
    if (!authHeader) {
      const error = new Error("Not authenticated");
      error.statusCode = 401;
      throw error;
    }

    // split to get the authorization token
    const token = authHeader.split(" ")[1];

    // verify the token
    const decodedToken = jwt.verify(token, process.env.production.JWT_TOKEN);

    if (!decodedToken) {
      const error = new Error("Auth key is wrong");
      error.statusCode = 401;
      throw error;
    }

    req.userId = decodedToken.userId;
    req.programme = decodedToken.programme;
    next();
  } catch (err) {
    next(err);
  }
};

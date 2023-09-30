const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const User = require("../../../models/user.js");

module.exports = async (req, res, next) => {
  try {
    const { email } = req.body;

    const userDoc = await User.findOne({ email: email });

    if (!userDoc) {
      const error = new Error("Error");
      error.statusCode = 404;
      error.data = "User could not be found";
      throw error;
    }

    // Initialize Cloud Storage and get a reference to the service
    const firebaseStorage = getStorage();

    const storageRef = ref(
      firebaseStorage,
      `${process.env.BRANCH}/images/profiles/${userDoc._id}/photo`
    );

    // Create file metadata including the content type
    const metadata = {
      contentType: req.file.mimetype,
    };

    // Upload the file in the bucket storage
    const snapshot = await uploadBytesResumable(
      storageRef,
      req.file.buffer,
      metadata
    );

    // Grab the public url
    const downloadURL = await getDownloadURL(snapshot.ref);

    userDoc.photo = downloadURL;

    await userDoc.save();

    const jwtToken = jwt.sign(
      {
        userId: userDoc._id,
        school: userDoc.school,
        programme: userDoc.programme,
      },
      process.env.JWT_TOKEN
    );

    const userObject = { ...userDoc.toObject() };

    // avoid sending the password to the frontend
    delete userObject.password;

    res.status(201).json({
      user: userObject,
      token: jwtToken,
    });
  } catch (err) {
    next(err);
  }
};

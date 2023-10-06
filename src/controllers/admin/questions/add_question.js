const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const Question = require("../../../models/question");

module.exports = async (req, res, next) => {
  try {
    const { college, courseName, courseCode, school, level, year, semester } =
      req.body;

    if (
      !college ||
      !courseCode ||
      !courseName ||
      !school ||
      !level ||
      !year ||
      !semester ||
      !req.file
    ) {
      const error = new Error("All fields are required");
      error.statusCode = 401;
      throw error;
    }

    const mimetype = req.file.originalname.split(".").pop();

    let questionDoc = new Question({
      fileUrl: "",
      mimeType: mimetype,
      school: school,
      courseName: courseName,
      courseCode: courseCode,
      level: level,
      semester: semester,
      year: year,
      college: college,
    });

    questionDoc = await questionDoc.save();

    // Initialize Cloud Storage and get a reference to the service
    const firebaseStorage = getStorage();

    const storageRef = ref(
      firebaseStorage,
      `${process.env.BRANCH}/questions/${questionDoc._id}_${courseCode}`
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

    questionDoc.fileUrl = downloadURL;

    questionDoc = await questionDoc.save();

    res.status(201).json(questionDoc.toObject());
  } catch (error) {
    next(error);
  }
};

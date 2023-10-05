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

    const question = await Question.findOne({
      courseCode: { $regex: new RegExp(courseCode, "i") },
      year: { $regex: new RegExp(year, "i") },
      semester: { $regex: new RegExp(semester, "i") },
    });

    if (question) {
      const error = new Error("Question already exists in database");
      error.statusCode = 401;
      throw error;
    }

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

    // Initialize Cloud Storage and get a reference to the service
    const firebaseStorage = getStorage();

    const storageRef = ref(
      firebaseStorage,
      `${process.env.BRANCH}/questions/${courseCode}_${year}`
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

    const questionDoc = new Question({
      fileUrl: downloadURL,
      mimeType: mimetype,
      school: school,
      courseName: courseName,
      courseCode: courseCode,
      level: level,
      semester: semester,
      year: year,
      college: college,
    });

    await questionDoc.save();

    res.status(201).json(questionDoc.toObject());
  } catch (error) {
    next(error);
  }
};

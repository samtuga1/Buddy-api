const { Schema, model } = require("mongoose");

const question_schema = Schema(
  {
    fileUrl: {
      type: String,
      require: true,
    },
    mimeType: {
      type: String,
      require: true,
    },
    school: {
      type: String,
      default: "University of Ghana",
    },
    courseName: {
      type: String,
      require: true,
    },
    courseCode: {
      type: String,
      require: true,
    },
    level: {
      type: String,
      require: true,
    },
    semester: {
      type: String,
      default: null,
    },
    year: {
      type: String,
      default: null,
    },
    college: {
      type: String,
      require: true,
    },
    discussions: [
      {
        type: Schema.Types.ObjectId,
        ref: "discussion",
        default: [],
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("question", question_schema);

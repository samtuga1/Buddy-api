const { Schema, model } = require("mongoose");

const user_schema = Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    programme: {
      type: String,
      require: false,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    school: {
      type: String,
      default: "University of Ghana",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    bookmarkedQuestions: [
      {
        type: Schema.Types.ObjectId,
        default: [],
        ref: "question",
      },
    ],
  },
  { versionKey: false }
);

module.exports = model("user", user_schema);

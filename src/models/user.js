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
      default: "",
    },
    school: {
      type: String,
      default: "UG",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

module.exports = model("user", user_schema);

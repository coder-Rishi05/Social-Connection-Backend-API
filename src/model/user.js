const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true, // if this is not there mongoose will not allow insertion
      minLength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email address" + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password is not strong enough" + value);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://img.themesbrand.com/judia/users/user-dummy-img.jpg",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("not valid img src");
        }
      },
    },
    about: {
      type: String,
      default: "this is a default description of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "secretKey", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHashed = user.password;
  const ispasswordValid = await bcrypt.compare(passwordByUser, passwordHashed);
  return ispasswordValid;
};

const User = mongoose.model("user", userSchema);

module.exports = User;

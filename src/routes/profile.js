const express = require("express");
const bcrypt = require("bcrypt");
const userAuth = require("../middleware/auth.middleware");

const {
  validateProfileEditdata,
  validatePassword,
} = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    console.log(user);

    res.send(user);
  } catch (error) {
    console.log("server error", error);
    return res.send("Server error");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditdata(req)) {
      return res.status(400).send("Invalid Edit request");
    }
    console.log(req.body);

    const loggedInuser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInuser[key] = req.body[key]));

    await loggedInuser.save();

    console.log(loggedInuser);
    res.json({ message: "updated", data: loggedInuser });
  } catch (error) {
    res.send(error.message);
    console.log(error);
  }
});

profileRouter.patch("/profile/resetPassword", userAuth, async (req, res) => {
  try {
    if (!validatePassword(req)) {
      throw new Error("Invalid password");
    }

    const { password: newPassword } = req.body;
    console.log("new password", newPassword);
    // hash password

    const hashPassword = await bcrypt.hash(newPassword, 10);
    console.log("hashedPassword", hashPassword);

    const user = req.user; // old password
    console.log(user.password);

    user.password = hashPassword;

    await user.save();

    res.json({ message: "updated password", data: user });
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

module.exports = profileRouter;

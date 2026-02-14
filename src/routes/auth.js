const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const authRouter = express.Router();
const { validationSignUpData } = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    validationSignUpData(req);
    const { firstName, lastName, emailId, password,photoUrl } = req.body;

    // hashing password

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User({
      firstName,
      lastName,
      emailId,
      photoUrl,
      password: hashedPassword,
    });
    await user.save();
    res.send("user added sucessfully", user);
  } catch (error) {
    res.status(501).json({ message: error.message });
    console.log(error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Something went wrong");
    }
    const ispasswordValid = await user.validatePassword(password);

    if (ispasswordValid) {
     
      const token = await user.getJWT();

      res.cookie("jwtToken", token, {
        expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      });

      res.send("User login sucessfull");
    } else {
      throw new Error("invalid credentials");
    }
  } catch (error) {
    res.status(501).json({ message: error.message });
    console.log(error.message);
  }
});

authRouter.post("/logout", (req, res) => {

  res.cookie("jwtToken", null, {
    expires: new Date(Date.now()), // cookie will be removed after 8 hours be default
  });
  res.send("logout sucessfull");
});

module.exports = authRouter;

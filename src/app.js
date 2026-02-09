const express = require("express");
const Admin = require("./middleware/auth.middleware");
const app = express();
const connectDB = require("./config/db");

const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connnected sucessfully");
    app.listen(3000, () => {
      console.log(`serever running at port : 3000`);
    });
  })
  .catch((err) => {
    console.log("Database cant connected", err);
  });

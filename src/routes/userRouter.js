const express = require("express");
const userAuth = require("../middleware/auth.middleware");
const userRouter = express.Router();
const connectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

const userSafeData = "firstName lastName photoUrl";

userRouter.get("/user/request/recieved", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    console.log(loggedInUser);

    const connectionList = await connectionRequestModel
      .find({
        toUserId: loggedInUser._id,
        status: "intrested",
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "skills",
        "photoUrl",
        "gender",
      ]);

    res
      .status(201)
      .json({ message: "all the intrested users", data: connectionList });
  } catch (error) {
    return res
      .status(501)
      .json({ message: "Server error", error: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionList = await connectionRequestModel
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "accepted" },
          { fromUserId: loggedInUser._id, status: "accepted" },
        ],
      })
      .populate("fromUserId", userSafeData)
      .populate("toUserId", userSafeData);

    const data = connectionList.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }

      return row.fromUserId;
    });

    res.send(data);
  } catch (error) {
    return res.send(error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 10 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await connectionRequestModel
      .find({
        $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
      })
      .select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    console.log(hideUsersFromFeed);

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(userSafeData)
      .skip(skip)
      .limit(limit);

    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

module.exports = userRouter;

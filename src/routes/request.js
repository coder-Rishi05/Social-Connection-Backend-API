const express = require("express");
const userAuth = require("../middleware/auth.middleware");
const requestRouter = express.Router();
const connectionRequestModel = require("../model/connectionRequest");
const User = require("../model/user");

requestRouter.post("/sendReq/:status/:touserId", userAuth, async (req, res) => {
  try {
    const allowedStatus = ["ignored", "intrested"];

    const fromUserId = req.user._id; // loggin user
    const toUserId = req.params.touserId;
    const status = req.params.status;

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "invalid status type", status });
    }

   
    const toReq = await User.findById(toUserId);
    if (!toReq) {
      return res.status(404).json({ message: "User not exist" });
    }


    const existingConnection = await connectionRequestModel.findOne({
      $or: [
        { toUserId, fromUserId },
        {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      ],
    });

    if (existingConnection) {
      return res
        .status(400)
        .send({ message: "Connection request Already Exists" });
    }

    const coonnectionRequest = new connectionRequestModel({
      fromUserId,
      toUserId,
      status,
    });
    const data = await coonnectionRequest.save();
    res.json({ message: `request sent to ${toReq.firstName}`, user: data });
  } catch (error) {
    console.log(error.message);
    res.send(error.message);
  }
});

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInuser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status not valid" });
      }

      // check request id present in database or not.
      //  i am finding the request in database which have status intrested
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInuser._id,
        status: "intrested",
      });

      //
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "connection request not found" });
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();

      console.log(loggedInuser);
      res.json({ message: "connection request " + status, data });
    } catch (error) {
      console.log(error.message);
      return res.send(error.message);
    }
  },
);

module.exports = requestRouter;


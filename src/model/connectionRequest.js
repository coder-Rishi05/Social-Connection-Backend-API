const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // refrence to the user collection
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["ignored", "intrested", "accepted", "rejected"],
      message: `{VALUE} is not correct status type`,
    },
  },
  { timestamps: true },
);


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }); 

connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("You can't send connection request to yourself");
  }
});

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);

module.exports = connectionRequestModel;

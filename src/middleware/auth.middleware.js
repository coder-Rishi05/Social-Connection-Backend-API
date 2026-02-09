const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userAuth = async (req, res, next) => {
  try {
    // read the token from the req cookies
    const { jwtToken } = req.cookies;

    if (!jwtToken) {
      throw new Error("invalid token");
    }

    //  and validate the token
    const decodedObj = await jwt.verify(jwtToken, "secretKey");

    const { _id } = decodedObj;

    // and find the user
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found");
    }
    
// sending user in req body.
    req.user = user;

    next();
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = userAuth;

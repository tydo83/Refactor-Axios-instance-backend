const jwt = require("jsonwebtoken");

const Friend = require("../model/Friend");
const User = require("../../users/Model/User");
const mongoDBErrorHelper = require("../../lib/mongoDBErrorHelper");

const createFriend = async (req, res) => {
  // console.log(req.headers);

  try {
    const { firstName, lastName, mobileNumber, nickName } = req.body;

    const newFriend = new Friend({
      firstName,
      lastName,
      mobileNumber,
      nickName,
    });

    const savedNewFriend = await newFriend.save();

    //const targetUser = await User.findOne({ email: req.user.email });
    let jwtToken = req.headers.authorization.slice(7);

    let decodedJWT = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

    const targetUser = await User.findOne({ email: decodedJWT.email });

    targetUser.friends.push(savedNewFriend._id);

    await targetUser.save();

    res.json(savedNewFriend);
  } catch (e) {
    res.status(500).json(mongoDBErrorHelper(e));
  }
};

const getAllFriends = async (req, res) => {
  try {
    let jwtToken = req.headers.authorization.slice(7);

    let decodedJWT = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

    let payload = await User.findOne({ email: decodedJWT.email })
      .populate({
        path: "friends",
        model: Friend,
        select: "-__v",
      })
      .select("-email -password -firstName -lastName -__v -_id");

    res.json(payload);
  } catch (e) {
    res.status(500).json(mongoDBErrorHelper(e));
  }
};

module.exports = {
  createFriend,
  getAllFriends,
};

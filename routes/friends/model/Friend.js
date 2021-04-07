const mongoose = require("mongoose");

const FriendSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: true,
  },
  nickName: {
    type: String,
    trim: true,
    required: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = mongoose.model("friend", FriendSchema);

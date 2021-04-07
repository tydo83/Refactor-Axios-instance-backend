var express = require("express");
var router = express.Router();
const {
  createFriend,
  getAllFriends,
} = require("./controller/friendsController");
const { checkIsUserHaveValidJwtToken } = require("../lib/authChecker");

/* GET home page. */
router.get("/get-all-friends", checkIsUserHaveValidJwtToken, getAllFriends);

router.post("/create-friend", checkIsUserHaveValidJwtToken, createFriend);

module.exports = router;

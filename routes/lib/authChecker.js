const jwt = require("jsonwebtoken");
const mongoDBErrorHelper = require("./mongoDBErrorHelper");

const checkIsUserHaveValidJwtToken = async (req, res, next) => {
  try {
    // console.log(req.headers);
    if (req.headers && req.headers.authorization) {
      let jwtToken = req.headers.authorization.slice(7);

      let decodedJWT = jwt.verify(jwtToken, process.env.JWT_VERY_SECRET);

      if (decodedJWT) {
        //req.user = { email: decodedJWT.email };

        next();
      }
    } else {
      throw { message: "You don't have permission" };
    }
  } catch (e) {
    res.status(500).json(mongoDBErrorHelper(e));
  }
};

module.exports = {
  checkIsUserHaveValidJwtToken,
};

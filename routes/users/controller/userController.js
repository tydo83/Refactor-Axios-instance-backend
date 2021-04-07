const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const User = require("../Model/User");
const mongoDBErrorHelper = require("../../lib/mongoDBErrorHelper");

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(10);
      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      let createdUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
      });

      let savedUser = await createdUser.save();

      res.json({
        data: savedUser,
      });
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
      // res.status(500).json({
      //   message: e.message,
      // });
    }
  },
  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw { message: "Email is not registered, please go sign up!" };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw { message: "Check your email and password!" };
      } else {
        let jwtToken = jwt.sign(
          {
            email: foundUser.email,
          },
          process.env.JWT_VERY_SECRET,
          { expiresIn: "1d" }
        );

        res.json({
          jwtToken: jwtToken,
        });
      }
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },
  updateUserPassword: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw { message: "User not found!!!!" };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.oldPassword,
        foundUser.password
      );

      if (!comparedPassword) {
        throw { message: "Cannot update your password, check again" };
      }

      let salted = await bcrypt.genSalt(10);
      let hashedNewPassword = await bcrypt.hash(req.body.newPassword, salted);

      await User.findOneAndUpdate(
        { email: req.body.email },
        { password: hashedNewPassword },
        { new: true }
      );

      res.json({
        message: "success",
        payload: true,
      });
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },
  sendSMSTwilio: async (req, res) => {
    try {
      let sentSMS = await client.messages.create({
        body: `Hey ${req.body.targetUser.nickName},I found this cool movie called ${req.body.title} and here's the plot: ${req.body.plot}. Here's the imdb link: https://www.imdb.com/title/${req.body.imdbID}/
        `,
        from: "+12018179008",
        to: "+19176261808", //req.body.targetUser.mobileNumber We are not using the paid version so we can't send text to a real friend
      });

      res.json(sentSMS);
    } catch (e) {
      res.status(500).json(mongoDBErrorHelper(e));
    }
  },
};

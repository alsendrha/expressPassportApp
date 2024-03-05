const express = require("express");
const usersRouter = express.Router();
const passport = require("passport");
const User = require("../models/users.model");
const sendMail = require("../mail/mail");
usersRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.json({ msg: info });
    }

    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
});

usersRouter.post("/logout", (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

usersRouter.post("/signup", async (req, res) => {
  // user 객체를 생성
  const user = new User(req.body);

  // user 컬렉션에 유저를 저장
  try {
    await user.save();

    sendMail("alsendrha@gmail.com", "민영", "welcome");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
  }
});

usersRouter.get("/google", passport.authenticate("google"));
usersRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);

usersRouter.get("/kakao", passport.authenticate("kakao"));
usersRouter.get(
  "/kakao/callback",
  passport.authenticate("kakao", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })
);
module.exports = usersRouter;

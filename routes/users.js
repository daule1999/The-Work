var express = require("express");
const bodyparser = require("body-parser");
var User = require("../models/User");
var session = require("express-session");
var FileStrore = require("session-file-store")(session);

var router = express.Router();
router.use(bodyparser.json());
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});
router.post("/signup", (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user != null) {
        var err = new Error("User " + req.body, username + " already exists");
        err.status = 403;
        next(err);
      } else {
        return User.create({
          username: req.body.username,
          password: req.body.password,
        });
      }
    })
    .then(
      (user) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ status: "Registration Successful", user: user });
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});
router.get("/signup",(req, res, next)=>{
  res.send(`for signing up , you must make a post request`);

})
router.post("/login", (req, res, next) => {
  console.log("Enter usename and password to login " + "req.session.user");
  if (!req.session.user) {
    console.log(`!req.session.user)  `);
    console.log(`"You are not Authenticated " + ${req.headers.authorization}`);
    console.log(`headers authorization + ${req.headers}`);
    var authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log(
        `"You are not Authenticated " + ${req.headers.authorization}`
      );
      var err = new Error(
        "You are not Authenticated " + req.headers.authorization
      );
      res.setHeader("WWW-Authenticate", "Basic");
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(" ")[1], "base64")
      .toString()
      .split(":");
    var username = auth[0];
    var password = auth[1];
    User.findOne({ username: username })
      .then((user) => {
        if (user === null) {
          console.log(`"User " + ${username} + " doesnot exists"`);
          var err = new Error("User " + username + " doesnot exists");
          err.status = 403;
          return next(err);
        } else if (user.password !== password) {
          console.log(`Password is Incorrect`);
          var err = new Error(`Password is Incorrect`);
          err.status = 403;
          return next(err);
        } else if (user.username === username && user.password === password) {
          console.log(req.session.user);
          req.session.user = "authenticated";
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/plain");
          res.end("Authenticated..");
        } else {
          console.log(`You are not  Authenticated kindly register first`);
          var err = new Error(
            "You are not  Authenticated kindly register first"
          );
          res.setHeader("WWW-Authenticate", "Basic");
          err.status = 401;
          return next(err);
        }
      })
      .catch((err) => next(err));
  } else {
    console.log("You are already authenticated");
    res.statusCode = 200;
    res.setHeader("content-Type", "text/plain");
    res.end("You are already authenticated");
  }
});
router.get("/login",(req, res, next)=>{
  res.send(`for login , you must make a post request`);
})
router.get("/logout", (req, res, next) => {
  console.log("Logging out ....");
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.redirect("/");
  } else {
    var err = new Error("You are not loggged in");
    console.log(`var err = new Error("You are not loggged in"); 92`);
    err.status = 403;
    next(err);
  }
});
module.exports = router;

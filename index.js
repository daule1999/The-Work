var express = require('express')
const mongoose = require('mongoose');
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var session = require("express-session");
var FileStrore = require("session-file-store")(session);
var app = express()
const port=5002;
const hostname="localhost";
const mongoUser="bhola";
const mongoUserPassword="9204387385dD";
const url = "mongodb://localhost:27017/exerciseTracker";
const cloudUrl=`mongodb+srv://${mongoUser}:${mongoUserPassword}@cluster0.onnef.mongodb.net/Work?retryWrites=true&w=majority`;
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

const connect = mongoose.connect(cloudUrl, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.then(
  (db) => {
    console.log("Connected correctly to MongoDB server");
  },
  (err) => {
    console.log(err);
  }
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("12345-67890-09876-54321"));
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStrore(),
  })
);
app.use("/", indexRouter);
app.use("/users", usersRouter);
const auth = (req, res, next) => {
  console.log(req.session);
  console.log(req.session.user);
  if (!req.session.user) {
    console.log("You are not authentictade 59 app.js");
    var err = new Error("You are not 61 authenticated!");
    err.status = 403;
    return next(err);
  } else {
    if (req.session.user === "authenticated") {
      console.log("You are authenticated 65 app.js");
      next();
    } else {
      console.log("You are not authenticated!  68 app.js");
      var err = new Error("You are not authenticated!");
      err.status = 403;
      return next(err);
    }
  }
}
app.use(auth);

app.listen(3000,()=>{
    console.log(`Server running at http://${hostname}:${port}`)
})
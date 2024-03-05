const express = require("express");
const { default: mongoose } = require("mongoose");
const path = require("path");

const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");

const config = require("config");
const mainRouter = require("./routes/main.router");
const usersRouter = require("./routes/users.router");
const serverConfig = config.get("server");

require("dotenv").config();

app.use(
  cookieSession({
    name: "cooke-session-name",
    keys: [process.env.COOKIE_ENCRYPTION_KEY],
  })
);

app.use(function (req, res, next) {
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

//view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/", mainRouter);
app.use("/auth", usersRouter);

const port = serverConfig.port;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

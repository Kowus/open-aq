require("dotenv").config();
const express = require("express"),
    path = require("path"),
    favicon = require("serve-favicon"),
    logger = require("morgan"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    env = require("./lib/env"),
    session = require("express-session"),
    flash = require("connect-flash"),
    compression = require("compression"),
    redis = require("redis").createClient(env.redis.url, {
        no_ready_check: true
    }),
    RedisStore = require("connect-redis")(session),
    helmet = require("helmet");
let mongoose = require("mongoose");

mongoose.Promise = require("bluebird");
mongoose.connect(env.database.url, {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 2000
});

var index = require("./routes/index");

var app = express();
app.use(helmet());
app.use(compression());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
require("./config/passport")(passport);
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    session({
        resave: false,
        saveUninitialized: true,
        secret: env.session.secret,
        store: new RedisStore({ client: redis })
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    res.locals.message =
        req.flash("signupMessage") || req.flash("loginMessage") || null;
    next();
});

app.use("/", index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error =
        req.app.get("env") === "development"
            ? err
            : {
                  status: err.status || 500,
                  message: err.message || "Not Found.",
                  stack: `Requested resource not found: ${req.url}`
              };
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

// Mongoose Defaults
mongoose.connection.on("connected", function() {
    console.log("Mongoose default connection connected");
});
mongoose.connection.on("error", function(err) {
    console.log("Mongoose default connection error:" + err);
});
mongoose.connection.on("disconnected", function() {
    console.log("Mongoose default connection disconnected");
});
process.on("SIGINT", function() {
    mongoose.connection.close(function() {
        console.log(
            "Mongoose default connection disconnected on app termination"
        );
        process.exit(0);
    });
});

// Redis Error Handler
redis.on("error", err => {
    console.log(`Redis default connection error: ${err}`);
});

module.exports = app;

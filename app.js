const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const savestateRouter = require("./routes/savestateRoutes");
const viewRouter = require("./routes/viewRoutes");
const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") res.redirect(`https://${req.header("host")}${req.url}`);
    else next();
  });
}
//Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'", "https:", "http:", "blob:", "'unsafe-inline'"],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
        workerSrc: ["'self'", "data:", "blob:"],
        childSrc: ["'self'", "blob:"],
        imgSrc: ["'self'", "data:", "blob:"],
        formAction: ["'self'", "https://formspree.io"],
        connectSrc: ["'self'", "'unsafe-inline'", "data:", "blob:", "https://formspree.io"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

//DEV logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same IP
const generalLimiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
const postLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many POST requests from this IP, please try again in an hour",
});
app.use("/api", generalLimiter);
app.use("/api/*", postLimiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "50kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
app.use(compression());

//ROUTES
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/savestates", savestateRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;

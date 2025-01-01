if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressErrors = require("./utils/ExpressErrors");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const listingsRouter = require("./routes/listing");
// const reviews = require("./routes/review");  // Corrected 'reveiws' to 'reviews'
const reviewRouter = require("./routes/reveiw");
const userRouter = require("./routes/user");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const app = express();

const PORT = 8080;

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
const db_url = process.env.ATLAS_URL;

// console.log(process.env.SECRATE) // remove this after you've confirmed it is working


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db_url);
}

const store = MongoStore.create({
  mongoUrl:db_url,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
})

store.on("error",()=>{
  console.log("ERROR in mongo session store",err);
})
const sessionOption={
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
}

// Set up view engine and views directory
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/assets")));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(flash()); 
app.use(session(sessionOption));
// passport is used for authentication of user this is the node js compartible library
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null; // Ensure currUser is set even if not logged in
  next();
});



// Use separate routes for listings and reviews
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter); // Mount the reviews route with id parameter
app.use("/",userRouter);

// Add this route before `app.all("*")`
app.get("/", (req, res) => {
  res.redirect("/listings"); // Redirect to the listings index page
});

// Page not found error
app.all("*", (req, res, next) => {
  next(new ExpressErrors(404, "Page not found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something is wrong!" } = err;
  res.status(statusCode).render("Error.ejs", { message });
});

app.listen(PORT, () => {
  console.log("Server running on PORT", PORT);
});

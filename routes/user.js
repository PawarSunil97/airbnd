const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
//  signup page
const userControllers = require("../controllers/user");
router.route("/signup")
.get(userControllers.renderSinupUsers)
.post(wrapAsync(userControllers.sinupUser));

// login page
router.route("/loginuser")
.get(userControllers.renderLoginForm)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/loginuser",
    failureFlash: true,
  }),
  userControllers.loginForm
);

router.get("/logout", userControllers.logOutUser);
module.exports = router;

const User = require("../models/user");
module.exports.renderSinupUsers = (req, res) => {
  res.render("users/user");
};

module.exports.sinupUser = async (req, res) => {
  let { username, email, password } = req.body;

  // Check if password is provided
  if (!password) {
    req.flash("error", "Password is required");
    return res.redirect("/signup");
  }

  try {
    const newUser = new User({ username, email });

    // Register user using passport-local-mongoose's register method
    const registedUser = await User.register(newUser, password);
    console.log(registedUser);
    // Flash success message
    req.login(registedUser, function (err) {
      if (err) {
        return next(err);
      }

      req.flash("success", "User registered successfully!");

      // Redirect to listings page after successful registration
      res.redirect("/listings");
    });
  } catch (err) {
    // Flash error message in case of any issue (e.g., user already exists)
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginForm = async (req, res) => {
  // res.redirect('/login');
  req.flash("success", "welcome to wendulust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logOutUser = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      next(err);
    } else {
      req.flash("success", "you are successfully loged out");
      res.redirect("/listings");
    }
  });
};

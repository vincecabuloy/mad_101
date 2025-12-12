const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const requireLogin = require("../middleware/requireLogin");

router.get("/", requireLogin, async (req, res) => {
  const users = await User.find({}, "username createdAt");
  //res.render("users", { users });
  res.json(users);
});

router.get("/register", (req, res) => {
  res.render("register", {
    errors: null,
    values: { username: "", password: "" },
  });
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const errors = {};

  if (!username || username.trim() === "") {
    errors.username = { message: "Username is required" };
  }

  if (!password || password.trim() === "") {
    errors.password = { message: "Password is required" };
  } else if (password.length < 6) {
    errors.password = { message: "Password must be at least 6 characters" };
  }

  if (Object.keys(errors).length > 0) {
    return res.render("register", {
      errors,
      values: req.body,
    });
  }

  try {
    if (await User.findOne({ username })) {
      return res.render("register", {
        errors: { username: { message: "Username already exists" } },
        values: req.body,
      });
    }
    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      password: hashed,
    });

    req.session.userId = newUser._id;
    res.redirect("/users");
  } catch (error) {
    res.render("register", {
      errors: { general: { message: "Registration failed" } },
      values: req.body,
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login", { error: "", values: { username: "", password: "" } });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.render("login", {
      error: "Username is required",
      values: req.body,
    });
  }

  if (!password) {
    return res.render("login", {
      error: "Password is required",
      values: req.body,
    });
  }

  try {
    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      req.session.userId = user._id;
      return res.redirect("/users");
    }

    res.render("login", {
      error: "Invalid username or password",
      values: req.body,
    });
  } catch (error) {
    res.render("login", {
      error: "Login failed",
      values: req.body,
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/users/login"));
});
module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

function redirectIfLoggedIn(req, res, next) {
    if (req.session.userId) {
        return res.send("You are already logged in. Please logout first.");
    }
    next();
}

function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    next();
}

router.get('/register', redirectIfLoggedIn, (req, res) => {
    res.render('register');
});

router.get('/login', redirectIfLoggedIn, (req, res) => {
    res.render('login');
});

router.post('/register', redirectIfLoggedIn, async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        req.session.userId = user._id;
        res.redirect('/user');
    } catch (err) {
        console.error(err);
        res.send("Error registering user");
    }
});

router.post('/login', redirectIfLoggedIn, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user._id;
        res.redirect('/user');
    } else {
        res.send("Invalid credentials");
    }
});

router.get('/user', requireLogin, (req, res) => {
    res.send("Welcome");
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error logging out");
        res.redirect('/login');
    });
});

module.exports = router;
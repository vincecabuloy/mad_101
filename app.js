const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const authRoutes = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb');

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: "secretkey123",
    resave: false,
    saveUninitialized: false
}));

app.use(authRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(3000, () =>
    console.log("Server running at http://localhost:3000")
);
const express = require("express");
const connectDB = require("./db/connection");
const session = require("express-session");

const app = express();
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mysupersecretkey",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("view engine", "ejs");


const authRoutes = require("./routes/authRoutes");
app.use("/users", authRoutes);


app.get("/", (req, res) => {
  res.redirect("/users/");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000/");
});

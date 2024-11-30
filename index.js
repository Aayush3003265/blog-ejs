const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const { all } = require("moongose/routes");
const app = express();
const PORT = 8001;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

mongoose.connect("mongodb://localhost:27017/blogs").then((e) => {
  console.log("mongo db connected successfully");
});

app.use(express.urlencoded({ extended: false })); //middleware to handle form data
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  // console.log(allBlogs);
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`connected and server started at PORT ${PORT}`);
});

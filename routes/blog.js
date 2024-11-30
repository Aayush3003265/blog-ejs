const { Router } = require("express");
const multer = require("multer");
const Blog = require("../models/blog");
const path = require("path");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});
router.post("/", upload.single("coverImage"), async (req, res) => {
  try {
    const { title, body } = req.body;

    if (!req.file) {
      throw new Error("File upload failed.");
    }

    const createBlog = await Blog.create({
      body,
      title,
      createdBy: req.user._id,
      coverImageUrl: `uploads/${req.file.filename}`,
    });

    return res.redirect(`/blog/${createBlog._id}`);
  } catch (error) {
    console.error("Error creating blog:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

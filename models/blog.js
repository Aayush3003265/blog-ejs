const { Schema, model } = require("mongoose");
const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId, //builtin type
      ref: "user",
    },
  },
  { timestamps: true }
);

const Blog = model("blog", blogSchema);
module.exports = Blog;

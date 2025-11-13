import mongoose, { model, models } from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  shortDescription: String,
  imageUrl: String,
  content: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
});

const Blog =  models.Blog || model("Blog", BlogSchema);

export default Blog;

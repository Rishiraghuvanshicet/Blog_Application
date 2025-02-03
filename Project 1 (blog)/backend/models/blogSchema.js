const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const blogSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [
    {
      text: {
        type: String,
        required: true,
      },
      createAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;

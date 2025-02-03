const Blog = require("../models/blogSchema");

//Comment Post
const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      alert("Blog post not found");
      console.log('post found')
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (!blog.comments) {
      blog.comments = [];
    }

    const newComment = {
      text,
      createAt: new Date(),
    };
    blog.comments.push(newComment);
    await blog.save();
    res.status(200).json({ blog });
  } catch (error) {
    console.error("Error adding comment:", error); 
    res
      .status(500)
      .json({ message: "Error adding comment", error: error.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;

    const post = await Blog.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const commentIndex = post.comments.findIndex(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    post.comments.splice(commentIndex, 1);

    await post.save();
    res
      .status(200)
      .json({ message: "Comment deleted successfully", blog: post });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addComment, deleteComment };

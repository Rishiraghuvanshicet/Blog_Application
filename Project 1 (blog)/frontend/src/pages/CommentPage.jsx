import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, TextField, Button, Box, Card, CardMedia } from "@mui/material";

function CommentPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);  

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/user/posts/comment/${id}`);
        setBlog(response.data.blog);
        // Ensure comments is always an array
        setComments(response.data.blog.comments || []);
      } catch (error) {
        console.error("Error fetching the blog post:", error);
      }
    };

    fetchBlogPost();
  }, [id]);


const handleCommentSubmit = async () => {
    if (!commentText) return;
    try {
      console.log("Submitting comment with text:", commentText);  // Log the comment text
      const response = await axios.post(`http://localhost:3000/api/user/posts/comment/${id}`, {
        text: commentText,
      });
      setComments(response.data.blog.comments || []);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error); 
      if (error.response) {
        console.error("Backend error message:", error.response.data.message);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/posts/comment/${id}/${commentId}`);
      setComments(comments.filter(comment => comment._id !== commentId));
      console.log('Comment deleted:', response.data);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  if (!blog) {
    return <div>Loading...</div>;
  }
  const imageUrl = blog.imageUrl ? `http://localhost:3000${blog.imageUrl}` : null;

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card sx={{ padding: 3 }}>
        {imageUrl && (
          <CardMedia
            sx={{
              width: 400,
              height: 150,
              objectFit: "cover",
              margin: "0 auto",
              boxShadow: "5px 2px 5px 2px rgb(0 0 0/ 0.6)",
            }}
            image={imageUrl}
            title={blog.title}
          />
        )}
        <Typography variant="h4" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          By: {blog.email}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", marginTop: 2 }}>
          {blog.content}
        </Typography>
      </Card>

      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h6">Comments</Typography>
        <Box>
          {/* Ensure that comments is always an array before calling .map */}
          {Array.isArray(comments) && comments.map((comment) => (
            <Box key={comment._id} sx={{ marginBottom: 2 }}>
              <Typography variant="body2">{comment.text}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {new Date(comment.createAt).toLocaleString()}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Button color="danger" onClick={() => handleDeleteComment(comment._id)}>Delete</Button>
              </Box>
            </Box>
          ))}
        </Box>

        <TextField
          label="Add a Comment"
          variant="outlined"
          fullWidth
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          sx={{ marginTop: 2 }}
        />
        <Button variant="contained" onClick={handleCommentSubmit} sx={{ marginTop: 2 }}>
          Submit Comment
        </Button>
      </Box>
    </Container>
  );
}

export default CommentPage;

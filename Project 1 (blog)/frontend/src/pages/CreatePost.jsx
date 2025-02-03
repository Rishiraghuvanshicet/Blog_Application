import React, { useState, useContext } from "react";
import { Box, TextField, Typography, Button, FormControl, Container } from "@mui/material";
import axios from "axios"; // For handling the API request
import { useNavigate } from "react-router-dom";
import AlertSuccess from "../components/AlertSuccess";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import AddImageIcon from "../components/AddImageIcon";
import { DataContext } from "../context/DataProvider";

const CreatePost = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageUrl: null,
    email: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // Track loading state

  const { account } = useContext(DataContext);

  const handleCreateClick = async () => {
    // Validate that title and content are present
    if (!post.title || !post.content) {
      setError("Title and Content are required!");
      return;
    }

    // Handle image validation (optional)
    if (post.imageUrl && !["image/jpeg", "image/png", "image/jpg"].includes(post.imageUrl.type)) {
      setError("Invalid image format. Only .jpg, .jpeg, and .png are allowed.");
      return;
    }

    const formData = new FormData();
    formData.append("title", post.title);
    formData.append("content", post.content);
    formData.append("email", account.email);

    if (post.imageUrl) {
      formData.append("image", post.imageUrl);
    }

    setLoading(true); // Start loading

    try {
      const response = await axios.post("http://localhost:3000/api/user/create/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccess(true);
      setPost({
        title: "",
        content: "",
        imageUrl: null,
      });
      setError(null);
      setTimeout(() => {
        setSuccess(false); // Hide success message after 2 seconds
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again later.");
    } finally {
      setLoading(false); // End loading
    }
  };

  const handlePostInput = (e) => {
    const { name, value } = e.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost((prev) => ({
        ...prev,
        imageUrl: file,
      }));
    }
  };

  return (
    <div>
      <NavBar />
      <Banner />
      <Container maxWidth="xl" sx={{ boxShadow: 3, mt: 2, marginBottom: "10px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "auto",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Typography variant="h2" color="success" sx={{ fontFamily: "times new roman" }}>
            Upload Post
          </Typography>
        </Box>

        {error && (
          <Box sx={{ color: "red", textAlign: "center", marginTop: "10px" }}>
            <Typography>{error}</Typography>
          </Box>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "20px", gap: "10px" }}>
          <FormControl>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
              <label htmlFor="fileInput">
                <AddImageIcon />
              </label>
              <TextField
                type="file"
                id="fileInput"
                onChange={handleImageChange}
                sx={{ display: "none" }}
              />
            </Box>
          </FormControl>
          <TextField
            variant="standard"
            label="Post Name"
            name="title"
            onChange={handlePostInput}
            value={post.title}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "20px" }}>
          <TextField
            label="Post Content"
            sx={{ width: "80%" }}
            multiline
            rows={4}
            name="content"
            value={post.content}
            onChange={handlePostInput}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "20px" }}>
          <Button
            variant="contained"
            color="success"
            sx={{ padding: "10px 20px" }}
            onClick={handleCreateClick}
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </Box>

        <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
          {success && <AlertSuccess />}
        </Box>
      </Container>
    </div>
  );
};

export default CreatePost;

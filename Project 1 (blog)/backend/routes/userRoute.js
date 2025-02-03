const express = require("express");
const { userRegister, userLogin, userDetail, userLogout } = require("../controller/userController");
const { createPost, getAllPost, getPost } = require("../controller/postController");
const { addComment, deleteComment } = require("../controller/CommentController");
const router = express.Router();
const upload = require("../multerConfig");
const { likePost } = require("../controller/likeController");
const { isAuth } = require("../middleware/isAuth");

console.log(userRegister, userLogin, userDetail, userLogout); 
// User routes
router.post("/register", userRegister); // No need for authentication
router.post("/login", userLogin); // No need for authentication

router.get('/getDetail/:id', userDetail); // No need for authentication

// Post routes (protected)
router.get("/create/post", getAllPost); // No need for authentication, unless you want to restrict post viewing
router.get("/posts/comment/:id", getPost); // No need for authentication

// Protecting the post creation, like, and comment routes with isAuth
router.post("/create/post", upload.single("image"), createPost); // Protected
router.post("/like/:postId", likePost); // Protected

// Protecting comment routes
router.post("/posts/comment/:id",  addComment); // Protected
router.delete('/posts/comment/:id/:commentId',  deleteComment); // Protected

//LogOut
router.post("/logout", userLogout); 

module.exports = router;

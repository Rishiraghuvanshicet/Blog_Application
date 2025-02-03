import React, { useContext, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../context/DataProvider";

const Login = ({setAuthentication}) => {
  const {setAccount}=useContext(DataContext)
  const navigate = useNavigate();
  const imageUrl =
    "https://imgs.search.brave.com/fIm5bOiZZ_QVg9Zs19lNNtQWBTFTm8NSLe9Nfbd_Kfw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzLzYxLzdj/Lzg0LzYxN2M4NGNi/ZWJiMThkY2JjNzQ0/YzljNDczZDAxYjcz/LmpwZw";

  const [signinDetail, setSigninDetail] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        signinDetail
      );
      if (response.status === 200) {
        sessionStorage.setItem('accessToken', `Bearer ${response.data.data.accessToken}`);
        sessionStorage.setItem('refreshToken', `Bearer ${response.data.data.refreshToken}`);    
        setAccount({email:response.data.email,name:response.data.name});
        setAuthentication(true);
        navigate("/");
      } else {
        alert("Unexpected response: " + response.status);
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Something went wrong"}`);
      } else if (error.request) {
        alert("Network error. Please try again.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }

    // Clear form fields after login attempt
    setSigninDetail({
      email: "",
      password: "",
    });
  };

  const handleCreateAccount = () => {
    navigate("/register");
  };

  const handleSignInput = (e) => {
    const { name, value } = e.target;
    setSigninDetail((prev) => ({
      ...prev,
      [name]: value, // Dynamically update the state
    }));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Box
        sx={{
          width: "400px",
          margin: "auto",
          boxShadow: "5px 2px 5px 2px rgb(0 0 0/ 0.6)",
        }}
      >
        <img
          src={imageUrl}
          alt="login"
          style={{
            width: "200px",
            margin: "auto",
            display: "flex",
            padding: "50px 0 0",
          }}
        />
        <Box
          sx={{
            padding: "25px 35px",
            display: "flex",
            flexDirection: "column",
            margin: "auto",
            marginTop: "20px",
          }}
        >
          <TextField
            variant="standard"
            label="Email"
            name="email" // Corrected to match the state key
            value={signinDetail.email} // Use `signinDetail.email` instead of `signinDetail.username`
            onChange={handleSignInput}
            fullWidth
            margin="normal"
          />
          <TextField
            variant="standard"
            label="Password"
            name="password" // Corrected to match the state key
            value={signinDetail.password}
            onChange={handleSignInput}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              bgcolor: " #d500f9",
              color: "#c6ff00",
              fontFamily: "times new roman",
              marginTop: "20px",
            }}
          >
            Login
          </Button>
          <Typography
            variant="h6"
            style={{ textAlign: "center", padding: "20px" }}
          >
            OR
          </Typography>
          <Button
            variant="text"
            onClick={handleCreateAccount}
            sx={{
              bgcolor: " #d500f9",
              color: "#c6ff00",
              fontFamily: "times new roman",
            }}
          >
            Create an Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;

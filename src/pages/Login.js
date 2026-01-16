import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  InputAdornment,
} from "@mui/material"; // Import MUI components
import loginBg from "../assets/login-bg.webp";
import logo from "../assets/TRMS.png";
import { loginUser } from "../auth"; // Import the login function
import { useAppContext } from "../contexts/ContextProvider"; // Import useAppContext hook
import { toast } from "react-toastify"; // Import toast from react-toastify
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import CircularProgress from "@mui/material/CircularProgress";

import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// State variables for username and password inputs
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Get the login function from context
  const { login } = useAppContext();
  const notify = () => toast.success("Login successful!");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoggingIn(true); // start loading

    try {
      const response = await loginUser(username, password);

      if (response && response.token) {
        login(response.user, response.token);
        toast.success("Login successful!"); // This is okay since it's on success

        if (response.user.user_role === "guard") {
          navigate("/PassSlipInterface");
        } else {
          navigate("/approving-home");
        }
      }
      // No need for else block — loginUser already handles failure toasts
    } catch (error) {
      console.error("Login failed:", error);
      // No alert or toast here either
    } finally {
      setIsLoggingIn(false); // stop loading
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      <Container
        className="login-form"
        style={{ position: "relative", overflow: "visible" }} // make container the relative parent
      >
        <IconButton
          aria-label="back"
          onClick={() => navigate("../")}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#424242",
            zIndex: 1000,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 1)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        <img src={logo} alt="Logo" className="login-logo" />
        <Typography variant="h5" className="login-title">
          Welcome to
        </Typography>
        <Typography variant="h5" className="login-bold-text">
          Travel Order and Official Business
        </Typography>
        <Typography variant="h5" className="login-subtitle">
          (TO/OB) System
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField //username field
            fullWidth
            margin="normal"
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="text-field"
            InputLabelProps={{ 
              required: false, 
              style: { color: "#424242", fontWeight: 500 } 
            }}
            InputProps={{ 
              style: { color: "#212121" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                "& fieldset": { 
                  borderColor: "#e0e0e0",
                  borderWidth: "2px",
                },
                "&:hover fieldset": { 
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": { 
                  borderColor: "#1976d2",
                  borderWidth: "2px",
                },
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="text-field"
            InputLabelProps={{ 
              required: false, 
              style: { color: "#424242", fontWeight: 500 } 
            }}
            InputProps={{
              style: { color: "#212121" },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    sx={{ 
                      color: "#424242",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                "& fieldset": { 
                  borderColor: "#e0e0e0",
                  borderWidth: "2px",
                },
                "&:hover fieldset": { 
                  borderColor: "#1976d2",
                },
                "&.Mui-focused fieldset": { 
                  borderColor: "#1976d2",
                  borderWidth: "2px",
                },
              },
            }}
          />
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={isLoggingIn}
              sx={{
                marginTop: "32px",
                background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                height: "48px",
                fontSize: "16px",
                fontWeight: 600,
                width: "180px",
                textTransform: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                letterSpacing: "0.5px",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.5)",
                  background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
                },
                "&:disabled": {
                  background: "linear-gradient(135deg, #9e9e9e 0%, #757575 100%)",
                  boxShadow: "none",
                },
              }}
              startIcon={
                isLoggingIn && <CircularProgress size={20} color="inherit" />
              }
            >
              {isLoggingIn ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default Login;

import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { DarkMode, LightMode } from "@mui/icons-material";
import socotecLogo from "../assets/socotec logo.png";
import bagongPilipinasLogo from "../assets/bagong pilipinas logo.png";
import itdoleLogo from "../assets/IT-DOLEFO logo.png";
import trmsLogo from "../assets/TRMS2.png";
import doleLogo from "../assets/dole-logo.png";
import { FaFacebook, FaInstagram, FaTiktok, FaSync, FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./calendar.css";

// Header Component
export function CalendarHeader({ darkMode = false, toggleDarkMode }) {
  return (
    <AppBar className="app-bar">
      <Toolbar className="toolbar">
        {/* Logo & Text - Matching ApprovingHome.js Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ padding: "5px" }}>
            <img
              src={trmsLogo}
              alt="TRMS"
              style={{ width: 50, height: 42 }}
            />
          </Box>

          {/* Header Text - Hidden on Mobile */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
            }}
          >
            <Typography
              variant="body2"
              sx={{ 
                color: darkMode ? "#e0e0e0" : "black", 
                fontWeight: 500, 
                fontSize: "10px !important",
                lineHeight: 1.2,
              }}
            >
              Republic of the Philippines
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: darkMode ? "#e0e0e0" : "black", 
                fontWeight: "bold", 
                fontSize: "11px !important",
                lineHeight: 1.2,
              }}
            >
              DEPARTMENT OF LABOR AND EMPLOYMENT
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: darkMode ? "#e0e0e0" : "black", 
                fontWeight: 500, 
                fontSize: "10px !important",
                lineHeight: 1.2,
              }}
            >
              Regional Office No. X
            </Typography>
            <Typography
              variant="body2"
              sx={{ 
                color: darkMode ? "#e0e0e0" : "black", 
                fontWeight: "normal", 
                fontSize: "10px !important",
                lineHeight: 1.2,
              }}
            >
              Cagayan De Oro - Field Office
            </Typography>
          </Box>
        </Box>
        <Typography 
          variant="h1" 
          className="travel-system-text"
          style={{ fontSize: "25px", fontWeight: 400, fontFamily: '"Oswald", sans-serif' }}
        >
          Travel Request Management System
        </Typography>
        <Box className="toolbar-right">
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} disableInteractive>
            <span>
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("IconButton onClick triggered, toggleDarkMode:", toggleDarkMode);
                  if (toggleDarkMode) {
                    console.log("Calling toggleDarkMode function");
                    toggleDarkMode();
                  } else {
                    console.error("toggleDarkMode is not defined!");
                  }
                }}
                className="dark-mode-toggle-btn"
                sx={{
                  color: darkMode ? "#fff" : "#424242",
                  marginRight: "8px",
                  minWidth: "40px",
                  width: "40px",
                  height: "40px",
                  padding: "8px",
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(66, 66, 66, 0.1)",
                  border: darkMode ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(66, 66, 66, 0.2)",
                  borderRadius: "6px",
                  display: "flex !important",
                  alignItems: "center",
                  justifyContent: "center",
                  visibility: "visible !important",
                  opacity: "1 !important",
                  cursor: "pointer !important",
                  pointerEvents: "auto !important",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.25)" : "rgba(66, 66, 66, 0.2)",
                    borderColor: darkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(66, 66, 66, 0.3)",
                  },
                  "&:active": {
                    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(66, 66, 66, 0.25)",
                  },
                  "& svg": {
                    fontSize: "20px",
                  },
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </span>
          </Tooltip>
          <button
            className="refresh-btn"
            onClick={() => window.location.reload()}
            title="Refresh page"
          >
            <FaSync />
          </button>
          <button
            className="admin-login-btn"
            onClick={() => window.location.href = "/login"}
            title="Admin Login"
          >
            <FaSignInAlt className="admin-login-icon" />
            <span className="admin-login-text">Admin Login</span>
          </button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// Footer Component
export function CalendarFooter() {
  const navigate = useNavigate();

  const handleAboutDoleClick = () => {
    navigate("/organizational-structure");
  };

  return (
    <footer
      className="calendar-footer"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <div className="footer-left">
        <img 
          src={socotecLogo} 
          alt="SOCOTEC" 
          className="footer-logo"
          style={{ display: "block" }}
        />
        <img
          src={bagongPilipinasLogo}
          alt="Bagong Pilipinas"
          className="footer-logo"
          style={{ display: "block" }}
        />
        <img 
          src={itdoleLogo} 
          alt="IT-DOLEFO" 
          className="footer-logo"
          style={{ display: "block" }}
        />
        <button
          onClick={handleAboutDoleClick}
          className="footer-logo about-dole-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2px",
            padding: "4px 6px",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            borderRadius: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.75)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px) scale(1.05)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.75)";
          }}
        >
          <img
            src={doleLogo}
            alt="DOLE"
            style={{
              height: "25px",
              width: "auto",
              maxWidth: "75px",
              objectFit: "contain",
            }}
          />
          <span
            style={{
              fontSize: "8px",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "#212121",
            }}
          >
            About DOLE
          </span>
        </button>
      </div>
      <div className="footer-right">
        <p className="footer-text">Find us here</p>
        <div className="footer-icons">
          <a
            href="https://www.facebook.com/dolexcdofo"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>
        </div>
      </div>
    </footer>
  );
}

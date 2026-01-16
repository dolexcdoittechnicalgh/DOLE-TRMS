import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Container,
  IconButton,
  AppBar,
  Toolbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";

function OrganizationalStructure() {
  const navigate = useNavigate();
  const [personnel, setPersonnel] = useState([]);
  const [headPositions, setHeadPositions] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  // Get API base URL
  const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    if (
      hostname === "localhost" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
    ) {
      return `http://${hostname}:8000/api`;
    }
    return `https://api.dolexcdo.online/api`;
  };

  const fetchEmployeeData = async () => {
    try {
      setIsFetching(true);
      const API_BASE_URL = getApiBaseUrl();

      // Check if user is authenticated (has token)
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      let response;

      if (token) {
        // User is authenticated, use regular endpoint with token
        try {
          response = await axios.get(`${API_BASE_URL}/employees`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (authError) {
          console.error("Error fetching employees (authenticated):", authError);
          // If authenticated request fails, set empty arrays
          setPersonnel([]);
          setHeadPositions([]);
          return;
        }
      } else {
        // No token - use public endpoint (no authentication required)
        try {
          response = await axios.get(`${API_BASE_URL}/employees/public`);
        } catch (publicError) {
          // Public endpoint error - log and show empty state
          console.error("Error fetching from public endpoint:", publicError);
          // Set empty arrays - page will show "No personnel data available"
          setPersonnel([]);
          setHeadPositions([]);
          return;
        }
      }

      const employees = Array.isArray(response?.data?.employees)
        ? response.data.employees
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const headPositionsData = Array.isArray(response?.data?.head_positions)
        ? response.data.head_positions
        : [];

      setPersonnel(employees);
      setHeadPositions(headPositionsData);
    } catch (error) {
      console.error("Error fetching employee data:", error);
      // Set empty arrays on error so page still renders
      setPersonnel([]);
      setHeadPositions([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('bgimage1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, rgba(245, 247, 250, 0.85) 0%, rgba(227, 232, 246, 0.9) 100%)",
          zIndex: 0,
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "white",
          boxShadow: 1,
          mb: 2,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ color: "black", mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ color: "black", fontWeight: 600, flexGrow: 1 }}
          >
            Organizational Structure
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box
          sx={{
            p: 3,
            textAlign: "center",
            paddingBottom: 3,
            overflow: "visible",
          }}
        >
          <Card
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              backgroundColor: "#ffffff",
              opacity: 0.95,
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ textAlign: "center", mb: 2 }}
            >
              Cagayan De Oro Provincial Field Office
              <br />
              <Box sx={{ textAlign: "center" }}>ORGANIZATIONAL STRUCTURE</Box>
            </Typography>

            {/* Head of the Company */}
            {headPositions.length > 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Head of the Company
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
                  {headPositions
                    .filter((h) => (h.position === "DolexCDO Chief" || h.position === "DolexCDO chief") && h.is_active === 1)
                    .map((chief) => (
                      <Card
                        key={chief.id}
                        sx={{
                          position: "relative",
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "#f0f2f5",
                          borderRadius: 2,
                          width: 300,
                          boxShadow: 3,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                          <Box
                            component="img"
                            src={
                              chief.profile_image
                                ? (() => {
                                    // Always use production URL for images since they're hosted there
                                    const baseUrl = "https://travelsystem.dolexcdo.online";
                                    // Head of company images are in /images/profile_images/
                                    let imagePath = chief.profile_image.replace(/^\/+/, "");
                                    
                                    // Debug logging
                                    console.log("🔵 Head of Company image path:", imagePath);
                                    
                                    // If path already includes full URL, use it as is
                                    if (imagePath.startsWith("http")) {
                                      console.log("✅ Using full URL:", imagePath);
                                      return imagePath;
                                    }
                                    // If path already includes the full path, use it as is
                                    if (imagePath.startsWith("images/profile_images/")) {
                                      const fullUrl = `${baseUrl}/${imagePath}`;
                                      console.log("✅ Using path with images/profile_images/:", fullUrl);
                                      return fullUrl;
                                    }
                                    // If path starts with just "images/", add profile_images/
                                    if (imagePath.startsWith("images/")) {
                                      const fullUrl = `${baseUrl}/${imagePath}`;
                                      console.log("✅ Using path with images/:", fullUrl);
                                      return fullUrl;
                                    }
                                    // Otherwise, construct the full path (assume it's just a filename)
                                    const fullUrl = `${baseUrl}/images/profile_images/${imagePath}`;
                                    console.log("✅ Constructed full URL:", fullUrl);
                                    return fullUrl;
                                  })()
                                : "https://picsum.photos/120"
                            }
                            alt={chief.name}
                            sx={{
                              width: 120,
                              height: 120,
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              // If image fails to load, use fallback
                              const fallback = "https://picsum.photos/120";
                              if (!e.target.src.includes(fallback)) {
                                e.target.onerror = null;
                                e.target.src = fallback;
                              }
                            }}
                          />
                        </Box>
                        <CardContent>
                          <Typography fontWeight="bold" variant="h6">
                            {chief.name}
                          </Typography>
                          <Typography variant="body1">
                            Cagayan de Oro Field Office, City Director
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                </Box>
              </>
            )}

            {/* Directory of Personnel */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Directory of Personnel
            </Typography>

            <Grid container spacing={2} justifyContent="center" mb={4}>
              {isFetching ? (
                <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
                  <CircularProgress />
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    Loading personnel data...
                  </Typography>
                </Grid>
              ) : personnel.length === 0 ? (
                <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No personnel data available.
                  </Typography>
                </Grid>
              ) : (
                personnel
                  .filter((person) =>
                    ["LEO I", "SR LEO", "LEO II", "LEO III"].includes(
                      person.position_name
                    )
                  )
                  .map((person, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                      <Card
                        sx={{
                          position: "relative",
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "#f0f2f5",
                          borderRadius: "10px",
                          boxShadow: 2,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minHeight: "280px",
                        }}
                      >
                        <Box
                          sx={{
                            mb: 1,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={
                              person.employee_photo
                                ? (() => {
                                    // Always use production URL for images since they're hosted there
                                    const baseUrl = "https://travelsystem.dolexcdo.online";
                                    // Employee photos are in /storage/employee_photos/
                                    let imagePath = person.employee_photo.replace(/^\/+/, "");
                                    
                                    // Debug logging (only log first few to avoid spam)
                                    if (index < 3) {
                                      console.log(`🔵 Employee ${index} photo path:`, imagePath, "for", person.first_name, person.last_name);
                                    }
                                    
                                    // If path already includes full URL, use it as is
                                    if (imagePath.startsWith("http")) {
                                      if (index < 3) console.log("✅ Using full URL:", imagePath);
                                      return imagePath;
                                    }
                                    // If path already includes storage/employee_photos/, use it as is
                                    if (imagePath.startsWith("storage/employee_photos/")) {
                                      const fullUrl = `${baseUrl}/${imagePath}`;
                                      if (index < 3) console.log("✅ Using path with storage/employee_photos/:", fullUrl);
                                      return fullUrl;
                                    }
                                    // If path starts with employee_photos/, add storage/
                                    if (imagePath.startsWith("employee_photos/")) {
                                      const fullUrl = `${baseUrl}/storage/${imagePath}`;
                                      if (index < 3) console.log("✅ Using path with employee_photos/:", fullUrl);
                                      return fullUrl;
                                    }
                                    // If path starts with storage/, check if it needs employee_photos/
                                    if (imagePath.startsWith("storage/")) {
                                      // If it doesn't already have employee_photos/, add it
                                      if (!imagePath.includes("employee_photos")) {
                                        const fullUrl = `${baseUrl}/storage/employee_photos/${imagePath.replace("storage/", "")}`;
                                        if (index < 3) console.log("✅ Added employee_photos/ to storage/ path:", fullUrl);
                                        return fullUrl;
                                      }
                                      const fullUrl = `${baseUrl}/${imagePath}`;
                                      if (index < 3) console.log("✅ Using path with storage/:", fullUrl);
                                      return fullUrl;
                                    }
                                    // Otherwise, construct the full path (assume it's just a filename)
                                    const fullUrl = `${baseUrl}/storage/employee_photos/${imagePath}`;
                                    if (index < 3) console.log("✅ Constructed full URL:", fullUrl);
                                    return fullUrl;
                                  })()
                                : "https://picsum.photos/120"
                            }
                            alt={`${person.first_name} ${person.last_name}`}
                            sx={{
                              width: 100,
                              height: 100,
                              borderRadius: "10px",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              // If image fails to load, use fallback
                              const fallback = "https://picsum.photos/120";
                              if (!e.target.src.includes(fallback)) {
                                e.target.onerror = null;
                                e.target.src = fallback;
                              }
                            }}
                          />
                        </Box>

                        <CardContent
                          sx={{
                            width: "100%",
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            pt: 2,
                            pb: 1,
                          }}
                        >
                          <Typography
                            fontWeight="bold"
                            sx={{
                              fontSize: "0.95rem",
                              lineHeight: 1.3,
                              mb: 0.5,
                              wordBreak: "break-word",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {person.first_name}{" "}
                            {person.middle_name && person.middle_name + " "}
                            {person.last_name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: "0.85rem",
                              color: "text.secondary",
                              wordBreak: "break-word",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {person.position_name}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
              )}
            </Grid>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

export default OrganizationalStructure;

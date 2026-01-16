//Boncales | 02/17/25 | Functions : Header, Widget, Pending, History, Reports, Employee (Edit), Graphs, User Profile, PDF (TO/OB)

import React, { useRef, useMemo } from "react";
import { styled } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  TextField,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
  Avatar,
  Modal,
  Tooltip,
  Stack,
  Switch,
  Badge,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Add,
  ArrowDropDown,
  FileDownloadOutlined,
  MoreHoriz,
  CameraAltOutlined,
  VisibilityOffOutlined,
  VisibilityOutlined,
  AccessTimeOutlined,
  Logout,
  AccountCircle,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import PersonAdd from "@mui/icons-material/PersonAdd"; // ✅ This line fixes the error
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Divider,
  DialogActions,
  TablePagination,
  Checkbox,
} from "@mui/material";
import Container from "@mui/material/Container";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import SettingsSystemDaydreamOutlined from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import isBetweenPlugin from "dayjs/plugin/isBetween";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { BarChart } from "@mui/x-charts/BarChart";
import dayjs from "dayjs"; //Boncales | 02/18/25 | npm install dayjs--to automate the render of days/months/yearly/quarterly in the dropdown menu
import "../pages/Approving.css"; //  Boncales| 02/13/25 | importing stylesheet of approving
import html2canvas from "html2canvas";
import { OBESIGN } from "./OBESIGN";
import { GeneratePassSlipPDF } from "./PassSlippdf";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import logo from "../assets/logo-dole.png";
import trmsLogo from "../assets/TRMS2.png";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Chip from "@mui/material/Chip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Pagination from "@mui/material/Pagination";
import { useDropzone } from "react-dropzone";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useAppContext } from "../contexts/ContextProvider"; // Adjust path if needed
import { useNotifications } from "./NotificationContext";
import echo from "../utils/echo"; // 👈 Your configured Echo instance

//API
import {
  storePosition,
  fetchPositions,
  storeEmployee,
  fetchToDetails,
  updateTravelOrderStatus,
  updateOfficialBusinessStatus,
  updateTravelOrderStatusAdmin,
  updatePassSlipStatus,
  fetchEmployees,
  updateEmployee,
  updatePosition,
  StoreUser,
  UpdateUser,
  SoftDeleteUser,
  SoftDeletePosition,
  SoftDeleteEmployee,
  StoreHeadPosition,
  FetchHeadPositions,
  UpdateHeadPosition,
  updateOfficerInCharge,
  updateDolexCDOChief,
  deleteHeadPosition,
  updateHeadStatus,
} from "../api"; // adjust path as needed

// Header Component
export function Header({ getToDetails, handleLogout }) {
  const { unreadNotifications } = useNotifications(); // ✅ Use context
  const { user } = useAppContext(); // Get user from context
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const headerLogo = {
    image: trmsLogo,
    name: "TRMS",
  };

  // Get user name - try multiple possible properties
  const getUserName = () => {
    if (!user) return "User";
    // Try different possible property names
    return user.name || user.username || user.first_name || user.full_name || "User";
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogoutClick = () => {
    handleUserMenuClose();
    if (handleLogout) {
      handleLogout();
    }
  };

  return (
    <AppBar
      position="static"
      sx={{ 
        backgroundColor: "white", 
        boxShadow: 0, 
        padding: "4px 8px",
        minHeight: "60px !important",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: "52px !important",
          padding: "0 8px !important",
        }}
      >
        {/* Logo & Text */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ padding: "5px" }}>
            <img
              src={headerLogo.image}
              alt={headerLogo.name}
              style={{ width: 50, height: 50 }}
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
                color: "black", 
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
                color: "black", 
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
                color: "black", 
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
                color: "black", 
                fontWeight: "normal", 
                fontSize: "10px !important",
                lineHeight: 1.2,
              }}
            >
              Cagayan De Oro - Field Office
            </Typography>
          </Box>
        </Box>

        {/* Right Side: Time, Weather Widgets & Logout Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
          <NotificationBell
            unreadNotifications={unreadNotifications}
            onClick={() => {}} // Optional: leave empty or remove if not needed
            onNotificationClick={() => {}} // Optional: provide real handler later if needed
            refetch={getToDetails}
          />

          <Time />
          <WeatherWidget />
          
          {/* User Icon and Greeting */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                display: { xs: "none", sm: "block" },
                fontSize: { sm: "12px", md: "14px" },
                color: "#333",
                fontWeight: 500,
              }}
            >
              Hello! Sir, {getUserName()}
            </Typography>
            <IconButton
              onClick={handleUserMenuOpen}
              sx={{
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(25, 118, 210, 0.08)",
                },
                padding: { xs: "4px", sm: "8px" },
              }}
            >
              <AccountCircle sx={{ fontSize: { xs: 28, sm: 32 } }} />
            </IconButton>
          </Box>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
              },
            }}
          >
            {handleLogout && (
              <MenuItem
                onClick={handleLogoutClick}
                sx={{
                  color: "#d32f2f",
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "rgba(211, 47, 47, 0.08)",
                  },
                }}
              >
                <Logout sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export const NotificationBell = ({
  unreadNotifications = [],
  onNotificationClick,
  refetch,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleNotificationClick = async (notification) => {
    if (refetch) {
      await refetch(); // Wait for refetch to complete
    }

    if (onNotificationClick) {
      onNotificationClick(notification.id); // Then call click handler
    }

    handleClose(); // Then close the popover
  };

  // ✅ Add real-time listener here
  useEffect(() => {
    const channel = echo.channel("pending-counts");

    channel.listen(".PendingCountsUpdated", (event) => {
      console.log("🔔 NotificationBell received event:", event);

      // Trigger parent to refresh notification data
      if (typeof onNotificationClick === "function") {
        onNotificationClick("refresh-notifications");
      }
    });

    return () => {
      echo.leave("pending-counts");
    };
  }, [onNotificationClick]);

  // ✅ Show count of notification types instead of total pending items
  const notificationCount = unreadNotifications.length;
  const hasNotifications = unreadNotifications.length > 0;

  const renderNotificationItem = (notification, index) => {
    let count = 0;
    if (notification.count !== undefined) {
      count = notification.count;
    } else {
      const countMatch = notification.message.match(/(\d+)/);
      count = countMatch ? parseInt(countMatch[1], 10) : 0;
    }

    const hasItems = count > 0;

    return (
      <MenuItem
        key={notification.id || index}
        onClick={() => handleNotificationClick(notification)}
        sx={{
          borderBottom:
            index < unreadNotifications.length - 1
              ? "1px solid #f0f0f0"
              : "none",
          "&:hover": {
            backgroundColor: hasItems ? "#f5f5f5" : "#fafafa",
          },
          opacity: hasItems ? 1 : 0.7,
          minHeight: 80,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: hasItems ? "#f44336" : "#4caf50",
              mr: 2,
              flexShrink: 0,
            }}
          />

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ mb: 0.5 }}
              color={hasItems ? "text.primary" : "text.secondary"}
            >
              {notification.title}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.3 }}
            >
              {notification.message}
            </Typography>

            {notification.timestamp && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.7rem", mt: 0.5, display: "block" }}
              >
                {new Date(notification.timestamp).toLocaleString()}
              </Typography>
            )}
          </Box>

          <Box sx={{ ml: 1, flexShrink: 0 }}>
            <Typography
              variant="caption"
              sx={{
                backgroundColor: hasItems ? "#f44336" : "#e0e0e0",
                color: hasItems ? "white" : "text.secondary",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            >
              {count}
            </Typography>
          </Box>
        </Box>
      </MenuItem>
    );
  };

  return (
    <>
      <Tooltip title="Pending Approvals">
        <IconButton color="primary" onClick={handleOpen}>
          <Badge
            badgeContent={notificationCount > 0 ? notificationCount : null}
            color="error"
            max={99}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ style: { maxHeight: 400, width: "380px" } }}
      >
        <MenuItem
          disabled
          sx={{ backgroundColor: "#f8f9fa", fontWeight: "bold" }}
        >
          <Box sx={{ textAlign: "center", width: "100%", py: 1 }}>
            <Typography variant="subtitle2" color="primary">
              Pending Approvals
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {notificationCount} type{notificationCount !== 1 ? "s" : ""}{" "}
              require attention
            </Typography>
          </Box>
        </MenuItem>

        {!hasNotifications ? (
          <MenuItem disabled>
            <Box sx={{ textAlign: "center", py: 2, width: "100%" }}>
              <Typography variant="body2" color="text.secondary">
                No pending notifications
              </Typography>
            </Box>
          </MenuItem>
        ) : (
          <>
            {unreadNotifications.map((notification, index) =>
              index < 3 ? renderNotificationItem(notification, index) : null
            )}
          </>
        )}

        {hasNotifications && (
          <MenuItem
            onClick={handleClose}
            sx={{
              borderTop: "1px solid #e0e0e0",
              justifyContent: "center",
              backgroundColor: "#f8f9fa",
            }}
          >
            <Typography variant="caption" color="primary" fontWeight="bold">
              View All Pending Items
            </Typography>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
// Time Widget - Adjust font size on small screens
export function Time() {
  const [ctime, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center" gap={1} color={"black"}>
      <AccessTimeOutlined fontSize="small" /> {/* Icon smaller on mobile */}
      <Typography
        sx={{
          fontSize: { xs: "12px", sm: "16px" }, // Smaller font on phones
          fontWeight: 500,
        }}
      >
        {ctime}
      </Typography>
    </Box>
  );
}

// Dashboard Component - Display counts for Pending, Approved, and Declined
export function Dashboard({ 
  pendingCount, 
  approvedCount, 
  declinedCount,
  toCount,
  obCount,
  passSlipCount,
  employeeCountsOfficialBusiness,
  employeeCountsTravelOrder,
  employeeCountsPassSlip,
  onNavigateToSubtab,
  allData, // Pass all data to display in modal
}) {
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState(null); // 'TO', 'OB', or 'PS'
  const [modalData, setModalData] = useState([]);

  const handleCardClick = (type) => {
    if (!allData || !Array.isArray(allData)) {
      console.warn("No data available for modal");
      return;
    }
    
    // Filter data by type
    const filtered = allData.filter((item) => item.type === type);
    setModalData(filtered);
    setModalType(type);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalType(null);
    setModalData([]);
  };

  const getStatus = (item) => {
    if (item.type === "TO" && item.travel_order) {
      return item.travel_order.status || "N/A";
    } else if (item.type === "OB" && item.official_business) {
      return item.official_business.status || "N/A";
    } else if (item.type === "PS" && item.pass_slip) {
      return item.pass_slip.status || "N/A";
    }
    return item.status || "N/A";
  };

  const getStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    if (normalizedStatus === "approved") return "#4caf50";
    if (normalizedStatus === "declined") return "#f44336";
    if (normalizedStatus === "pending" || normalizedStatus === "pendingadmin") return "#ff9800";
    return "#757575";
  };

  const getDate = (item) => {
    if (item.type === "TO" && item.travel_order) {
      return item.travel_order.date || item.travel_order.created_at || "N/A";
    } else if (item.type === "OB" && item.official_business) {
      return item.official_business.date_of_business || item.official_business.created_at || "N/A";
    } else if (item.type === "PS" && item.pass_slip) {
      return item.pass_slip.created_at || item.pass_slip.date || "N/A";
    }
    return item.date || item.created_at || "N/A";
  };

  const getDestination = (item) => {
    if (item.type === "TO" && item.travel_order) {
      return item.travel_order.destination || "N/A";
    } else if (item.type === "OB" && item.official_business) {
      return item.official_business.travel_to || "N/A";
    } else if (item.type === "PS" && item.pass_slip) {
      return item.pass_slip.place_to_visit || "N/A";
    }
    return "N/A";
  };

  const getEmployees = (item) => {
    if (item.employees && Array.isArray(item.employees) && item.employees.length > 0) {
      return item.employees.map(emp => 
        `${emp.first_name || ""} ${emp.last_name || ""}`.trim()
      ).filter(Boolean).join(", ") || "N/A";
    }
    return "N/A";
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "TO": return "Travel Orders";
      case "OB": return "Official Business";
      case "PS": return "Pass Slips";
      default: return type;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Grid container spacing={2.25}>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => onNavigateToSubtab && onNavigateToSubtab("pending")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {pendingCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Pending</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => onNavigateToSubtab && onNavigateToSubtab("approved")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {approvedCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Approved</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => onNavigateToSubtab && onNavigateToSubtab("declined")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {declinedCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Declined</Typography>
          </Card>
        </Grid>
      </Grid>
      
      {/* TO, OB, and Pass Slips Count Cards */}
      <Grid container spacing={2.25} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => handleCardClick("TO")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {toCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Travel Orders</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => handleCardClick("OB")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {obCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Official Business</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            onClick={() => handleCardClick("PS")}
            sx={{
              textAlign: "center",
              p: 2.25,
              background: "linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)",
              color: "white",
              borderRadius: 1.5,
              boxShadow: "0 3px 9px rgba(0, 0, 0, 0.15)",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "0 6px 15px rgba(0, 0, 0, 0.25)",
              },
            }}
          >
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.75, fontSize: "1.6rem" }}>
              {passSlipCount || 0}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: "0.94rem" }}>Pass Slips</Typography>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <StatisticsEmployee
          data={employeeCountsOfficialBusiness}
          travelOrderData={employeeCountsTravelOrder}
          passSlipData={employeeCountsPassSlip}
        />
      </Box>

      {/* Modal for displaying items list */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            {getTypeLabel(modalType)} - All Records
          </Typography>
          <IconButton onClick={handleCloseModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, mt: 2 }}>
          {modalData.length === 0 ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                No records found
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: "60vh" }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      ID
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      Employee(s)
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      Destination/Place
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modalData.map((item, index) => {
                    const status = getStatus(item);
                    const statusColor = getStatusColor(status);
                    return (
                      <TableRow
                        key={index}
                        hover
                        sx={{
                          "&:hover": {
                            backgroundColor: "#f9f9f9",
                          },
                        }}
                      >
                        <TableCell>
                          {item.type === "TO" && item.travel_order?.travel_order_id
                            ? item.travel_order.travel_order_id
                            : item.type === "OB" && item.official_business?.official_business_id
                            ? item.official_business.official_business_id
                            : item.type === "PS" && item.pass_slip?.pass_slip_id
                            ? item.pass_slip.pass_slip_id
                            : index + 1}
                        </TableCell>
                        <TableCell>
                          {dayjs(getDate(item)).isValid()
                            ? dayjs(getDate(item)).format("MMM DD, YYYY")
                            : getDate(item)}
                        </TableCell>
                        <TableCell>{getEmployees(item)}</TableCell>
                        <TableCell>{getDestination(item)}</TableCell>
                        <TableCell>
                          <Chip
                            label={status}
                            sx={{
                              backgroundColor: statusColor,
                              color: "white",
                              fontWeight: 600,
                              fontSize: "0.75rem",
                              minWidth: "80px",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e0e0e0" }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: "auto" }}>
            Total: {modalData.length} record(s)
          </Typography>
          <Button onClick={handleCloseModal} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Weather Widget - Adjust font size on small screens
export function WeatherWidget() {
  const [weather, setWeather] = useState("Loading...");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "d6c1fe0f295d4894a0c03549251802";
        const city = "Cagayan de Oro";
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

        const response = await axios.get(url);

        const condition = response.data.current.condition.text;
        setWeather(condition);
      } catch (error) {
        console.error(
          "Error fetching weather:",
          error.response?.data || error.message
        );
        setWeather("Unavailable");
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box display="flex" alignItems="center" gap={1} color={"black"}>
      <SettingsSystemDaydreamOutlined fontSize="small" />{" "}
      {/* Icon smaller on mobile */}
      <Typography
        sx={{
          fontSize: { xs: "12px", sm: "16px" }, // Smaller font on phones
          fontWeight: 500,
        }}
      >
        {weather}
      </Typography>
    </Box>
  );
}
//02/17/25 | Function Approving Pending--to call into the Tabs in the Approving Home

export const ApprovingPending = ({
  data,
  allPendingData, // ✅ Add this to receive all pending data (including past dates)
  isLoading,
  refetch,
  userRole,
  refreshHistoryLogs,
  Headposition, // ✅ received here
  signatureUrl, // 👈 received here
  notifications, // ✅ add this to receive the callback
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ used to track submission
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const headPositionId = Headposition?.id;
  const chiefId = Headposition?.chief_id || null; // ✅ extract chief_id directly
  const oicId = Headposition?.oic_id || null; // ✅ extract oic_id directly
  const regionalHeadId = Headposition?.regional_director?.id || null; // ✅ extract regional_head_id
  const headPositionName =
    Headposition?.oic_name || Headposition?.chief_name || "N/A";

  useEffect(() => {
    if (typeof notifications === "function" && Array.isArray(data)) {
      const notifications = data
        .filter((item) => item.official_business.status === "pending")
        .map((item) => ({
          title: "Pending OB Request",
          message: `${
            item.official_business.requestor_name || "Someone"
          } submitted an OB.`,
        }));

      notifications(notifications);
    }
  }, [data]);

  // State for date range and bulk selection
  const [dateRangeAnchor, setDateRangeAnchor] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });
  const [selectedRows, setSelectedRows] = useState(new Set()); // For bulk selection
  const [isSelectMode, setIsSelectMode] = useState(false); // Toggle checkbox visibility
  const [typeFilterAnchor, setTypeFilterAnchor] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All"); // All, TO, OB, PS

  // Filter data based on userRole, status, date range, and type filter
  const filteredData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    
    let filtered = data.filter((row) => {
      if (!row || !row.type) return false;

      // Type filter
      if (selectedTypeFilter !== "All" && row.type !== selectedTypeFilter) {
        return false;
      }

      const status =
        row.type === "OB" && row.official_business
          ? row.official_business.status
          : row.type === "TO" && row.travel_order
          ? row.travel_order.status
          : row.type === "PS" && row.pass_slip
          ? row.pass_slip.status
          : undefined;

      // Role-based filtering
      // Admin only sees requests confirmed by evaluator (pendingAdmin)
      // Evaluator only sees initial pending requests (pending)
      if (userRole === "admin") {
        if (status !== "pendingAdmin") return false;
      } else if (userRole === "evaluator") {
        if (status !== "pending") return false;
      } else {
        return false;
      }

      // Date range filtering
      if (selectedDateRange.start && selectedDateRange.end) {
        let dateStr = null;
        if (row.type === "OB" && row.official_business) {
          dateStr = row.official_business.date_of_business || row.date;
        } else if (row.type === "TO" && row.travel_order) {
          dateStr = row.travel_order.date || row.date;
        } else if (row.type === "PS" && row.pass_slip) {
          dateStr = row.pass_slip.time_start || row.pass_slip.date || row.date;
        } else {
          dateStr = row.date;
        }

        if (dateStr) {
          const rowDate = dayjs(dateStr).startOf('day');
          if (rowDate.isValid()) {
            const isInRange = rowDate.isBetween(
              selectedDateRange.start.startOf("day"),
              selectedDateRange.end.endOf("day"),
              null,
              "[]"
            );
            if (!isInRange) return false;
          }
        }
      }

      return true;
    });
    
    return filtered;
  }, [data, userRole, selectedDateRange, selectedTypeFilter]);

  // Pagination logic
  const isShowAll = rowsPerPage === "all";
  const itemsPerPage = isShowAll ? filteredData.length : Number(rowsPerPage);
  const totalPages = isShowAll ? 1 : Math.ceil(filteredData.length / itemsPerPage);

  // Reset to page 1 if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isShowAll
    ? filteredData.length
    : Math.min(startIndex + itemsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Calculate page range to show (max 3 pages)
  let startPage = 1;
  let endPage = Math.min(3, totalPages);

  if (currentPage > 2 && currentPage < totalPages - 1) {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  } else if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - 2);
    endPage = totalPages;
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const startEntry = filteredData.length === 0 ? 0 : startIndex + 1;
  const endEntry = endIndex;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // You can use `chiefId`, `oicId`, and `regionalHeadId` in your logic below

  // // Define these at the top level of the parent component
  // const [pendingData, setPendingData] = useState([]);
  // const [isLoadingPending, setIsLoadingPending] = useState(true);

  // useEffect(() => {
  //   const getToDetails = async () => {
  //     try {
  //       const response = await fetchToDetails();

  //       if (response && response.success && Array.isArray(response.data)) {
  //         setPendingData(response.data);
  //       } else {
  //         console.error("Failed to fetch TO details: Invalid data format");
  //       }
  //     } catch (error) {
  //       console.error("Failed to fetch TO details:", error);
  //     } finally {
  //       setIsLoadingPending(false);
  //     }
  //   };

  //   getToDetails();
  // }, []);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    width: {
      xs: "95%", // phones
      sm: "90%", // small tablets
      md: "80%", // medium screens
      lg: "70%", // large screens
    },
    maxHeight: "90vh",
    overflowY: "auto",

    // 👇 Add this line
    zIndex: 1059, // must be LOWER than SweetAlert2 (which uses 1060+ by default)
  };
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedTravelData, setSelectedTravelData] = React.useState(null);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [selectedRowType, setSelectedRowType] = useState(null); // 👈 Add this
  const [openPastEntriesModal, setOpenPastEntriesModal] = useState(false);
  const [selectedOfficialBusinessId, setSelectedOfficialBusinessId] =
    useState(null);
  const [open, setOpen] = React.useState(false);
  const handleSubmit = () => {
    Swal.fire({
      title: "Successfully approved!",
      icon: "success",
    });
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Bulk selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select ALL data rows (not the header row - header is not in filteredData)
      const allDataRowIds = new Set(
        filteredData.map((row, idx) => idx)
      );
      setSelectedRows(allDataRowIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const isRowSelected = (index) => selectedRows.has(index);
  
  // Check if all data rows are selected (not including header row)
  const isAllSelected = filteredData.length > 0 && selectedRows.size === filteredData.length;

  // Bulk approve function
  const handleBulkApprove = async () => {
    if (selectedRows.size === 0) return;

    const result = await Swal.fire({
      title: "Approve Selected Requests?",
      text: `You are about to approve ${selectedRows.size} request(s). This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve all",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setIsSubmitting(true);
    const selectedItems = Array.from(selectedRows).map(idx => filteredData[idx]);
    let successCount = 0;
    let failCount = 0;

    for (const row of selectedItems) {
      try {
        const id = row.type === "OB" 
          ? row.official_business?.id 
          : row.type === "TO" 
          ? row.travel_order?.id 
          : row.pass_slip?.id;
        
        if (!id) {
          failCount++;
          continue;
        }

        const basePayload = {
          status: "approved",
          chief_id: chiefId || null,
        };

        if (oicId) basePayload.oic_id = oicId;

        let response;
        if (row.type === "TO") {
          response = await axios.put(`http://localhost:8000/api/travel-orders/${id}`, basePayload);
        } else if (row.type === "OB") {
          response = await axios.put(`http://localhost:8000/api/official-business/${id}`, basePayload);
        } else if (row.type === "PS") {
          response = await axios.put(`http://localhost:8000/api/pass-slips/${id}`, basePayload);
        }

        if (response?.data?.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error("Error approving item:", error);
        failCount++;
      }
    }

    setIsSubmitting(false);
    setSelectedRows(new Set());

    if (typeof refetch === "function") await refetch();
    if (typeof refreshHistoryLogs === "function") await refreshHistoryLogs();

    Swal.fire({
      title: "Bulk Approval Complete",
      text: `Successfully approved ${successCount} request(s). ${failCount > 0 ? `${failCount} failed.` : ""}`,
      icon: successCount > 0 ? "success" : "error",
    });
  };

  // Bulk decline function
  const handleBulkDecline = async () => {
    if (selectedRows.size === 0) return;

    const { value: remarks } = await Swal.fire({
      title: "Decline Selected Requests?",
      text: `You are about to decline ${selectedRows.size} request(s). Please provide remarks.`,
      icon: "warning",
      input: "textarea",
      inputLabel: "Remarks (Required)",
      inputPlaceholder: "Enter reason for decline...",
      inputAttributes: {
        "aria-label": "Remarks for decline"
      },
      showCancelButton: true,
      confirmButtonText: "Yes, decline all",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) return "Remarks are required!";
      },
    });

    if (!remarks) return;

    setIsSubmitting(true);
    const selectedItems = Array.from(selectedRows).map(idx => filteredData[idx]);
    let successCount = 0;
    let failCount = 0;

    for (const row of selectedItems) {
      try {
        const id = row.type === "OB" 
          ? row.official_business?.id 
          : row.type === "TO" 
          ? row.travel_order?.id 
          : row.pass_slip?.id;
        
        if (!id) {
          failCount++;
          continue;
        }

        const payload = {
          status: "declined",
          remarks: remarks,
        };

        let response;
        if (row.type === "TO") {
          response = await axios.put(`http://localhost:8000/api/travel-orders/${id}`, payload);
        } else if (row.type === "OB") {
          response = await axios.put(`http://localhost:8000/api/official-business/${id}`, payload);
        } else if (row.type === "PS") {
          response = await axios.put(`http://localhost:8000/api/pass-slips/${id}`, payload);
        }

        if (response?.data?.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error("Error declining item:", error);
        failCount++;
      }
    }

    setIsSubmitting(false);
    setSelectedRows(new Set());

    if (typeof refetch === "function") await refetch();
    if (typeof refreshHistoryLogs === "function") await refreshHistoryLogs();

    Swal.fire({
      title: "Bulk Decline Complete",
      text: `Successfully declined ${successCount} request(s). ${failCount > 0 ? `${failCount} failed.` : ""}`,
      icon: successCount > 0 ? "success" : "error",
    });
  };

  const handleSubmitUpdate = async ({ chiefId, regionalHeadId, oicId }) => {
    if (isSubmitting) return; // Prevent multiple clicks
    setIsSubmitting(true);

    setOpenPastEntriesModal(false);

    if (!selectedTravelId || !selectedRowType) {
      console.error("No travel ID or row type selected.");
      setIsSubmitting(false);
      return;
    }

    try {
      let result;

      // ✅ Shared payload
      const basePayload = {
        status: "approved",
        chief_id: chiefId || null, // ✅ Always include
      };

      // ✅ Add OIC ID if available
      if (oicId) {
        basePayload.oic_id = oicId;
      }

      if (selectedRowType === "TO") {
        const payload = {
          ...basePayload,
          regional_head_id: regionalHeadId || null,
        };

        result = await updateTravelOrderStatus(selectedTravelId, payload);
      } else if (selectedRowType === "OB") {
        const payload = {
          ...basePayload,
          regional_head_id: regionalHeadId || null,
        };

        result = await updateOfficialBusinessStatus(selectedTravelId, payload);
      } else if (selectedRowType === "PS") {
        const payload = {
          status: "approved",
          chief_id: chiefId ?? null,
          oic_id: oicId ?? null, // ✅ Explicitly include even if null
          remarks: "", // Optional if needed
        };

        result = await updatePassSlipStatus(selectedTravelId, payload);
      }

      handleClose();

      if (result?.success) {
        Swal.fire({ title: "Successfully updated!", icon: "success" });
        if (refetch) await refetch();
        if (refreshHistoryLogs) await refreshHistoryLogs();
      }

      setOpenPastEntriesModal(false);
      handleClose();
    } catch (error) {
      console.error("Failed to update status:", error);
      Swal.fire({ title: "Error", text: "Update failed.", icon: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const approveTravelOrder = async (orderId, type) => {
    try {
      const typeLabel =
        type === "OB"
          ? "official business"
          : type === "TO"
          ? "travel order"
          : type === "PS"
          ? "pass slip"
          : "unknown type";

      let response;

      const payload = { status: "pendingAdmin" };

      if (type === "OB") {
        console.log("Submitting to updateOfficialBusinessStatus:", {
          orderId,
          payload,
        });
        response = await updateOfficialBusinessStatus(orderId, payload);
      } else if (type === "TO") {
        const status = "pendingAdmin"; // ✅ Only pass string
        response = await updateTravelOrderStatusAdmin(orderId, status);
      } else if (type === "PS") {
        response = await updatePassSlipStatus(orderId, payload);
      } else {
        console.error("Invalid type:", type);
        return;
      }

      if (response?.success) {
        if (userRole === "evaluator") {
          Swal.fire(
            "Confirmed!",
            `The ${typeLabel} has been confirmed and sent to the admin for final approval.`,
            "success"
          );
        } else {
          Swal.fire(
            "Approved!",
            `The ${typeLabel} has been approved.`,
            "success"
          );
        }

        if (typeof refetch === "function") await refetch();
        if (typeof refreshHistoryLogs === "function")
          await refreshHistoryLogs();

        handleClose();
      } else {
        Swal.fire("Error", `Failed to ${userRole === "evaluator" ? "confirm" : "approve"} the ${typeLabel}.`, "error");
      }
    } catch (error) {
      console.error(`Error ${userRole === "evaluator" ? "confirming" : "approving"} ${type}:`, error);
      Swal.fire(
        "Error",
        `An error occurred while ${userRole === "evaluator" ? "confirming" : "approving"} the ${
          type === "OB"
            ? "official business"
            : type === "TO"
            ? "travel order"
            : "pass slip"
        }.`,
        "error"
      );
    }
  };

  const declineTravelOrder = async (id, remarks, type) => {
    if (!id) {
      console.error("❌ Cannot decline: ID is undefined.");
      Swal.fire("Error", "Invalid request. No ID provided.", "error");
      return;
    }

    let response = null;

    try {
      if (type === "OB") {
        response = await updateOfficialBusinessStatus(id, {
          status: "declined",
          remarks: remarks,
        });
      } else if (type === "PS") {
        response = await updatePassSlipStatus(id, {
          status: "declined",
          remarks: remarks,
        });
      } else if (type === "TO") {
        response = await updateTravelOrderStatus(id, {
          status: "declined",
          remarks: remarks,
        });
      } else {
        console.warn("Unknown type:", type);
        Swal.fire("Error", "Invalid request type.", "error");
        return;
      }

      if (response?.success) {
        const typeLabel =
          type === "OB"
            ? "official business"
            : type === "PS"
            ? "pass slip"
            : "travel order";
        
        if (userRole === "evaluator") {
          Swal.fire(
            "Removed!",
            `The ${typeLabel} has been removed.`,
            "success"
          );
        } else {
          Swal.fire(
            "Declined!",
            `The ${typeLabel} has been declined.`,
            "success"
          );
        }

        if (typeof refetch === "function") await refetch();
        if (typeof refreshHistoryLogs === "function")
          await refreshHistoryLogs();
      } else {
        throw new Error("Backend responded with failure.");
      }
    } catch (error) {
      console.error("Error declining request:", error);
      const typeLabel =
        type === "OB"
          ? "official business"
          : type === "PS"
          ? "pass slip"
          : "travel order";
      
      Swal.fire(
        "Error",
        `Failed to ${userRole === "evaluator" ? "remove" : "decline"} the ${typeLabel}.`,
        "error"
      );
    }
  };

  // Status Chip Component
  const StatusChip = ({ status }) => (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor:
          status === "Approved"
            ? "#e3f5e2"
            : status === "Pending"
            ? "#fff8e6"
            : "#ffecec",
        color:
          status === "Approved"
            ? "#2e7d32"
            : status === "Pending"
            ? "#ff9800"
            : "#d32f2f",
      }}
    />
  );

  // Employee Badge Component
  const EmployeeBadge = ({ name, position }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "6px 8px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Avatar sx={{ width: 32, height: 32, fontSize: "0.875rem" }}>
        {name
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {name}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {position}
        </Typography>
      </Box>
    </Box>
  );

  // Detail Label Component
  const DetailLabel = ({ children, ...props }) => (
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={500}
      {...props}
    >
      {children}
    </Typography>
  );

  // Detail Value Component
  const DetailValue = ({ children }) => (
    <Typography variant="body1" component="div" fontWeight={400}>
      {children}
    </Typography>
  );

  return (
    <Container
      fixed
      sx={{
        p: 2,
        overflowY: "hidden", // Disable vertical scrolling
        overflowX: { xs: "auto", sm: "hidden" }, // Allow horizontal scroll on mobile
      }}
    >
      <>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5, mt: 0, flexWrap: "wrap", gap: 1 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              startIcon={<AccessTimeOutlined />}
              onClick={(e) => setDateRangeAnchor(e.currentTarget)}
            >
              Date Range
            </Button>
            <Button
              variant="outlined"
              endIcon={<ArrowDropDown />}
              onClick={(e) => setTypeFilterAnchor(e.currentTarget)}
            >
              Filter: {selectedTypeFilter}
            </Button>
            <Menu
              anchorEl={typeFilterAnchor}
              open={Boolean(typeFilterAnchor)}
              onClose={() => setTypeFilterAnchor(null)}
            >
              <MenuItem onClick={() => { setSelectedTypeFilter("All"); setTypeFilterAnchor(null); }}>
                All
              </MenuItem>
              <MenuItem onClick={() => { setSelectedTypeFilter("TO"); setTypeFilterAnchor(null); }}>
                Travel Orders
              </MenuItem>
              <MenuItem onClick={() => { setSelectedTypeFilter("OB"); setTypeFilterAnchor(null); }}>
                Official Business
              </MenuItem>
              <MenuItem onClick={() => { setSelectedTypeFilter("PS"); setTypeFilterAnchor(null); }}>
                Pass Slips
              </MenuItem>
            </Menu>
            <Button
              variant={isSelectMode ? "contained" : "outlined"}
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                if (isSelectMode) {
                  setSelectedRows(new Set()); // Clear selection when exiting select mode
                }
              }}
            >
              {isSelectMode ? "Cancel Select" : "Select"}
            </Button>
            {isSelectMode && selectedRows.size > 0 && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleBulkApprove()}
                  disabled={isSubmitting}
                >
                  Approve Selected ({selectedRows.size})
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleBulkDecline()}
                  disabled={isSubmitting}
                >
                  Decline Selected ({selectedRows.size})
                </Button>
              </>
            )}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenPastEntriesModal(true)}
          >
            Past Entries
          </Button>
        </Box>
        
        <Popover
          open={Boolean(dateRangeAnchor)}
          anchorEl={dateRangeAnchor}
          onClose={() => setDateRangeAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, minWidth: 300 }}>
              <DatePicker
                label="Start Date"
                value={selectedDateRange.start}
                onChange={(newValue) => {
                  setSelectedDateRange((prev) => ({ ...prev, start: newValue }));
                }}
                sx={{ width: "100%" }}
              />
              <DatePicker
                label="End Date"
                value={selectedDateRange.end}
                onChange={(newValue) => {
                  setSelectedDateRange((prev) => ({ ...prev, end: newValue }));
                }}
                sx={{ width: "100%" }}
              />
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedDateRange({ start: null, end: null });
                    setDateRangeAnchor(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setDateRangeAnchor(null)}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </Popover>
        <Modal
          open={openPastEntriesModal}
          onClose={() => setOpenPastEntriesModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, position: "relative" }}>
            {/* Close Button (X) */}
            <IconButton
              onClick={() => setOpenPastEntriesModal(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#555",
                fontSize: {
                  xs: "1.2rem", // small screens
                  sm: "1.5rem", // tablets
                  md: "1.75rem", // medium
                  lg: "2rem", // large
                },
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                    lg: "2rem",
                  },
                }}
              />
            </IconButton>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              mb={2}
            >
              Past Entries
            </Typography>

            <Table>
              <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  {[
                    "ID",
                    "Full Name",
                    "TO/OB",
                    "Place",
                    "Date",
                    "Status",
                    "Position",
                    "Actions",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontWeight: "bold",
                        border: "1px solid #ccc",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {(allPendingData || data || []).filter((row) => {
                  if (!row || !row.type) return false;

                  // Get the request date based on type (use the actual request date, not created_at)
                  let dateStr = null;
                  if (row.type === "OB" && row.official_business) {
                    dateStr = row.official_business.date_of_business || row.official_business.created_at || row.date;
                  } else if (row.type === "TO" && row.travel_order) {
                    dateStr = row.travel_order.date || row.travel_order.created_at || row.date;
                  } else if (row.type === "PS" && row.pass_slip) {
                    dateStr = row.pass_slip.time_start || row.pass_slip.date || row.pass_slip.created_at || row.date;
                  } else {
                    dateStr = row.date;
                  }

                  if (!dateStr) return false;

                  const rowDate = new Date(dateStr);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);

                  // Only show past dates (before today)
                  if (rowDate >= today) return false;

                  const status =
                    row.type === "OB" && row.official_business
                      ? row.official_business.status
                      : row.type === "TO" && row.travel_order
                      ? row.travel_order.status
                      : row.type === "PS" && row.pass_slip
                      ? row.pass_slip.status
                      : undefined;

                  if (userRole === "admin") {
                    return status === "pendingAdmin";
                  }
                  if (userRole === "evaluator") {
                    return status === "pending";
                  }

                  return false;
                }).length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8} // Updated from 7 to 8 to account for the new ID column
                      sx={{ textAlign: "center", border: "1px solid #ccc" }}
                    >
                      No data available
                    </TableCell>
                  </TableRow>
                )}

                {(allPendingData || data || [])
                  .filter((row) => {
                    if (!row || !row.type) return false;

                    // Get the request date based on type (use the actual request date, not created_at)
                    let dateStr = null;
                    if (row.type === "OB" && row.official_business) {
                      dateStr = row.official_business.date_of_business || row.official_business.created_at || row.date;
                    } else if (row.type === "TO" && row.travel_order) {
                      dateStr = row.travel_order.date || row.travel_order.created_at || row.date;
                    } else if (row.type === "PS" && row.pass_slip) {
                      dateStr = row.pass_slip.time_start || row.pass_slip.date || row.pass_slip.created_at || row.date;
                    } else {
                      dateStr = row.date;
                    }

                    if (!dateStr) return false;

                    const rowDate = new Date(dateStr);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    // Only show past dates (before today)
                    if (rowDate >= today) return false;

                    const status =
                      row.type === "OB" && row.official_business
                        ? row.official_business.status
                        : row.type === "TO" && row.travel_order
                        ? row.travel_order.status
                        : row.type === "PS" && row.pass_slip
                        ? row.pass_slip.status
                        : undefined;

                    if (userRole === "admin") {
                      return status === "pendingAdmin";
                    }
                    if (userRole === "evaluator") {
                      return status === "pending";
                    }

                    return false;
                  })
                  .map((row, index) => {
                    const status =
                      row.type === "OB" && row.official_business
                        ? row.official_business.status
                        : row.type === "TO" && row.travel_order
                        ? row.travel_order.status
                        : row.type === "PS" && row.pass_slip
                        ? row.pass_slip.status
                        : "N/A";

                    return (
                      <TableRow key={index}>
                        {/* ID Column - New first column */}
                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          {row.type === "OB"
                            ? row.official_business?.id
                            : row.type === "TO"
                            ? row.travel_order?.id
                            : row.type === "PS"
                            ? row.pass_slip?.pass_slip_id
                            : "N/A"}
                        </TableCell>

                        <TableCell
                          sx={{ 
                            border: "1px solid #ccc", 
                            textAlign: "center",
                            maxWidth: "200px",
                            width: "200px",
                          }}
                        >
                          <Box
                            sx={{
                              textAlign: "left",
                            }}
                          >
                            {row.employees && row.employees.length > 0 ? (
                              <>
                                <div>
                                  {row.employees[0].last_name}, {row.employees[0].first_name}{" "}
                                  {row.employees[0].middle_name && `${row.employees[0].middle_name[0]}.`}
                                </div>
                                {row.employees.length > 1 && (
                                  <div style={{ color: "#666", fontSize: "0.875rem" }}>
                                    and {row.employees.length - 1} more
                                  </div>
                                )}
                              </>
                            ) : "N/A"}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          {row.type === "OB"
                            ? row.official_business?.data_from
                            : row.type === "TO"
                            ? row.travel_order?.data_from
                            : row.type === "PS"
                            ? "Pass Slip"
                            : "N/A"}
                        </TableCell>

                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          {row.type === "OB"
                            ? row.official_business?.travel_to
                            : row.type === "TO"
                            ? row.travel_order?.destination
                            : row.type === "PS"
                            ? row.pass_slip?.place_to_visit
                            : "N/A"}
                        </TableCell>

                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          {new Date(
                            row.type === "OB"
                              ? row.official_business?.created_at
                              : row.type === "TO"
                              ? row.travel_order?.date
                              : row.type === "PS"
                              ? row.pass_slip?.created_at
                              : new Date()
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          {status}
                        </TableCell>

                        <TableCell
                          sx={{
                            border: "1px solid #ccc",
                            textAlign: "center",
                            p: 0,
                          }}
                        >
                          <Box
                            sx={{
                              maxHeight: 100, // Adjust height as needed
                              overflowY: "auto",
                              overflowX: "hidden",
                              px: 1,
                              py: 0.5,
                            }}
                          >
                            {row.employees?.map((emp, i) => (
                              <div key={i}>{emp.position_name}</div>
                            ))}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{ border: "1px solid #ccc", textAlign: "center" }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                let selectedId = null;
                                let selectedData = null;

                                if (row.type === "OB") {
                                  selectedId = row.official_business?.id;
                                  selectedData = {
                                    ...row.official_business,
                                    employees: row.employees || [],
                                  };
                                } else if (row.type === "TO") {
                                  selectedId = row.travel_order?.id;
                                  selectedData = {
                                    ...row.travel_order,
                                    employees: row.employees || [],
                                  };
                                } else if (row.type === "PS") {
                                  selectedId = row.pass_slip?.pass_slip_id;
                                  selectedData = {
                                    ...row.pass_slip,
                                    employees: row.employees || [],
                                  };
                                }

                                setSelectedTravelId(selectedId);
                                setSelectedRowType(row.type);
                                setSelectedTravelData(selectedData);
                                setOpenInfo(true);
                              }}
                            >
                              <InfoOutlinedIcon />
                            </IconButton>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: "#1976D2",
                                color: "white",
                                borderRadius: "8px",
                              }}
                              onClick={() => {
                                let selectedId = null;

                                if (row.type === "OB") {
                                  selectedId = row.official_business?.id;
                                } else if (row.type === "TO") {
                                  selectedId = row.travel_order?.id;
                                } else if (row.type === "PS") {
                                  selectedId = row.pass_slip?.pass_slip_id;
                                }

                                setSelectedTravelId(selectedId);
                                setSelectedRowType(row.type);

                                if (userRole === "evaluator") {
                                  // Close the modal first
                                  setOpenPastEntriesModal(false);

                                  // Delay the Swal just a bit to let the modal close and backdrop disappear
                                  setTimeout(() => {
                                    Swal.fire({
                                      title: `${
                                        row.type === "OB"
                                          ? "Confirm Official Business"
                                          : row.type === "TO"
                                          ? "Confirm Travel Order"
                                          : "Confirm Pass Slip"
                                      }`,
                                      text: `Are you sure you want to confirm this ${
                                        row.type === "OB"
                                          ? "official business"
                                          : row.type === "TO"
                                          ? "travel order"
                                          : "pass slip"
                                      }? This will send it to the admin for final approval.`,
                                      icon: "warning",
                                      showCancelButton: true,
                                      confirmButtonText: "Confirm",
                                      cancelButtonText: "Cancel",
                                      reverseButtons: false,
                                    }).then((result) => {
                                      if (result.isConfirmed) {
                                        approveTravelOrder(
                                          selectedId,
                                          row.type
                                        );
                                      }
                                    });
                                  }, 200); // Delay to ensure modal and backdrop are gone
                                } else {
                                  handleClickOpen();
                                }
                              }}
                            >
                              {userRole === "evaluator" ? "Confirm" : "Approve"}
                            </Button>

                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: "#D32F2F",
                                color: "white",
                                borderRadius: "8px",
                              }}
                              onClick={() => {
                                setOpenPastEntriesModal(false);

                                // ✅ Correctly extract ID based on type
                                let selectedId = null;
                                if (
                                  row.type === "OB" &&
                                  row.official_business?.id
                                ) {
                                  selectedId = row.official_business.id;
                                } else if (
                                  row.type === "TO" &&
                                  row.travel_order?.id
                                ) {
                                  selectedId = row.travel_order.id;
                                } else if (
                                  row.type === "PS" &&
                                  row.pass_slip?.pass_slip_id
                                ) {
                                  selectedId = row.pass_slip.pass_slip_id;
                                }

                                setSelectedTravelId(selectedId);

                                if (["evaluator", "admin"].includes(userRole)) {
                                  Swal.fire({
                                    title:
                                      row.type === "OB"
                                        ? userRole === "evaluator" ? "Remove Official Business" : "Decline Official Business"
                                        : row.type === "TO"
                                        ? userRole === "evaluator" ? "Remove Travel Order" : "Decline Travel Order"
                                        : row.type === "PS"
                                        ? userRole === "evaluator" ? "Remove Pass Slip" : "Decline Pass Slip"
                                        : userRole === "evaluator" ? "Remove Request" : "Decline Request",
                                    text:
                                      `Are you sure you want to ${userRole === "evaluator" ? "remove" : "decline"} this ` +
                                      (row.type === "OB"
                                        ? "official business"
                                        : row.type === "TO"
                                        ? "travel order"
                                        : row.type === "PS"
                                        ? "pass slip"
                                        : "entry") +
                                      "?",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: userRole === "evaluator" ? "Remove" : "Decline",
                                    cancelButtonText: "Cancel",
                                    reverseButtons: false,
                                    zIndex: 999999999999,
                                  }).then((result) => {
                                    if (result.isConfirmed) {
                                      Swal.fire({
                                        title: "Please input remarks",
                                        input: "textarea",
                                        inputPlaceholder:
                                          "Enter your remarks here...",
                                        showCancelButton: true,
                                        confirmButtonText: "Submit",
                                        cancelButtonText: "Cancel",
                                        reverseButtons: false,
                                        inputValidator: (value) => {
                                          if (!value)
                                            return "Remarks are required!";
                                        },
                                        zIndex: 999999999999,
                                      }).then((remarksResult) => {
                                        if (remarksResult.isConfirmed) {
                                          const remarks = remarksResult.value;

                                          // ✅ Call decline with correct ID and type
                                          declineTravelOrder(
                                            selectedId,
                                            remarks,
                                            row.type
                                          );
                                        }
                                      });
                                    }
                                  });
                                } else {
                                  handleClickOpen();
                                }
                              }}
                            >
                              {userRole === "evaluator" ? "Remove" : "Decline"}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </Box>
        </Modal>
      </>
      {/* Rows per page selector */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Show:</Typography>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            const newRowsPerPage = e.target.value === "all" ? "all" : Number(e.target.value);
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1); // Reset to first page when changing rows per page
          }}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value="all">Show All</option>
        </select>
        <Typography variant="body2">entries</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "10",
          overflowY: "hidden",
          overflowX: { xs: "auto", sm: "hidden" }, // Allow horizontal scroll on mobile
        }}
      >
        {/* Check if the data is still being fetched */}
        {isLoading ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Fetching data, please wait...
          </Box>
        ) : data.length === 0 ||
          !data.some((row) => {
            if (!row || !row.type) return false;
            const status =
              row.type === "OB" && row.official_business
                ? row.official_business.status
                : row.type === "TO" && row.travel_order
                ? row.travel_order.status
                : row.type === "PS" && row.pass_slip
                ? row.pass_slip.status
                : undefined;

            // Admin only sees requests confirmed by evaluator (pendingAdmin)
            // Evaluator only sees initial pending requests (pending)
            if (userRole === "admin") return status === "pendingAdmin";
            if (userRole === "evaluator") return status === "pending";
            return false;
          }) ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            No data available
          </Box>
        ) : (
          <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow 
                selected={false}
                className="table-header-row"
                aria-selected={false}
                sx={{ 
                  "&.Mui-selected": { 
                    backgroundColor: "#f0f0f0 !important",
                    "&:hover": {
                      backgroundColor: "#f0f0f0 !important"
                    }
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0 !important"
                  },
                  backgroundColor: "#f0f0f0 !important",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  // Explicitly prevent any selection styling
                  "&.Mui-selected, &[aria-selected='true']": {
                    backgroundColor: "#f0f0f0 !important",
                    color: "inherit !important"
                  }
                }}
              >
                {isSelectMode && (
                  <TableCell 
                    padding="checkbox" 
                    data-padding="checkbox"
                    sx={{ 
                      backgroundColor: "#f0f0f0 !important",
                      pointerEvents: "auto !important"
                    }}
                  >
                    <Checkbox
                      indeterminate={selectedRows.size > 0 && selectedRows.size < filteredData.length}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                )}
                {[
                  "Request Date",
                  "Full Name",
                  "TO/OB",
                  "Place",
                  "Duration",
                  "Position",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                // If no filtered rows, show a single row saying no data
                if (filteredData.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={isSelectMode ? 8 : 7} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  );
                }

                // Otherwise, map the paginated data to rows
                return paginatedData.map((row, index) => {
                  const globalIndex = startIndex + index;
                  
                  return (
                  <TableRow key={index} selected={isSelectMode && isRowSelected(globalIndex)}>
                    {isSelectMode && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isRowSelected(globalIndex)}
                          onChange={() => handleSelectRow(globalIndex)}
                          color="primary"
                        />
                      </TableCell>
                    )}
                    {/* Request Date */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {(() => {
                        const displayDate =
                          row.type === "OB"
                            ? row.official_business?.date
                            : row.type === "TO"
                            ? row.travel_order?.date
                            : row.type === "PS"
                            ? row.pass_slip?.date || row.pass_slip?.created_at
                            : null;
                        
                        if (!displayDate) return "N/A";
                        
                        try {
                          return new Date(displayDate).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                        } catch (e) {
                          return "N/A";
                        }
                      })()}
                    </TableCell>

                    <TableCell
                      sx={{ 
                        border: "1px solid #ccc", 
                        textAlign: "center",
                        maxWidth: "200px",
                        width: "200px",
                      }}
                    >
                      <Box
                        sx={{ 
                          textAlign: "left",
                        }}
                      >
                        {row.employees && row.employees.length > 0 ? (
                          <>
                            <div>
                              {row.employees[0].last_name}, {row.employees[0].first_name}{" "}
                              {row.employees[0].middle_name && `${row.employees[0].middle_name[0]}.`}
                            </div>
                            {row.employees.length > 1 && (
                              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                                and {row.employees.length - 1} more
                              </div>
                            )}
                          </>
                        ) : "N/A"}
                      </Box>
                    </TableCell>

                    {/* TO/OB/PS */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? row.official_business?.data_from
                        : row.type === "TO"
                        ? row.travel_order?.data_from
                        : row.type === "PS"
                        ? "Pass Slip"
                        : "N/A"}
                    </TableCell>

                    {/* Place */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? row.official_business?.travel_to
                        : row.type === "TO"
                        ? row.travel_order?.destination
                        : row.type === "PS"
                        ? row.pass_slip?.place_to_visit
                        : "N/A"}
                    </TableCell>

                    {/* Duration */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {(() => {
                        try {
                          if (row.type === "TO") {
                            const startDate = row.travel_order?.travel_start_date;
                            const endDate = row.travel_order?.travel_end_date;
                            
                            if (!startDate || !endDate) return "N/A";
                            
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
                            
                            const startFormatted = start.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            const endFormatted = end.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            
                            return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                          } else if (row.type === "OB") {
                            // For OB, check if there are start/end dates available
                            const startDate = row.official_business?.itinerary_from;
                            const endDate = row.official_business?.itinerary_to;
                            
                            if (!startDate || !endDate) {
                              // If no itinerary dates, check date_of_business
                              const businessDate = row.official_business?.date_of_business;
                              if (businessDate) {
                                const dateFormatted = new Date(businessDate).toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                return `${dateFormatted} (1 day)`;
                              }
                              return "N/A";
                            }
                            
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                            
                            const startFormatted = start.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            const endFormatted = end.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            
                            return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                          } else if (row.type === "PS") {
                            // For Pass Slip, check time_start and time_end or date
                            const startTime = row.pass_slip?.time_start;
                            const endTime = row.pass_slip?.time_end;
                            const date = row.pass_slip?.date;
                            
                            if (startTime && endTime) {
                              const start = new Date(startTime);
                              const end = new Date(endTime);
                              
                              // If same day, calculate hours
                              if (start.toDateString() === end.toDateString()) {
                                const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
                                const dateFormatted = start.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                return `${dateFormatted} (${Math.round(diffHours * 10) / 10} hour${diffHours !== 1 ? "s" : ""})`;
                              } else {
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                
                                const startFormatted = start.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                const endFormatted = end.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                
                                return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                              }
                            } else if (date) {
                              const dateFormatted = new Date(date).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              return `${dateFormatted} (1 day)`;
                            }
                            
                            return "N/A";
                          }
                          
                          return "N/A";
                        } catch (e) {
                          console.error("Error calculating duration:", e);
                          return "N/A";
                        }
                      })()}
                    </TableCell>

                    {/* Position */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {(() => {
                        if (
                          (row.type === "PS" || row.type === "TO") &&
                          row.pass_slip
                        ) {
                          return <div>{row.pass_slip.position_name}</div>;
                        } else if (row.employees) {
                          return row.employees.map((emp, i) => (
                            <div key={i}>{emp.position_name}</div>
                          ));
                        } else {
                          return null;
                        }
                      })()}
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 0.5,
                          flexWrap: "nowrap",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{ flexShrink: 0 }}
                          onClick={() => {
                            let selectedId = null;
                            let selectedData = null;

                            if (row.type === "OB") {
                              selectedId = row.official_business?.id;
                              // Merge employees into selectedData
                              selectedData = {
                                ...row.official_business,
                                employees: row.employees || [], // Ensure employees array is included
                              };

                              if (selectedData.employees.length > 0) {
                                selectedData.employees.forEach((emp) => {
                                  console.log(
                                    ` - ${emp.first_name} ${emp.last_name} (${emp.position_name})`
                                  );
                                });
                              }
                            } else if (row.type === "TO") {
                              selectedId = row.travel_order?.id;
                              selectedData = {
                                ...row.travel_order,
                                employees: row.employees || [],
                              };

                              if (selectedData.employees.length > 0) {
                                selectedData.employees.forEach((emp) => {
                                  console.log(
                                    ` - ${emp.first_name} ${emp.last_name} (${emp.position_name})`
                                  );
                                });
                              }
                            } else if (row.type === "PS") {
                              selectedId = row.pass_slip?.pass_slip_id;
                              selectedData = {
                                ...row.pass_slip,
                                employees: row.employees || [],
                              };
                            }

                            setSelectedTravelId(selectedId);
                            setSelectedRowType(row.type);
                            setSelectedTravelData(selectedData);
                            setOpenInfo(true);
                          }}
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#1976D2",
                            color: "white",
                            borderRadius: "8px",
                            minWidth: "auto",
                            padding: "4px 12px",
                            fontSize: "0.75rem",
                            flexShrink: 0,
                          }}
                          onClick={() => {
                            let selectedId = null;

                            if (row.type === "OB") {
                              selectedId = row.official_business?.id;
                            } else if (row.type === "TO") {
                              selectedId = row.travel_order?.id;
                            } else if (row.type === "PS") {
                              selectedId = row.pass_slip?.pass_slip_id;
                            }

                            setSelectedTravelId(selectedId);
                            setSelectedRowType(row.type);

                            if (userRole === "evaluator") {
                              Swal.fire({
                                title: `${
                                  row.type === "OB"
                                    ? "Confirm Official Business"
                                    : row.type === "TO"
                                    ? "Confirm Travel Order"
                                    : "Confirm Pass Slip"
                                }`,
                                text: `Are you sure you want to confirm this ${
                                  row.type === "OB"
                                    ? "official business"
                                    : row.type === "TO"
                                    ? "travel order"
                                    : "pass slip"
                                }? This will send it to the admin for final approval.`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: "Confirm",
                                cancelButtonText: "Cancel",
                                reverseButtons: false,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  approveTravelOrder(selectedId, row.type);
                                }
                              });
                            } else {
                              handleClickOpen();
                            }
                          }}
                        >
                          {userRole === "evaluator" ? "Confirm" : "Approve"}
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          sx={{
                            backgroundColor: "#D32F2F",
                            color: "white",
                            borderRadius: "8px",
                            minWidth: "auto",
                            padding: "4px 12px",
                            fontSize: "0.75rem",
                            flexShrink: 0,
                          }}
                          onClick={() => {
                            let id = null;

                            if (row.type === "OB") {
                              id = row.official_business?.id;
                            } else if (row.type === "TO") {
                              id = row.travel_order?.id;
                            } else if (row.type === "PS") {
                              id = row.pass_slip?.pass_slip_id; // ✅ Correct field for Pass Slip
                            }

                            if (!id) {
                              console.error(
                                "❌ Cannot decline: ID is undefined."
                              );
                              Swal.fire(
                                "Error",
                                "No valid ID found for this entry.",
                                "error"
                              );
                              return;
                            }

                            setSelectedTravelId(id);

                            if (["evaluator", "admin"].includes(userRole)) {
                              Swal.fire({
                                title:
                                  row.type === "OB"
                                    ? userRole === "evaluator" ? "Remove Official Business" : "Decline Official Business"
                                    : row.type === "TO"
                                    ? userRole === "evaluator" ? "Remove Travel Order" : "Decline Travel Order"
                                    : userRole === "evaluator" ? "Remove Pass Slip" : "Decline Pass Slip",
                                text: `Are you sure you want to ${userRole === "evaluator" ? "remove" : "decline"} this ${
                                  row.type === "OB"
                                    ? "official business"
                                    : row.type === "TO"
                                    ? "travel order"
                                    : "pass slip"
                                }?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonText: userRole === "evaluator" ? "Remove" : "Decline",
                                cancelButtonText: "Cancel",
                                reverseButtons: false,
                              }).then((result) => {
                                if (result.isConfirmed) {
                                  Swal.fire({
                                    title: "Please input remarks",
                                    input: "textarea",
                                    inputPlaceholder:
                                      "Enter your remarks here...",
                                    showCancelButton: true,
                                    confirmButtonText: "Submit",
                                    cancelButtonText: "Cancel",
                                    inputValidator: (value) => {
                                      if (!value)
                                        return "Remarks are required!";
                                    },
                                  }).then((remarksResult) => {
                                    if (remarksResult.isConfirmed) {
                                      const remarks = remarksResult.value;
                                      declineTravelOrder(id, remarks, row.type);
                                    }
                                  });
                                }
                              });
                            } else {
                              handleClickOpen();
                            }
                          }}
                        >
                          {userRole === "evaluator" ? "Remove" : "Decline"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                  );
                });
            })()}
            </TableBody>
          </Table>
        )}

        {/* Pagination controls */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
            px: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {startEntry}-{endEntry} of {filteredData.length}
          </Typography>

          {/* Only show manual pagination when not showing all and has multiple pages */}
          {!isShowAll && totalPages > 1 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handlePageChange(null, currentPage - 1)}
                disabled={currentPage === 1}
                size="small"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>

              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "contained" : "text"}
                  size="small"
                  onClick={() => handlePageChange(null, pageNum)}
                  sx={{
                    fontWeight: currentPage === pageNum ? 600 : 400,
                    backgroundColor:
                      currentPage === pageNum ? "primary.main" : "transparent",
                    color:
                      currentPage === pageNum
                        ? "primary.contrastText"
                        : "text.primary",
                    "&:hover": {
                      backgroundColor:
                        currentPage === pageNum
                          ? "primary.dark"
                          : "action.hover",
                    },
                    minWidth: 32,
                    height: 32,
                  }}
                >
                  {pageNum}
                </Button>
              ))}

              <IconButton
                onClick={() => handlePageChange(null, currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                size="small"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </TableContainer>

      {/* Modal for approving button in pending */}
            <BootstrapDialog
              onClose={handleClose}
              aria-labelledby="customized-dialog-title"
              open={open}
              sx={{
                "& .MuiDialog-paper": { width: "95vw", maxWidth: 500 }, // Responsive width
              }}
            >
              <DialogTitle
                sx={{
                  m: 0,
                  p: { xs: 1.5, sm: 2 },
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
                id="customized-dialog-title"
              >
                Approve Request
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <DialogContent
                dividers
                sx={{
                  maxHeight: "75vh",
                  overflowY: "auto",
                  p: { xs: 2, sm: 3 },
                }}
              >
                <Card
                  sx={{
                    p: { xs: 2, sm: 4 },
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Card sx={{ padding: 2, marginTop: 2 }}>
                    <CardContent>
                      <Typography variant="h6" align="center">
                        Approved By:
                      </Typography>

                      {Headposition?.oic_name && Headposition?.chief_name ? (
                        <>
                          <Typography align="center">
                            {Headposition.oic_name} <strong>(OIC)</strong>{" "}
                            <br />
                            <strong>FOR: {Headposition.chief_name}</strong>
                          </Typography>
                        </>
                      ) : Headposition?.chief_name ? (
                        <Typography align="center">
                          {Headposition.chief_name}
                        </Typography>
                      ) : (
                        <Typography align="center">N/A</Typography>
                      )}

                      {signatureUrl ? (
                        <CardMedia
                          component="img"
                          sx={{
                            maxHeight: 300,
                            maxWidth: "100%",
                            display: "block",
                            margin: "0 auto",
                            objectFit: "contain",
                          }}
                          image={signatureUrl}
                          title="e-signature"
                        />
                      ) : (
                        <Typography align="center" sx={{ marginTop: 2 }}>
                          No signature available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>

                  <Box display="flex" justifyContent="center" mt={3}>
                    <Button
                      variant="contained"
                      onClick={
                        () =>
                          handleSubmitUpdate({ chiefId, regionalHeadId, oicId }) // ✅ Pass all needed IDs as an object
                      }
                      disabled={isSubmitting}
                      sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        "&:hover": { backgroundColor: "#D9D9D9" },
                      }}
                    >
                      {isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Approve"
                      )}
                    </Button>
                  </Box>
                </Card>
              </DialogContent>
            </BootstrapDialog>

      {/* Info Modal Dialog */}
      <Dialog open={openInfo && !!selectedTravelData} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Request Details
            <IconButton onClick={() => setOpenInfo(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              {selectedRowType === "TO" && selectedTravelData && (
                <>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Status:</Typography><Chip label={selectedTravelData.status || "N/A"} size="small" sx={{ fontWeight: 500, backgroundColor: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#e3f5e2" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#ffecec" : "#fff8e6", color: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#2e7d32" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#d32f2f" : "#ff9800" }} /></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Destination:</Typography><Typography variant="body1">{selectedTravelData.destination || "N/A"}</Typography></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Travel Start:</Typography><Typography variant="body1">{selectedTravelData.travel_start_date ? new Date(selectedTravelData.travel_start_date).toLocaleDateString() : "N/A"}</Typography></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Travel End:</Typography><Typography variant="body1">{selectedTravelData.travel_end_date ? new Date(selectedTravelData.travel_end_date).toLocaleDateString() : "N/A"}</Typography></Box>
                  {selectedTravelData.remarks && <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Remarks:</Typography><Typography variant="body1">{selectedTravelData.remarks}</Typography></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Employees:</Typography>
                      {selectedTravelData.employees.map((emp, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, padding: "6px 8px", backgroundColor: "#f5f5f5", borderRadius: "8px", mt: 1 }}>
                          <Typography variant="body2" fontWeight={500}>{emp.last_name}, {emp.first_name}</Typography>
                          {emp.position_name && (
                            <>
                              <Typography variant="body2" color="text.secondary">•</Typography>
                              <Typography variant="body2" color="text.secondary">{emp.position_name}</Typography>
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
              {selectedRowType === "OB" && selectedTravelData && (
                <>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Status:</Typography><Chip label={selectedTravelData.status || "N/A"} size="small" sx={{ fontWeight: 500, backgroundColor: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#e3f5e2" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#ffecec" : "#fff8e6", color: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#2e7d32" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#d32f2f" : "#ff9800" }} /></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Travel To:</Typography><Typography variant="body1">{selectedTravelData.travel_to || "N/A"}</Typography></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Date of Business:</Typography><Typography variant="body1">{selectedTravelData.date_of_business ? new Date(selectedTravelData.date_of_business).toLocaleDateString() : "N/A"}</Typography></Box>
                  {selectedTravelData.remarks && <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Remarks:</Typography><Typography variant="body1">{selectedTravelData.remarks}</Typography></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Employees:</Typography>
                      {selectedTravelData.employees.map((emp, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, padding: "6px 8px", backgroundColor: "#f5f5f5", borderRadius: "8px", mt: 1 }}>
                          <Typography variant="body2" fontWeight={500}>{emp.last_name}, {emp.first_name}</Typography>
                          {emp.position_name && (
                            <>
                              <Typography variant="body2" color="text.secondary">•</Typography>
                              <Typography variant="body2" color="text.secondary">{emp.position_name}</Typography>
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
              {selectedRowType === "PS" && selectedTravelData && (
                <>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Status:</Typography><Chip label={selectedTravelData.status || "N/A"} size="small" sx={{ fontWeight: 500, backgroundColor: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#e3f5e2" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#ffecec" : "#fff8e6", color: selectedTravelData.status === "approved" || selectedTravelData.status === "Approved" ? "#2e7d32" : selectedTravelData.status === "declined" || selectedTravelData.status === "Declined" ? "#d32f2f" : "#ff9800" }} /></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Place to Visit:</Typography><Typography variant="body1">{selectedTravelData.place_to_visit || "N/A"}</Typography></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Time Start:</Typography><Typography variant="body1">{selectedTravelData.time_start ? new Date(selectedTravelData.time_start).toLocaleString() : "N/A"}</Typography></Box>
                  <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Time End:</Typography><Typography variant="body1">{selectedTravelData.time_end ? new Date(selectedTravelData.time_end).toLocaleString() : "N/A"}</Typography></Box>
                  {selectedTravelData.remarks && <Box><Typography variant="body2" color="text.secondary" fontWeight={500}>Remarks:</Typography><Typography variant="body1">{selectedTravelData.remarks}</Typography></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>Employees:</Typography>
                      {selectedTravelData.employees.map((emp, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, padding: "6px 8px", backgroundColor: "#f5f5f5", borderRadius: "8px", mt: 1 }}>
                          <Typography variant="body2" fontWeight={500}>{emp.last_name}, {emp.first_name}</Typography>
                          {emp.position_name && (
                            <>
                              <Typography variant="body2" color="text.secondary">•</Typography>
                              <Typography variant="body2" color="text.secondary">{emp.position_name}</Typography>
                            </>
                          )}
                        </Box>
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
    </Container>
  );
};

////02/17/25 | Function Approving History--to call into the Tabs in the Approving Home
export function ApprovingHistory({
  data,
  isLoading,
  userRole,
  combinedPendingData,
  Headposition,
  signatureUrl,
}) {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    width: {
      xs: "95%", // phones
      sm: "90%", // small tablets
      md: "80%", // medium screens
      lg: "70%", // large screens
    },
    maxHeight: "90vh",
    overflowY: "auto",
  };
  const headPositionId = Headposition?.data?.id || null;
  const name = Headposition?.data?.name || "N/A";
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const [selectedTravelId, setSelectedTravelId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [openPastEntriesModal, setOpenPastEntriesModal] = useState(false);
  const [dateRangeAnchor, setDateRangeAnchor] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });
  const [typeFilterAnchor, setTypeFilterAnchor] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All"); // All, TO, OB, PS
  // Info modal state (like in pending)
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedTravelData, setSelectedTravelData] = useState(null);
  const [selectedRowType, setSelectedRowType] = useState(null);
  // Pagination state for main table
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  // Pagination state for modal table
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [modalRowsPerPage, setModalRowsPerPage] = useState(10);
  
  // Select mode state for bulk PDF download
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Detail components for info modal
  const DetailLabel = ({ children, ...props }) => (
    <Typography
      variant="body2"
      color="text.secondary"
      fontWeight={500}
      {...props}
    >
      {children}
    </Typography>
  );

  const DetailValue = ({ children }) => (
    <Typography variant="body1" component="div" fontWeight={400}>
      {children}
    </Typography>
  );

  const StatusChip = ({ status }) => (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor:
          status === "approved" || status === "Approved"
            ? "#e3f5e2"
            : status === "pending" || status === "Pending"
            ? "#fff8e6"
            : "#ffecec",
        color:
          status === "approved" || status === "Approved"
            ? "#2e7d32"
            : status === "pending" || status === "Pending"
            ? "#ff9800"
            : "#d32f2f",
      }}
    />
  );

  const EmployeeBadge = ({ name, position }) => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "6px 8px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
      }}
    >
      <Typography variant="body2" fontWeight={500}>
        {name}
      </Typography>
      {position && (
        <>
          <Typography variant="body2" color="text.secondary">
            •
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {position}
          </Typography>
        </>
      )}
    </Box>
  );

  // Apply date range and type filtering
  const filteredDataWithDateRange = useMemo(() => {
    let filtered = data || [];

    // Type filter
    if (selectedTypeFilter !== "All") {
      filtered = filtered.filter((row) => row.type === selectedTypeFilter);
    }

    // Date range filtering
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter((row) => {
        const status =
          row.type === "OB" && row.official_business
            ? row.official_business.status
            : row.type === "TO" && row.travel_order
            ? row.travel_order.status
            : row.type === "PS" && row.pass_slip
            ? row.pass_slip.status
            : undefined;

        if (status !== "approved") return false;

        const dateStr =
          row.type === "OB"
            ? row.official_business?.date_of_business
            : row.type === "TO"
            ? row.travel_order?.date
            : row.type === "PS"
            ? row.pass_slip?.time_start || row.pass_slip?.date
            : null;

        if (!dateStr) return false;

        const rowDate = dayjs(dateStr);
        if (!rowDate.isValid()) return false;

        return rowDate.isBetween(
          selectedDateRange.start.startOf("day"),
          selectedDateRange.end.endOf("day"),
          null,
          "[]"
        );
      });
    }

    return filtered;
  }, [data, selectedDateRange, selectedTypeFilter]);

  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  
  // Get filtered data for selection logic
  const getFilteredData = () => {
    return filteredDataWithDateRange.filter((row) => {
      const status =
        row.type === "OB" && row.official_business
          ? row.official_business.status
          : row.type === "TO" && row.travel_order
          ? row.travel_order.status
          : row.type === "PS" && row.pass_slip
          ? row.pass_slip.status
          : undefined;

      // Filter for approved status (not declined)
      if (status !== "approved" && status !== "Approved") return false;

      return (
        userRole === "admin" ||
        userRole === "evaluator" ||
        status === "approved" ||
        status === "Approved"
      );
    });
  };
  
  // Bulk selection handlers
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const filteredData = getFilteredData();
      const allDataRowIds = new Set(
        filteredData.map((row, idx) => idx)
      );
      setSelectedRows(allDataRowIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const isRowSelected = (index) => selectedRows.has(index);
  
  const filteredDataForSelection = getFilteredData();
  const isAllSelected = filteredDataForSelection.length > 0 && selectedRows.size === filteredDataForSelection.length;
  
  // Bulk download PDF function
  const handleBulkDownloadPDF = async () => {
    if (selectedRows.size === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select at least one row to download.",
        icon: "warning",
      });
      return;
    }

    const filteredData = getFilteredData();
    let successCount = 0;
    let failCount = 0;

    for (const index of selectedRows) {
      try {
        const row = filteredData[index];
        if (!row) continue;

        // Trigger download for each row by calling handleClickOpen
        handleClickOpen(row);
        
        // Wait a bit for the PDF modal to open and user can download
        // In a real implementation, you might want to programmatically trigger downloads
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        successCount++;
      } catch (error) {
        console.error("Error downloading PDF:", error);
        failCount++;
      }
    }

    setSelectedRows(new Set());
    setIsSelectMode(false);

    Swal.fire({
      title: "Bulk Download Initiated",
      text: `Opening PDF preview for ${successCount} item(s). ${failCount > 0 ? `${failCount} failed.` : ""}`,
      icon: successCount > 0 ? "success" : "error",
    });
  };
  
  const handleClickOpen = (row) => {
    if (!row) {
      console.error("No row data provided");
      return;
    }

    console.log("Row received:", row);
    setSelectedRow(row);
    setOpen(true);

    switch (row.type) {
      case "PS":
        console.log("Row type is PS");
        // Add your logic here, e.g.:
        if (row.pass_slip) {
          console.log("Pass Slip data:", row.pass_slip);
          // You can open a modal or navigate, etc.
        }
        break;

      case "OB":
        console.log("Row type is OB");
        if (row.ob_request) {
          console.log("OB Request data:", row.ob_request);
        }
        break;

      default:
        console.log("Row has an unrecognized type:", row.type);
        if (row.travel_order) {
          console.log("Row has a travel_order:", row.travel_order);
        } else {
          console.error(
            "Row does not have a valid type (PS or OB) or a travel_order:",
            row
          );
        }
        break;
    }
  };

  const handleApprove = () => {
    Swal.fire({
      title: "Successfully approved!",
      icon: "success",
    });
    handleClose();
  };
  const handleAddMore = (row) => {
    let id;

    if (row.type === "TO") {
      id = row.travel_order?.id;
    } else if (row.type === "OB") {
      id = row.official_business?.id;
    } else if (row.type === "PS") {
      id = row.pass_slip?.pass_slip_id;
    }

    console.log(`Clicked Add More for row id: ${id}, type: ${row.type}`);
  };

  return (
    <Container
      sx={{
        overflowY: "hidden",
        overflowX: { xs: "auto", sm: "hidden" }, // Allow horizontal scroll on mobile
      }}
    >
      <Box sx={{ 
        display: "flex", 
        justifyContent: { xs: "flex-start", sm: "flex-end" }, 
        gap: { xs: 0.5, sm: 1 }, 
        mb: 1,
        flexWrap: "wrap",
      }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => setDateRangeAnchor(e.currentTarget)}
          startIcon={<AccessTimeOutlined />}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "4px 8px", sm: "6px 16px" },
            minWidth: { xs: "auto", sm: "64px" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Date Range
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Date
          </Box>
        </Button>
        <Button
          variant="outlined"
          color="primary"
          endIcon={<ArrowDropDown />}
          onClick={(e) => setTypeFilterAnchor(e.currentTarget)}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "4px 8px", sm: "6px 16px" },
            minWidth: { xs: "auto", sm: "64px" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Filter: {selectedTypeFilter === "TO" ? "Travel Orders" : selectedTypeFilter === "OB" ? "Official Business" : selectedTypeFilter === "PS" ? "Pass Slips" : "All"}
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            {selectedTypeFilter === "TO" ? "TO" : selectedTypeFilter === "OB" ? "OB" : selectedTypeFilter === "PS" ? "PS" : "All"}
          </Box>
        </Button>
        <Menu
          anchorEl={typeFilterAnchor}
          open={Boolean(typeFilterAnchor)}
          onClose={() => setTypeFilterAnchor(null)}
        >
          <MenuItem onClick={() => { setSelectedTypeFilter("All"); setTypeFilterAnchor(null); }}>
            All
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("TO"); setTypeFilterAnchor(null); }}>
            Travel Orders
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("OB"); setTypeFilterAnchor(null); }}>
            Official Business
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("PS"); setTypeFilterAnchor(null); }}>
            Pass Slips
          </MenuItem>
        </Menu>
        {!isSelectMode ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsSelectMode(true)}
            sx={{
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              padding: { xs: "4px 8px", sm: "6px 16px" },
              minWidth: { xs: "auto", sm: "64px" },
            }}
          >
            Select
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                setIsSelectMode(false);
                setSelectedRows(new Set());
              }}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                padding: { xs: "4px 8px", sm: "6px 16px" },
                minWidth: { xs: "auto", sm: "64px" },
              }}
            >
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                Cancel Select
              </Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                Cancel
              </Box>
            </Button>
            {selectedRows.size > 0 && (
              <Button
                variant="contained"
                color="success"
                startIcon={<FileDownloadOutlined />}
                onClick={handleBulkDownloadPDF}
                disabled={isLoading}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  padding: { xs: "4px 8px", sm: "6px 16px" },
                  minWidth: { xs: "auto", sm: "64px" },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                  Download Selected PDFs ({selectedRows.size})
                </Box>
                <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
                  Download ({selectedRows.size})
                </Box>
              </Button>
            )}
          </>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenPastEntriesModal(true)}
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.875rem" },
            padding: { xs: "4px 8px", sm: "6px 16px" },
            minWidth: { xs: "auto", sm: "64px" },
          }}
        >
          <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
            Past Entries
          </Box>
          <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>
            Past
          </Box>
        </Button>

        <Popover
          open={Boolean(dateRangeAnchor)}
          anchorEl={dateRangeAnchor}
          onClose={() => setDateRangeAnchor(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2, minWidth: 300 }}>
              <DatePicker
                label="Start Date"
                value={selectedDateRange.start}
                onChange={(newValue) => {
                  setSelectedDateRange((prev) => ({ ...prev, start: newValue }));
                }}
                sx={{ width: "100%" }}
              />
              <DatePicker
                label="End Date"
                value={selectedDateRange.end}
                onChange={(newValue) => {
                  setSelectedDateRange((prev) => ({ ...prev, end: newValue }));
                }}
                sx={{ width: "100%" }}
              />
              <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button
                  size="small"
                  onClick={() => {
                    setSelectedDateRange({ start: null, end: null });
                    setDateRangeAnchor(null);
                  }}
                >
                  Clear
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => setDateRangeAnchor(null)}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </LocalizationProvider>
        </Popover>

        <Modal
          open={openPastEntriesModal}
          onClose={() => setOpenPastEntriesModal(false)}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <IconButton
              onClick={() => setOpenPastEntriesModal(false)}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "#555",
                fontSize: {
                  xs: "1.2rem", // small screens
                  sm: "1.5rem", // tablets
                  md: "1.75rem", // medium
                  lg: "2rem", // large
                },
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: {
                    xs: "1.2rem",
                    sm: "1.5rem",
                    md: "1.75rem",
                    lg: "2rem",
                  },
                }}
              />
            </IconButton>
            <Typography id="modal-title" variant="h6" component="h2" mb={2}>
              Past Entries
            </Typography>

            {/* Rows per page selector for modal */}
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2">Show:</Typography>
              <select
                value={modalRowsPerPage}
                onChange={(e) => {
                  const newRowsPerPage = e.target.value === "all" ? "all" : Number(e.target.value);
                  setModalRowsPerPage(newRowsPerPage);
                  setModalCurrentPage(1); // Reset to first page when changing rows per page
                }}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value="all">Show All</option>
              </select>
              <Typography variant="body2">entries</Typography>
            </Box>

            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                overflowX: { xs: "auto", sm: "hidden" }, // Allow horizontal scroll on mobile
                overflowY: "visible",
                fontSize: "10px",
                position: "relative",
                WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
                "&::-webkit-scrollbar": {
                  height: "8px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "#ccc",
                  borderRadius: "4px",
                },
              }}
            >
              {isLoading ? (
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                >
                  Fetching data, please wait...
                </Box>
              ) : data.length === 0 ? (
                <Box
                  sx={{
                    textAlign: "center",
                    padding: "20px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  No data available
                </Box>
              ) : (
                <Table
                  sx={{
                    minWidth: { xs: "800px", sm: "100%" }, // Ensure table has minimum width on mobile for scrolling
                    width: "100%",
                    borderCollapse: "collapse",
                    display: "table", // Keep as table for proper scrolling
                  }}
                >
                  <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                    <TableRow
                      sx={{ display: { xs: "block", sm: "table-row" } }}
                    >
                      {[
                        "Full Name",
                        "TO/OB",
                        "Place",
                        "Date",
                        "Status",
                        "Position",
                        "Actions",
                      ].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: "bold",
                            border: "1px solid #ccc",
                            textAlign: "center",
                            display: { xs: "block", sm: "table-cell" },
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            padding: { xs: "4px", sm: "8px" },
                            minWidth: { xs: "auto", sm: "60px" },
                          }}
                        >
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(() => {
                      const modalFilteredData = data.filter((row) => {
                        const status =
                          row.type === "OB" && row.official_business
                            ? row.official_business.status
                            : row.type === "TO" && row.travel_order
                            ? row.travel_order.status
                            : row.type === "PS" && row.pass_slip
                            ? row.pass_slip.status
                            : undefined;

                        if (status !== "declined") return false;

                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        const rowDate = new Date(
                          row.type === "OB"
                            ? row.official_business?.date_of_business
                            : row.type === "TO"
                            ? row.travel_order?.date
                            : row.type === "PS"
                            ? row.pass_slip?.created_at
                            : null
                        );
                        rowDate.setHours(0, 0, 0, 0);

                        if (rowDate.getTime() >= today.getTime()) return false;

                        if (userRole === "admin" || userRole === "evaluator")
                          return true;

                        return status === "approved";
                      });

                      // Pagination logic for modal
                      const isShowAll = modalRowsPerPage === "all";
                      const itemsPerPage = isShowAll ? modalFilteredData.length : Number(modalRowsPerPage);
                      const totalPages = isShowAll ? 1 : Math.ceil(modalFilteredData.length / itemsPerPage);

                      // Reset to page 1 if current page exceeds total pages
                      if (modalCurrentPage > totalPages && totalPages > 0) {
                        setModalCurrentPage(1);
                      }

                      const startIndex = isShowAll ? 0 : (modalCurrentPage - 1) * itemsPerPage;
                      const endIndex = isShowAll
                        ? modalFilteredData.length
                        : Math.min(startIndex + itemsPerPage, modalFilteredData.length);
                      const paginatedModalData = modalFilteredData.slice(startIndex, endIndex);

                      if (modalFilteredData.length === 0) {
                        return (
                          <TableRow>
                            <TableCell colSpan={7} align="center">
                              No data available
                            </TableCell>
                          </TableRow>
                        );
                      }

                      return paginatedModalData.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            <Box sx={{ maxHeight: "60px", overflowY: "auto" }}>
                              {row.employees.slice(0, 30).map((emp, i) => (
                                <div key={i}>
                                  {emp.last_name}, {emp.first_name}{" "}
                                  {emp.middle_name && `${emp.middle_name[0]}.`}
                                </div>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            {row.type === "OB"
                              ? row.official_business?.data_from
                              : row.type === "TO"
                              ? row.travel_order?.data_from
                              : row.type === "PS"
                              ? "Pass Slip"
                              : "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            {row.type === "OB"
                              ? row.official_business?.travel_to ?? "N/A"
                              : row.type === "TO"
                              ? row.travel_order?.destination ?? "N/A"
                              : row.type === "PS"
                              ? row.pass_slip?.place_to_visit ?? "N/A"
                              : "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            {new Date(
                              row.type === "OB"
                                ? row.official_business?.date_of_business
                                : row.type === "TO"
                                ? row.travel_order?.date
                                : row.type === "PS"
                                ? row.pass_slip?.created_at
                                : ""
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            {row.type === "OB" && row.official_business
                              ? row.official_business.status === "approved"
                                ? "Approved"
                                : "Pending"
                              : row.type === "TO" && row.travel_order
                              ? row.travel_order.status === "approved"
                                ? "Approved"
                                : "Pending"
                              : row.type === "PS" && row.pass_slip
                              ? row.pass_slip.status === "approved"
                                ? "Approved"
                                : "Pending"
                              : "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              fontSize: { xs: "0.7rem", sm: "0.8rem" },
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            <Box sx={{ maxHeight: "60px", overflowY: "auto" }}>
                              {row.employees?.map((emp, i) => (
                                <div key={i}>{emp.position_name}</div>
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell
                            sx={{
                              border: "1px solid #ccc",
                              textAlign: "center",
                              padding: { xs: "4px", sm: "6px" },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 0.5,
                                alignItems: "center",
                              }}
                            >
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={
                                  isLoading ? (
                                    <CircularProgress
                                      size={16}
                                      color="inherit"
                                    />
                                  ) : (
                                    <FileDownloadOutlined />
                                  )
                                }
                                onClick={() => handleClickOpen(row)}
                                disabled={isLoading}
                                aria-label="Download file"
                                sx={{
                                  fontSize: { xs: "0.7rem", sm: "0.8rem" },
                                  padding: { xs: "4px 8px", sm: "6px 12px" },
                                  minHeight: { xs: "28px", sm: "32px" },
                                  textTransform: "none",
                                }}
                              >
                                {isLoading ? "Generating..." : "Download PDF"}
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ));
                    })()}
                  </TableBody>
                </Table>
              )}
            </TableContainer>

            {/* Pagination controls for modal */}
            {(() => {
              const modalFilteredData = data.filter((row) => {
                const status =
                  row.type === "OB" && row.official_business
                    ? row.official_business.status
                    : row.type === "TO" && row.travel_order
                    ? row.travel_order.status
                    : row.type === "PS" && row.pass_slip
                    ? row.pass_slip.status
                    : undefined;

                if (status !== "approved") return false;

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const rowDate = new Date(
                  row.type === "OB"
                    ? row.official_business?.date_of_business
                    : row.type === "TO"
                    ? row.travel_order?.date
                    : row.type === "PS"
                    ? row.pass_slip?.created_at
                    : null
                );
                rowDate.setHours(0, 0, 0, 0);

                if (rowDate.getTime() >= today.getTime()) return false;

                if (userRole === "admin" || userRole === "evaluator")
                  return true;

                return status === "approved";
              });

              const isShowAll = modalRowsPerPage === "all";
              const itemsPerPage = isShowAll ? modalFilteredData.length : Number(modalRowsPerPage);
              const totalPages = isShowAll ? 1 : Math.ceil(modalFilteredData.length / itemsPerPage);
              const startIndex = isShowAll ? 0 : (modalCurrentPage - 1) * itemsPerPage;
              const endIndex = isShowAll
                ? modalFilteredData.length
                : Math.min(startIndex + itemsPerPage, modalFilteredData.length);
              const startEntry = modalFilteredData.length === 0 ? 0 : startIndex + 1;
              const endEntry = endIndex;

              // Calculate page range to show (max 3 pages)
              let startPage = 1;
              let endPage = Math.min(3, totalPages);

              if (modalCurrentPage > 2 && modalCurrentPage < totalPages - 1) {
                startPage = modalCurrentPage - 1;
                endPage = modalCurrentPage + 1;
              } else if (modalCurrentPage >= totalPages - 1) {
                startPage = Math.max(1, totalPages - 2);
                endPage = totalPages;
              }

              const pageNumbers = [];
              for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
              }

              return (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                    mb: 2,
                    px: 2,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing {startEntry}-{endEntry} of {modalFilteredData.length}
                  </Typography>

                  {!isShowAll && totalPages > 1 && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        onClick={() => setModalCurrentPage(modalCurrentPage - 1)}
                        disabled={modalCurrentPage === 1}
                        size="small"
                      >
                        <ChevronLeftIcon fontSize="small" />
                      </IconButton>

                      {pageNumbers.map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={modalCurrentPage === pageNum ? "contained" : "text"}
                          size="small"
                          onClick={() => setModalCurrentPage(pageNum)}
                          sx={{
                            fontWeight: modalCurrentPage === pageNum ? 600 : 400,
                            backgroundColor:
                              modalCurrentPage === pageNum ? "primary.main" : "transparent",
                            color:
                              modalCurrentPage === pageNum
                                ? "primary.contrastText"
                                : "text.primary",
                            "&:hover": {
                              backgroundColor:
                                modalCurrentPage === pageNum
                                  ? "primary.dark"
                                  : "action.hover",
                            },
                            minWidth: 32,
                            height: 32,
                          }}
                        >
                          {pageNum}
                        </Button>
                      ))}

                      <IconButton
                        onClick={() => setModalCurrentPage(modalCurrentPage + 1)}
                        disabled={modalCurrentPage === totalPages || totalPages === 0}
                        size="small"
                      >
                        <ChevronRightIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              );
            })()}
          </Box>
        </Modal>
      </Box>
      {/* Rows per page selector */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Show:</Typography>
        <select
          value={rowsPerPage}
          onChange={(e) => {
            const newRowsPerPage = e.target.value === "all" ? "all" : Number(e.target.value);
            setRowsPerPage(newRowsPerPage);
            setCurrentPage(1); // Reset to first page when changing rows per page
          }}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value="all">Show All</option>
        </select>
        <Typography variant="body2">entries</Typography>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontSize: "10px",
          overflowY: "hidden",
          overflowX: { xs: "auto", sm: "hidden" }, // Allow horizontal scroll on mobile
          position: "relative",
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "20px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Fetching data, please wait...
          </Box>
        ) : data.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              padding: "20px",
              fontSize: "16px",
              fontWeight: "bold",
              color: "red",
            }}
          >
            No data available
          </Box>
        ) : (
          <Table 
            sx={{ 
              minWidth: { xs: "800px", sm: "650px" }, // Ensure table has minimum width on mobile for scrolling
              borderCollapse: "collapse",
              width: "100%",
            }}
          >
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow 
                selected={false}
                className="table-header-row"
                aria-selected={false}
                sx={{ 
                  "&.Mui-selected": { 
                    backgroundColor: "#f0f0f0 !important",
                    "&:hover": {
                      backgroundColor: "#f0f0f0 !important"
                    }
                  },
                  "&:hover": {
                    backgroundColor: "#f0f0f0 !important"
                  },
                  backgroundColor: "#f0f0f0 !important",
                  userSelect: "none",
                  WebkitUserSelect: "none",
                  MozUserSelect: "none",
                  msUserSelect: "none",
                  "&.Mui-selected, &[aria-selected='true']": {
                    backgroundColor: "#f0f0f0 !important",
                    color: "inherit !important"
                  }
                }}
              >
                {isSelectMode && (
                  <TableCell 
                    padding="checkbox" 
                    data-padding="checkbox"
                    sx={{ 
                      backgroundColor: "#f0f0f0 !important",
                      pointerEvents: "auto !important"
                    }}
                  >
                    <Checkbox
                      indeterminate={selectedRows.size > 0 && selectedRows.size < filteredDataForSelection.length}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  </TableCell>
                )}
                {[
                  "Request Date",
                  "Full Name",
                  "TO/OB",
                  "Place",
                  "Duration",
                  "Position",
                  "Actions",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontWeight: "bold",
                      border: "1px solid #ccc",
                      textAlign: "center",
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(() => {
                const filteredData = filteredDataWithDateRange.filter((row) => {
                  const status =
                    row.type === "OB" && row.official_business
                      ? row.official_business.status
                      : row.type === "TO" && row.travel_order
                      ? row.travel_order.status
                      : row.type === "PS" && row.pass_slip
                      ? row.pass_slip.status
                      : undefined;

                  // Filter for approved status (not declined)
                  if (status !== "approved" && status !== "Approved") return false;

                  // Show all approved data by default (no date filtering)
                  // Date filtering is applied via filteredDataWithDateRange when user selects a date range
                  return (
                    userRole === "admin" ||
                    userRole === "evaluator" ||
                    status === "approved" ||
                    status === "Approved"
                  );
                });

                // Pagination logic
                const isShowAll = rowsPerPage === "all";
                const itemsPerPage = isShowAll ? filteredData.length : Number(rowsPerPage);
                const totalPages = isShowAll ? 1 : Math.ceil(filteredData.length / itemsPerPage);

                const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
                const endIndex = isShowAll
                  ? filteredData.length
                  : Math.min(startIndex + itemsPerPage, filteredData.length);
                const paginatedData = filteredData.slice(startIndex, endIndex);

                // Calculate page range to show (max 3 pages)
                let startPage = 1;
                let endPage = Math.min(3, totalPages);

                if (currentPage > 2 && currentPage < totalPages - 1) {
                  startPage = currentPage - 1;
                  endPage = currentPage + 1;
                } else if (currentPage >= totalPages - 1) {
                  startPage = Math.max(1, totalPages - 2);
                  endPage = totalPages;
                }

                const pageNumbers = [];
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i);
                }

                const startEntry = filteredData.length === 0 ? 0 : startIndex + 1;
                const endEntry = endIndex;

                if (filteredData.length === 0) {
                  return (
                    <TableRow>
                      <TableCell colSpan={isSelectMode ? 8 : 7} align="center">
                        No data available for today.
                      </TableCell>
                    </TableRow>
                  );
                }

                return paginatedData.map((row, index) => {
                  const globalIndex = startIndex + index;
                  
                  return (
                  <TableRow key={index} selected={isSelectMode && isRowSelected(globalIndex)}>
                    {isSelectMode && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isRowSelected(globalIndex)}
                          onChange={() => handleSelectRow(globalIndex)}
                          color="primary"
                        />
                      </TableCell>
                    )}
                    {/* Request Date */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {(() => {
                        const requestDate =
                          row.type === "OB"
                            ? row.official_business?.date
                            : row.type === "TO"
                            ? row.travel_order?.date
                            : row.type === "PS"
                            ? row.pass_slip?.date || row.pass_slip?.created_at
                            : null;
                        
                        if (!requestDate) return "N/A";
                        
                        try {
                          return new Date(requestDate).toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          });
                        } catch (e) {
                          return "N/A";
                        }
                      })()}
                    </TableCell>

                    {/* Full Name */}
                    <TableCell
                      sx={{ 
                        border: "1px solid #ccc", 
                        textAlign: "center",
                        maxWidth: "200px",
                        width: "200px",
                      }}
                    >
                      <Box
                        sx={{ 
                          textAlign: "left",
                        }}
                      >
                        {row.employees && row.employees.length > 0 ? (
                          <>
                            <div>
                              {row.employees[0].last_name}, {row.employees[0].first_name}{" "}
                              {row.employees[0].middle_name && `${row.employees[0].middle_name[0]}.`}
                            </div>
                            {row.employees.length > 1 && (
                              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                                and {row.employees.length - 1} more
                              </div>
                            )}
                          </>
                        ) : "N/A"}
                      </Box>
                    </TableCell>

                    {/* TO/OB/PS */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? row.official_business?.data_from
                        : row.type === "TO"
                        ? row.travel_order?.data_from
                        : row.type === "PS"
                        ? "Pass Slip"
                        : "-"}
                    </TableCell>

                    {/* Place */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? row.official_business?.travel_to ?? "N/A"
                        : row.type === "TO"
                        ? row.travel_order?.destination ?? "N/A"
                        : row.type === "PS"
                        ? row.pass_slip?.place_to_visit ?? "N/A"
                        : "-"}
                    </TableCell>

                    {/* Duration */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {(() => {
                        try {
                          if (row.type === "TO") {
                            const startDate = row.travel_order?.travel_start_date;
                            const endDate = row.travel_order?.travel_end_date;
                            
                            if (!startDate || !endDate) return "N/A";
                            
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
                            
                            const startFormatted = start.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            const endFormatted = end.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            
                            return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                          } else if (row.type === "OB") {
                            // For OB, check if there are start/end dates available
                            const startDate = row.official_business?.itinerary_from;
                            const endDate = row.official_business?.itinerary_to;
                            
                            if (!startDate || !endDate) {
                              // If no itinerary dates, check date_of_business
                              const businessDate = row.official_business?.date_of_business;
                              if (businessDate) {
                                const dateFormatted = new Date(businessDate).toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                return `${dateFormatted} (1 day)`;
                              }
                              return "N/A";
                            }
                            
                            const start = new Date(startDate);
                            const end = new Date(endDate);
                            const diffTime = Math.abs(end - start);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                            
                            const startFormatted = start.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            const endFormatted = end.toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            
                            return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                          } else if (row.type === "PS") {
                            // For Pass Slip, check time_start and time_end or date
                            const startTime = row.pass_slip?.time_start;
                            const endTime = row.pass_slip?.time_end;
                            const date = row.pass_slip?.date;
                            
                            if (startTime && endTime) {
                              const start = new Date(startTime);
                              const end = new Date(endTime);
                              
                              // If same day, calculate hours
                              if (start.toDateString() === end.toDateString()) {
                                const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
                                const dateFormatted = start.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                return `${dateFormatted} (${Math.round(diffHours * 10) / 10} hour${diffHours !== 1 ? "s" : ""})`;
                              } else {
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                                
                                const startFormatted = start.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                const endFormatted = end.toLocaleDateString("en-PH", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                                
                                return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                              }
                            } else if (date) {
                              const dateFormatted = new Date(date).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              return `${dateFormatted} (1 day)`;
                            }
                            
                            return "N/A";
                          }
                          
                          return "N/A";
                        } catch (e) {
                          console.error("Error calculating duration:", e);
                          return "N/A";
                        }
                      })()}
                    </TableCell>

                    {/* Position */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <Box sx={{ maxHeight: "100px", overflowY: "auto" }}>
                        {row.employees?.map((emp, i) => (
                          <div key={i}>{emp.position_name}</div>
                        ))}
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            let selectedId = null;
                            let selectedData = null;

                            if (row.type === "OB") {
                              selectedId = row.official_business?.id;
                              selectedData = {
                                ...row.official_business,
                                employees: row.employees || [],
                              };
                            } else if (row.type === "TO") {
                              selectedId = row.travel_order?.id;
                              selectedData = {
                                ...row.travel_order,
                                employees: row.employees || [],
                              };
                            } else if (row.type === "PS") {
                              selectedId = row.pass_slip?.pass_slip_id;
                              selectedData = {
                                ...row.pass_slip,
                                employees: row.employees || [],
                              };
                            }

                            setSelectedTravelId(selectedId);
                            setSelectedRowType(row.type);
                            setSelectedTravelData(selectedData);
                            setOpenInfo(true);
                          }}
                        >
                          <InfoOutlinedIcon />
                        </IconButton>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={
                            isLoading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : (
                              <FileDownloadOutlined />
                            )
                          }
                          onClick={() => handleClickOpen(row)}
                          disabled={isLoading}
                          aria-label="Download file"
                          sx={{ ml: 0 }}
                        >
                          {isLoading ? "Generating..." : "Download PDF"}
                        </Button>

                        {/* {row.type !== "PS" && (
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<PersonAdd sx={{ fontSize: 16 }} />}
                            sx={{
                              fontSize: { xs: "10px", sm: "12px" },
                              px: { xs: 1.5, sm: 2 },
                              py: 0.8,
                              minHeight: "30px",
                              borderRadius: 1,
                              textTransform: "none",
                              boxShadow: 2,
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                              minWidth: "auto",
                              "&:hover": {
                                backgroundColor: "success.dark",
                                transform: "scale(1.01)",
                              },
                            }}
                            onClick={() => handleAddMore(row)}
                          >
                            Add More
                          </Button>
                        )} */}
                      </Box>
                    </TableCell>
                  </TableRow>
                  );
                });
              })()}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Pagination controls */}
      {(() => {
        const filteredData = filteredDataWithDateRange.filter((row) => {
          const status =
            row.type === "OB" && row.official_business
              ? row.official_business.status
              : row.type === "TO" && row.travel_order
              ? row.travel_order.status
              : row.type === "PS" && row.pass_slip
              ? row.pass_slip.status
              : undefined;

          // Filter for approved status (not declined)
          if (status !== "approved" && status !== "Approved") return false;

          return (
            userRole === "admin" ||
            userRole === "evaluator" ||
            status === "approved" ||
            status === "Approved"
          );
        });

        const isShowAll = rowsPerPage === "all";
        const itemsPerPage = isShowAll ? filteredData.length : Number(rowsPerPage);
        const totalPages = isShowAll ? 1 : Math.ceil(filteredData.length / itemsPerPage);
        const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
        const endIndex = isShowAll
          ? filteredData.length
          : Math.min(startIndex + itemsPerPage, filteredData.length);
        const startEntry = filteredData.length === 0 ? 0 : startIndex + 1;
        const endEntry = endIndex;

        // Calculate page range to show (max 3 pages)
        let startPage = 1;
        let endPage = Math.min(3, totalPages);

        if (currentPage > 2 && currentPage < totalPages - 1) {
          startPage = currentPage - 1;
          endPage = currentPage + 1;
        } else if (currentPage >= totalPages - 1) {
          startPage = Math.max(1, totalPages - 2);
          endPage = totalPages;
        }

        const pageNumbers = [];
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 2,
              mb: 2,
              px: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {startEntry}-{endEntry} of {filteredData.length}
            </Typography>

            {!isShowAll && totalPages > 1 && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  size="small"
                >
                  <ChevronLeftIcon fontSize="small" />
                </IconButton>

                {pageNumbers.map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "contained" : "text"}
                    size="small"
                    onClick={() => setCurrentPage(pageNum)}
                    sx={{
                      fontWeight: currentPage === pageNum ? 600 : 400,
                      backgroundColor:
                        currentPage === pageNum ? "primary.main" : "transparent",
                      color:
                        currentPage === pageNum
                          ? "primary.contrastText"
                          : "text.primary",
                      "&:hover": {
                        backgroundColor:
                          currentPage === pageNum
                            ? "primary.dark"
                            : "action.hover",
                      },
                      minWidth: 32,
                      height: 32,
                    }}
                  >
                    {pageNum}
                  </Button>
                ))}

                <IconButton
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages || totalPages === 0}
                  size="small"
                >
                  <ChevronRightIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        );
      })()}

      {/* Info Modal Dialog */}
      <Dialog
        open={openInfo && !!selectedTravelData}
        onClose={() => setOpenInfo(false)}
        maxWidth="sm"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            padding: "16px 24px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Request Details</span>
          <IconButton
            onClick={() => setOpenInfo(false)}
            sx={{ color: "text.secondary" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ padding: "24px" }}>
          {selectedTravelData ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: "16px 8px",
                alignItems: "center",
              }}
            >
              {selectedRowType === "TO" && (
                <>
                  <DetailLabel>ID</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.id}
                  </DetailValue>

                  <DetailLabel>Request</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.re}
                  </DetailValue>

                  <DetailLabel>Date</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.date
                      ? new Date(
                          selectedTravelData.date
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Destination</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.destination}
                  </DetailValue>

                  <DetailLabel>Travel From</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.travel_from
                      ? new Date(
                          selectedTravelData.travel_from
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Travel To</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.travel_to
                      ? new Date(
                          selectedTravelData.travel_to
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Purpose</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.purpose}
                  </DetailValue>

                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusChip
                      status={selectedTravelData.status}
                    />
                  </DetailValue>

                  <DetailLabel>Remarks</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.remarks || "None"}
                  </DetailValue>

                  {selectedTravelData.employees?.length >
                    0 && (
                      <>
                        <DetailLabel
                          sx={{ alignSelf: "start", pt: 1 }}
                        >
                          Employees
                        </DetailLabel>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedTravelData.employees.map(
                            (emp, idx) => (
                              <EmployeeBadge
                                key={idx}
                                name={`${emp.first_name} ${emp.last_name}`}
                                position={emp.position_name}
                              />
                            )
                          )}
                        </Box>
                      </>
                    )}
                </>
              )}

              {selectedRowType === "OB" && (
                <>
                  <DetailLabel>ID</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.id}
                  </DetailValue>

                  <DetailLabel>Date</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.date_of_business
                      ? new Date(
                          selectedTravelData.date_of_business
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Purpose</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.purpose}
                  </DetailValue>

                  <DetailLabel>Itinerary From</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.itinerary_from
                      ? new Date(
                          selectedTravelData.itinerary_from
                        ).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Destination</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.travel_to || "N/A"}
                  </DetailValue>

                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusChip
                      status={selectedTravelData.status}
                    />
                  </DetailValue>

                  <DetailLabel>Remarks</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.remarks || "None"}
                  </DetailValue>

                  {selectedTravelData.employees?.length >
                    0 && (
                      <>
                        <DetailLabel
                          sx={{ alignSelf: "start", pt: 1 }}
                        >
                          Employees
                        </DetailLabel>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedTravelData.employees.map(
                            (emp, idx) => (
                              <EmployeeBadge
                                key={idx}
                                name={`${emp.first_name} ${emp.last_name}`}
                                position={emp.position_name}
                              />
                            )
                          )}
                        </Box>
                      </>
                    )}
                </>
              )}

              {selectedRowType === "PS" && (
                <>
                  <DetailLabel>ID</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.pass_slip_id}
                  </DetailValue>

                  <DetailLabel>Reason</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.reason}
                  </DetailValue>

                  <DetailLabel>Date</DetailLabel>
                  <DetailValue>
                    {new Date(
                      selectedTravelData.created_at
                    ).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </DetailValue>

                  <DetailLabel>Place to Visit</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.place_to_visit || "N/A"}
                  </DetailValue>

                  <DetailLabel>Time Start</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.time_start
                      ? new Date(
                          selectedTravelData.time_start
                        ).toLocaleTimeString("en-PH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Time End</DetailLabel>
                  <DetailValue>
                    {selectedTravelData.time_end
                      ? new Date(
                          selectedTravelData.time_end
                        ).toLocaleTimeString("en-PH", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </DetailValue>

                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <StatusChip
                      status={selectedTravelData.status}
                    />
                  </DetailValue>

                  {selectedTravelData.employees?.length >
                    0 && (
                      <>
                        <DetailLabel
                          sx={{ alignSelf: "start", pt: 1 }}
                        >
                          Employees
                        </DetailLabel>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {selectedTravelData.employees.map(
                            (emp, idx) => (
                              <EmployeeBadge
                                key={idx}
                                name={`${emp.first_name} ${emp.last_name}`}
                                position={emp.position_name}
                              />
                            )
                          )}
                        </Box>
                      </>
                    )}
                </>
              )}
            </Box>
          ) : (
            <Typography>No data available</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px" }}>
          <Button
            variant="contained"
            onClick={() => setOpenInfo(false)}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              padding: "8px 16px",
              fontWeight: 500,
              boxShadow: "none",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Move dialog outside the table body so it's always available */}
      {selectedRow && (
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                  sx={{
                    "& .MuiDialog-paper": {
                      width: "95vw",
                      maxWidth: {
                        xs: "95vw",
                        sm: "80vw",
                        md: "70vw",
                        lg: "60vw",
                      },
                      maxHeight: "90vh",
                    },
                  }}
                >
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: 8,
                      top: 8,
                      color: (theme) => theme.palette.grey[500],
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  <DialogContent
                    dividers
                    sx={{
                      maxHeight: "85vh",
                      overflowY: "auto",
                      p: { xs: 2, sm: 3 },
                    }}
                  >
                    {selectedRow?.type === "PS" ? (
                      <GeneratePassSlipPDF
                        data={selectedRow}
                        onClose={handleClose}
                      />
                    ) : selectedRow?.travel_order ? (
                      <TOSIGN
                        data={selectedRow}
                        Headposition={Headposition} // ✅ forward this prop
                        signatureUrl={signatureUrl} // ✅ forward this prop
                        onClose={handleClose}
                      />
                    ) : selectedRow?.official_business ? (
                      <OBESIGN data={selectedRow} onClose={handleClose} />
                    ) : null}
                  </DialogContent>
                </BootstrapDialog>
              )}
    </Container>
  );
}

export function ApprovingDeclined({
  data,
  isLoading,
  userRole,
  Headposition,
  signatureUrl,
}) {
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedTravelData, setSelectedTravelData] = useState(null);
  const [selectedRowType, setSelectedRowType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [typeFilterAnchor, setTypeFilterAnchor] = useState(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All"); // All, TO, OB, PS

  const DetailLabel = ({ children, ...props }) => (
    <Typography variant="body2" color="text.secondary" fontWeight={500} {...props}>
      {children}
    </Typography>
  );

  const DetailValue = ({ children }) => (
    <Typography variant="body1" component="div" fontWeight={400}>
      {children}
    </Typography>
  );

  const StatusChip = ({ status }) => (
    <Chip
      label={status}
      size="small"
      sx={{
        fontWeight: 500,
        backgroundColor: status === "declined" || status === "Declined" ? "#ffecec" : "#fff8e6",
        color: status === "declined" || status === "Declined" ? "#d32f2f" : "#ff9800",
      }}
    />
  );

  const EmployeeBadge = ({ name, position }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, padding: "6px 8px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
      <Typography variant="body2" fontWeight={500}>{name}</Typography>
      {position && (
        <>
          <Typography variant="body2" color="text.secondary">•</Typography>
          <Typography variant="body2" color="text.secondary">{position}</Typography>
        </>
      )}
    </Box>
  );

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Type filter
      if (selectedTypeFilter !== "All" && row.type !== selectedTypeFilter) {
        return false;
      }

      const status =
        row.type === "OB" && row.official_business
          ? row.official_business.status
          : row.type === "TO" && row.travel_order
          ? row.travel_order.status
          : row.type === "PS" && row.pass_slip
          ? row.pass_slip.status
          : undefined;
      return status === "declined";
    });
  }, [data, selectedTypeFilter]);

  const isShowAll = rowsPerPage === "all";
  const itemsPerPage = isShowAll ? filteredData.length : Number(rowsPerPage);
  const totalPages = isShowAll ? 1 : Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isShowAll ? filteredData.length : Math.min(startIndex + itemsPerPage, filteredData.length);
  const paginatedData = filteredData.slice(startIndex, endIndex);
  const startEntry = filteredData.length === 0 ? 0 : startIndex + 1;
  const endEntry = endIndex;

  return (
    <Container sx={{ overflowY: "hidden", overflowX: { xs: "auto", sm: "hidden" } }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mb: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          endIcon={<ArrowDropDown />}
          onClick={(e) => setTypeFilterAnchor(e.currentTarget)}
        >
          Filter: {selectedTypeFilter}
        </Button>
        <Menu
          anchorEl={typeFilterAnchor}
          open={Boolean(typeFilterAnchor)}
          onClose={() => setTypeFilterAnchor(null)}
        >
          <MenuItem onClick={() => { setSelectedTypeFilter("All"); setTypeFilterAnchor(null); }}>
            All
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("TO"); setTypeFilterAnchor(null); }}>
            Travel Orders
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("OB"); setTypeFilterAnchor(null); }}>
            Official Business
          </MenuItem>
          <MenuItem onClick={() => { setSelectedTypeFilter("PS"); setTypeFilterAnchor(null); }}>
            Pass Slips
          </MenuItem>
        </Menu>
      </Box>
      <TableContainer component={Paper} sx={{ border: "1px solid #ccc", borderRadius: "8px", overflowY: "hidden", overflowX: { xs: "auto", sm: "hidden" } }}>
        {isLoading ? (
          <Box sx={{ textAlign: "center", padding: "20px" }}>Loading...</Box>
        ) : filteredData.length === 0 ? (
          <Box sx={{ textAlign: "center", padding: "20px" }}>No declined requests</Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                {["Request Date", "Full Name", "TO/OB", "Place", "Duration", "Position", "Remarks", "Actions"].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: "bold", border: "1px solid #ccc", textAlign: "center" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    {(() => {
                      const requestDate = row.type === "OB" ? row.official_business?.date : row.type === "TO" ? row.travel_order?.date : row.type === "PS" ? row.pass_slip?.date || row.pass_slip?.created_at : null;
                      if (!requestDate) return "N/A";
                      try {
                        return new Date(requestDate).toLocaleDateString("en-PH", { year: "numeric", month: "short", day: "numeric" });
                      } catch (e) {
                        return "N/A";
                      }
                    })()}
                  </TableCell>
                  <TableCell sx={{ 
                    border: "1px solid #ccc", 
                    textAlign: "center",
                    maxWidth: "200px",
                    width: "200px",
                  }}>
                    <Box
                      sx={{
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="body2">
                        {row.employees && row.employees.length > 0 ? (
                          <>
                            <div>
                              {row.employees[0].last_name}, {row.employees[0].first_name}{" "}
                              {row.employees[0].middle_name && `${row.employees[0].middle_name[0]}.`}
                            </div>
                            {row.employees.length > 1 && (
                              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                                and {row.employees.length - 1} more
                              </div>
                            )}
                          </>
                        ) : "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    {row.type === "OB" ? row.official_business?.data_from : row.type === "TO" ? row.travel_order?.data_from : row.type === "PS" ? "Pass Slip" : "-"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    {row.type === "OB" ? row.official_business?.travel_to ?? "N/A" : row.type === "TO" ? row.travel_order?.destination ?? "N/A" : row.type === "PS" ? row.pass_slip?.place_to_visit ?? "N/A" : "-"}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    {(() => {
                      try {
                        if (row.type === "TO") {
                          const startDate = row.travel_order?.travel_start_date;
                          const endDate = row.travel_order?.travel_end_date;
                          if (!startDate || !endDate) return "N/A";
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          const diffTime = Math.abs(end - start);
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
                          
                          const startFormatted = start.toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          const endFormatted = end.toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          
                          return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                        } else if (row.type === "OB") {
                          const startDate = row.official_business?.itinerary_from;
                          const endDate = row.official_business?.itinerary_to;
                          if (!startDate || !endDate) {
                            const businessDate = row.official_business?.date_of_business;
                            if (businessDate) {
                              const dateFormatted = new Date(businessDate).toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              return `${dateFormatted} (1 day)`;
                            }
                            return "N/A";
                          }
                          const start = new Date(startDate);
                          const end = new Date(endDate);
                          const diffTime = Math.abs(end - start);
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                          
                          const startFormatted = start.toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          const endFormatted = end.toLocaleDateString("en-PH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          });
                          
                          return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                        } else if (row.type === "PS") {
                          const startTime = row.pass_slip?.time_start;
                          const endTime = row.pass_slip?.time_end;
                          const date = row.pass_slip?.date;
                          
                          if (startTime && endTime) {
                            const start = new Date(startTime);
                            const end = new Date(endTime);
                            if (start.toDateString() === end.toDateString()) {
                              const diffHours = Math.abs(end - start) / (1000 * 60 * 60);
                              const dateFormatted = start.toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              return `${dateFormatted} (${Math.round(diffHours * 10) / 10} hour${diffHours !== 1 ? "s" : ""})`;
                            } else {
                              const diffTime = Math.abs(end - start);
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                              
                              const startFormatted = start.toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              const endFormatted = end.toLocaleDateString("en-PH", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              });
                              
                              return `${startFormatted} - ${endFormatted} (${diffDays} day${diffDays !== 1 ? "s" : ""})`;
                            }
                          } else if (date) {
                            const dateFormatted = new Date(date).toLocaleDateString("en-PH", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            });
                            return `${dateFormatted} (1 day)`;
                          }
                          return "N/A";
                        }
                        return "N/A";
                      } catch (e) {
                        console.error("Error calculating duration:", e);
                        return "N/A";
                      }
                    })()}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    <Box sx={{ maxHeight: "60px", overflowY: "auto" }}>
                      {row.employees?.map((emp, i) => (
                        <div key={i}>{emp.position_name}</div>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center", maxWidth: "300px" }}>
                    <Box sx={{ maxHeight: "100px", overflowY: "auto", padding: "4px" }}>
                      <Typography variant="body2" color="text.secondary">
                        {(() => {
                          const remarks = 
                            row.type === "OB" 
                              ? row.official_business?.remarks
                              : row.type === "TO" 
                              ? row.travel_order?.remarks
                              : row.type === "PS"
                              ? row.pass_slip?.remarks
                              : null;
                          return remarks || "No remarks provided";
                        })()}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc", textAlign: "center" }}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        let selectedData = null;
                        if (row.type === "OB") {
                          selectedData = { ...row.official_business, employees: row.employees || [] };
                        } else if (row.type === "TO") {
                          selectedData = { ...row.travel_order, employees: row.employees || [] };
                        } else if (row.type === "PS") {
                          selectedData = { ...row.pass_slip, employees: row.employees || [] };
                        }
                        setSelectedRowType(row.type);
                        setSelectedTravelData(selectedData);
                        setOpenInfo(true);
                      }}
                    >
                      <InfoOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {filteredData.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Show:</Typography>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                const newRowsPerPage = e.target.value === "all" ? "all" : Number(e.target.value);
                setRowsPerPage(newRowsPerPage);
                setCurrentPage(1);
              }}
              style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value="all">All</option>
            </select>
            <Typography variant="body2">entries</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Showing {startEntry}-{endEntry} of {filteredData.length}
          </Typography>
          {!isShowAll && totalPages > 1 && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <IconButton onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                <ChevronLeftIcon />
              </IconButton>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const page = currentPage <= 2 ? i + 1 : currentPage >= totalPages - 1 ? totalPages - 2 + i : currentPage - 1 + i;
                if (page > totalPages) return null;
                return (
                  <Button key={page} variant={currentPage === page ? "contained" : "outlined"} onClick={() => setCurrentPage(page)} sx={{ minWidth: "32px", padding: "4px 8px" }}>
                    {page}
                  </Button>
                );
              })}
              <IconButton onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                <ChevronRightIcon />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {openInfo && selectedTravelData && (
        <Dialog open={openInfo} onClose={() => setOpenInfo(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Request Details
            <IconButton onClick={() => setOpenInfo(false)}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              {selectedRowType === "TO" && selectedTravelData && (
                <>
                  <Box><DetailLabel>Status:</DetailLabel><StatusChip status={selectedTravelData.status || "N/A"} /></Box>
                  <Box><DetailLabel>Destination:</DetailLabel><DetailValue>{selectedTravelData.destination || "N/A"}</DetailValue></Box>
                  <Box><DetailLabel>Travel Start:</DetailLabel><DetailValue>{selectedTravelData.travel_start_date ? new Date(selectedTravelData.travel_start_date).toLocaleDateString() : "N/A"}</DetailValue></Box>
                  <Box><DetailLabel>Travel End:</DetailLabel><DetailValue>{selectedTravelData.travel_end_date ? new Date(selectedTravelData.travel_end_date).toLocaleDateString() : "N/A"}</DetailValue></Box>
                  {selectedTravelData.remarks && <Box><DetailLabel>Remarks:</DetailLabel><DetailValue>{selectedTravelData.remarks}</DetailValue></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <DetailLabel>Employees:</DetailLabel>
                      {selectedTravelData.employees.map((emp, i) => (
                        <EmployeeBadge key={i} name={`${emp.last_name}, ${emp.first_name}`} position={emp.position_name} />
                      ))}
                    </Box>
                  )}
                </>
              )}
              {selectedRowType === "OB" && selectedTravelData && (
                <>
                  <Box><DetailLabel>Status:</DetailLabel><StatusChip status={selectedTravelData.status || "N/A"} /></Box>
                  <Box><DetailLabel>Travel To:</DetailLabel><DetailValue>{selectedTravelData.travel_to || "N/A"}</DetailValue></Box>
                  <Box><DetailLabel>Date of Business:</DetailLabel><DetailValue>{selectedTravelData.date_of_business ? new Date(selectedTravelData.date_of_business).toLocaleDateString() : "N/A"}</DetailValue></Box>
                  {selectedTravelData.remarks && <Box><DetailLabel>Remarks:</DetailLabel><DetailValue>{selectedTravelData.remarks}</DetailValue></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <DetailLabel>Employees:</DetailLabel>
                      {selectedTravelData.employees.map((emp, i) => (
                        <EmployeeBadge key={i} name={`${emp.last_name}, ${emp.first_name}`} position={emp.position_name} />
                      ))}
                    </Box>
                  )}
                </>
              )}
              {selectedRowType === "PS" && selectedTravelData && (
                <>
                  <Box><DetailLabel>Status:</DetailLabel><StatusChip status={selectedTravelData.status || "N/A"} /></Box>
                  <Box><DetailLabel>Place to Visit:</DetailLabel><DetailValue>{selectedTravelData.place_to_visit || "N/A"}</DetailValue></Box>
                  <Box><DetailLabel>Time Start:</DetailLabel><DetailValue>{selectedTravelData.time_start ? new Date(selectedTravelData.time_start).toLocaleString() : "N/A"}</DetailValue></Box>
                  <Box><DetailLabel>Time End:</DetailLabel><DetailValue>{selectedTravelData.time_end ? new Date(selectedTravelData.time_end).toLocaleString() : "N/A"}</DetailValue></Box>
                  {selectedTravelData.remarks && <Box><DetailLabel>Remarks:</DetailLabel><DetailValue>{selectedTravelData.remarks}</DetailValue></Box>}
                  {selectedTravelData.employees && selectedTravelData.employees.length > 0 && (
                    <Box>
                      <DetailLabel>Employees:</DetailLabel>
                      {selectedTravelData.employees.map((emp, i) => (
                        <EmployeeBadge key={i} name={`${emp.last_name}, ${emp.first_name}`} position={emp.position_name} />
                      ))}
                    </Box>
                  )}
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Container>
  );
}

//02/17/25 | Function Approving Reports--to call into the Tabs in the Approving Home
dayjs.extend(isBetweenPlugin);
const currentYear = dayjs();
export function ApprovingReports({ data, userRole }) {
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: dayjs().add(6, "day"),
  });

  // Fixed: Use consistent variable names and proper default values
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Changed to number instead of string

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Weekly");
  const [startOpen, setStartOpen] = React.useState(false);
  const [endOpen, setEndOpen] = React.useState(false);

  const reportRef = useRef(null);

  const handleClick = (event, period) => {
    setAnchorEl(event.currentTarget);
    setSelectedFilter(period);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Filtering function
  const getFilteredReports = () => {
    return data.filter((row) => {
      if (!row || !row.type) return false;

      const status =
        row.type === "OB" && row.official_business
          ? row.official_business.status
          : row.type === "TO" && row.travel_order
          ? row.travel_order.status
          : row.type === "PS" && row.pass_slip
          ? row.pass_slip.status
          : undefined;

      if (status !== "approved" && status !== "declined") return false;

      const dateStr =
        row.type === "OB"
          ? row.official_business?.date_of_business
          : row.type === "TO"
          ? row.travel_order?.date
          : row.type === "PS"
          ? row.pass_slip?.time_start || row.pass_slip?.date
          : null;

      if (!dateStr) return false;

      const reportDate = dayjs(dateStr);
      if (!reportDate.isValid()) return false;

      if (!selectedFilter && !selectedRange.start && !selectedRange.end) {
        return true;
      }

      if (selectedFilter && selectedRange.start && selectedRange.end) {
        return reportDate.isBetween(
          selectedRange.start.startOf("day"),
          selectedRange.end.endOf("day"),
          null,
          "[]"
        );
      }

      return true;
    });
  };

  const filteredReports = getFilteredReports();
  const totalReports = filteredReports.length;

  // Fixed: Proper pagination logic
  const isShowAll = rowsPerPage === "all";
  const itemsPerPage = isShowAll ? totalReports : Number(rowsPerPage);
  const totalPages = isShowAll ? 1 : Math.ceil(totalReports / itemsPerPage);

  // Reset to page 1 if current page exceeds total pages
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const startIndex = isShowAll ? 0 : (currentPage - 1) * itemsPerPage;
  const endIndex = isShowAll
    ? totalReports
    : Math.min(startIndex + itemsPerPage, totalReports);
  const paginatedReports = filteredReports.slice(startIndex, endIndex);

  // Calculate page range to show (max 3 pages)
  let startPage = 1;
  let endPage = Math.min(3, totalPages);

  if (currentPage > 2 && currentPage < totalPages - 1) {
    startPage = currentPage - 1;
    endPage = currentPage + 1;
  } else if (currentPage >= totalPages - 1) {
    startPage = Math.max(1, totalPages - 2);
    endPage = totalPages;
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Fixed: Proper entry calculation
  const startEntry = totalReports === 0 ? 0 : startIndex + 1;
  const endEntry = endIndex;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  // Fixed: Proper rows per page change handler
  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = event.target.value;
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleDownloadPDF = () => {
    try {
      // Use jsPDF constructor (note the destructured import)
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      // Header: DOLE Logo & Text
      try {
        pdf.addImage("/logo-dole.png", "PNG", pageWidth / 2 - 10, 10, 20, 20);
      } catch (error) {
        console.warn("Could not load logo image:", error);
      }

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.text("Republic of the Philippines", pageWidth / 2, 35, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("DEPARTMENT OF LABOR AND EMPLOYMENT", pageWidth / 2, 42, {
        align: "center",
      });
      pdf.text("Regional Office No. X", pageWidth / 2, 47, { align: "center" });
      pdf.text("NORTHERN MINDANAO", pageWidth / 2, 52, { align: "center" });

      // Report Title
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("APPROVED TRAVEL ORDER", 15, 70);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("March 2024", 255, 70);

      const input = reportRef.current;
      if (!input) {
        console.error("Report reference not found");
        return;
      }

      const table = input.querySelector("table");

      if (table) {
        const headers = [];
        const rows = [];

        // Extract headers
        table.querySelectorAll("thead tr th").forEach((th) => {
          headers.push(th.innerText.trim());
        });

        // Extract rows
        table.querySelectorAll("tbody tr").forEach((tr) => {
          const rowData = [];
          tr.querySelectorAll("td").forEach((td) => {
            rowData.push(td.innerText.trim());
          });
          rows.push(rowData);
        });

        // Use autoTable function directly (for jspdf-autotable 5.x)
        autoTable(pdf, {
          head: [headers],
          body: rows,
          startY: 80,
          theme: "grid",
          styles: {
            fontSize: 10,
            cellPadding: 3,
            overflow: "linebreak",
            halign: "left",
          },
          headStyles: {
            fillColor: [21, 84, 210],
            textColor: 255,
            fontStyle: "bold",
          },
          columnStyles: {
            // Adjust column widths if needed
            0: { cellWidth: 30 },
            1: { cellWidth: 40 },
            2: { cellWidth: 50 },
          },
        });

        // // Add signatory below the table
        // const finalY = pdf.lastAutoTable.finalY + 20;
        // pdf.setFont("helvetica", "bold");
        // pdf.text("EMMANUEL G. TOLEDO", 220, finalY);
        // pdf.setFont("helvetica", "normal");
        // pdf.text("Chief LEO", 230, finalY + 5);
      } else {
        console.error("Table not found in report reference");
      }

      pdf.save("Approving_Reports.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      console.error("Error details:", error.stack);
    }
  };

  const handleClickdate = (event, period) => {
    setAnchorEl(event.currentTarget);
    setSelectedFilter(period);

    const today = dayjs();
    let newStart, newEnd;

    switch (period) {
      case "Weekly":
        newStart = today.startOf("week");
        newEnd = today.endOf("week");
        break;
      case "Monthly":
        newStart = today.startOf("month");
        newEnd = today.endOf("month");
        break;
      case "Yearly":
        newStart = today.startOf("year");
        newEnd = today.endOf("year");
        break;
      case "Quarterly":
        const quarter = Math.floor(today.month() / 3);
        newStart = dayjs(new Date(today.year(), quarter * 3, 1));
        newEnd = newStart.add(2, "month").endOf("month");
        break;
      default:
        newStart = today;
        newEnd = today;
    }

    setSelectedRange({ start: newStart, end: newEnd });
  };

  return (
    <Container
      fixed
      sx={{
        fontSize: "10px",
        overflowY: "hidden",
        overflowX: { xs: "auto", sm: "hidden" },
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          position: "relative",
          gap: 1,
          mb: 2,
        }}
      >
        {["Weekly", "Monthly", "Yearly", "Quarterly"].map((period) => (
          <Button
            key={period}
            variant="contained"
            sx={{
              minWidth: "auto",
              fontSize: { xs: "10px", sm: "14px" },
              px: { xs: 1, sm: 2 },
            }}
            endIcon={<ArrowDropDown />}
            onClick={(event) => handleClickdate(event, period)}
          >
            {period}
          </Button>
        ))}

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          PaperProps={{ sx: { maxWidth: "95vw", p: { xs: 1, sm: 2 } } }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {selectedFilter === "Weekly" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 2 },
                  p: 2,
                }}
              >
                <DatePicker
                  label="Start of Weeks"
                  value={selectedRange?.start || null}
                  onChange={(newValue) => {
                    if (newValue) {
                      const newEnd = newValue.add(6, "day");
                      setSelectedRange({ start: newValue, end: newEnd });
                    } else {
                      setSelectedRange({ start: null, end: null });
                    }
                  }}
                  sx={{ width: "100%" }}
                />

                <DatePicker
                  label="End of Week"
                  value={selectedRange?.end || null}
                  disabled
                  sx={{ width: "100%" }}
                />
              </Box>
            )}

            {selectedFilter === "Monthly" && (
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <DateCalendar
                  views={["month", "year"]}
                  openTo="month"
                  onChange={(newMonth) => {
                    if (newMonth) {
                      const start = newMonth.startOf("month");
                      const end = newMonth.endOf("month");
                      setSelectedRange({ start, end });
                    }
                  }}
                />
              </Box>
            )}

            {selectedFilter === "Yearly" && (
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <DateCalendar
                  views={["year"]}
                  openTo="year"
                  onChange={(newYear) => {
                    if (newYear) {
                      const start = newYear.startOf("year");
                      const end = newYear.endOf("year");
                      setSelectedRange({ start, end });
                    }
                  }}
                />
              </Box>
            )}

            {selectedFilter === "Quarterly" && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 1, sm: 2 },
                  p: 2,
                }}
              >
                <DatePicker
                  label="Quarter Start"
                  views={["month", "year"]}
                  value={selectedRange?.start || null}
                  onChange={(startMonth) => {
                    if (startMonth) {
                      const endMonth = startMonth
                        .add(2, "month")
                        .endOf("month");
                      setSelectedRange({
                        start: startMonth.startOf("month"),
                        end: endMonth,
                      });
                    }
                  }}
                  open={startOpen}
                  onOpen={() => setStartOpen(true)}
                  onClose={() => setStartOpen(false)}
                  slotProps={{
                    textField: {
                      onClick: () => setStartOpen(true),
                    },
                  }}
                  sx={{ width: "100%" }}
                />

                <DatePicker
                  label="Quarter End"
                  views={["month", "year"]}
                  value={selectedRange?.end || null}
                  disabled
                  open={endOpen}
                  onOpen={() => setEndOpen(true)}
                  onClose={() => setEndOpen(false)}
                  slotProps={{
                    textField: {
                      onClick: () => setEndOpen(true),
                    },
                  }}
                  sx={{ width: "100%" }}
                />
              </Box>
            )}
          </LocalizationProvider>
        </Popover>

        <Button
          variant="contained"
          color="primary"
          startIcon={<FileDownloadOutlined />}
          sx={{
            ml: "auto",
            fontSize: { xs: "8px", sm: "14px" },
            px: { xs: 1, sm: 2 },
          }}
          onClick={handleDownloadPDF}
        >
          Download
        </Button>
      </Box>

      {/* Fixed: Better styled rows per page selector */}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body2">Show:</Typography>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value="all">Show All</option>
        </select>
        <Typography variant="body2">entries</Typography>
      </Box>

      <TableContainer
        component={Paper}
        ref={reportRef}
        sx={{ 
          border: "1px solid #ccc", 
          borderRadius: "8px", 
          p: 2,
          overflowY: "hidden",
          overflowX: { xs: "auto", sm: "hidden" },
          WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
          "&::-webkit-scrollbar": {
            height: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: "4px",
            "&:hover": {
              backgroundColor: "#555",
            },
          },
        }}
      >
        <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              {[
                "Full Name",
                "TO/OB",
                "Place",
                "Date",
                "Status",
                "Position",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: "bold",
                    border: "1px solid #ccc",
                    textAlign: "center",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              paginatedReports.map((row, index) => {
                const status =
                  row.type === "OB" && row.official_business
                    ? row.official_business.status
                    : row.type === "TO" && row.travel_order
                    ? row.travel_order.status
                    : row.type === "PS" && row.pass_slip
                    ? row.pass_slip.status
                    : "N/A";

                const dateValue =
                  row.type === "OB"
                    ? row.official_business?.date_of_business
                    : row.type === "TO"
                    ? row.travel_order?.date
                    : row.type === "PS"
                    ? row.pass_slip?.time_start || row.pass_slip?.date
                    : null;

                return (
                  <TableRow key={row.id || index}>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <Box>
                        {row.employees && row.employees.length > 0 ? (
                          <>
                            <div>
                              {row.employees[0].last_name}, {row.employees[0].first_name}{" "}
                              {row.employees[0].middle_name && `${row.employees[0].middle_name[0]}.`}
                            </div>
                            {row.employees.length > 1 && (
                              <div style={{ color: "#666", fontSize: "0.875rem" }}>
                                and {row.employees.length - 1} more
                              </div>
                            )}
                          </>
                        ) : "N/A"}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? "Official Business"
                        : row.type === "TO"
                        ? "Travel Order"
                        : row.type === "PS"
                        ? "Pass Slip"
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {row.type === "OB"
                        ? row.official_business?.travel_to || "N/A"
                        : row.type === "TO"
                        ? row.travel_order?.destination || "N/A"
                        : row.type === "PS"
                        ? row.pass_slip?.place_to_visit || "N/A"
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {dateValue
                        ? dayjs(dateValue).format("MM/DD/YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      {status !== "N/A"
                        ? status.charAt(0).toUpperCase() + status.slice(1)
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #ccc", textAlign: "center" }}
                    >
                      <Box sx={{ maxHeight: "100px", overflowY: "auto" }}>
                        {row.employees?.map((emp, i) => (
                          <div key={i}>{emp.position_name}</div>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
            px: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {startEntry}-{endEntry} of {totalReports}
          </Typography>

          {/* Fixed: Only show manual pagination when not showing all and has multiple pages */}
          {!isShowAll && totalPages > 1 && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                onClick={() => handlePageChange(null, currentPage - 1)}
                disabled={currentPage === 1}
                size="small"
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>

              {pageNumbers.map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "contained" : "text"}
                  size="small"
                  onClick={() => handlePageChange(null, pageNum)}
                  sx={{
                    fontWeight: currentPage === pageNum ? 600 : 400,
                    backgroundColor:
                      currentPage === pageNum ? "primary.main" : "transparent",
                    color:
                      currentPage === pageNum
                        ? "primary.contrastText"
                        : "text.primary",
                    "&:hover": {
                      backgroundColor:
                        currentPage === pageNum
                          ? "primary.dark"
                          : "action.hover",
                    },
                    minWidth: 32,
                    height: 32,
                  }}
                >
                  {pageNum}
                </Button>
              ))}

              <IconButton
                onClick={() => handlePageChange(null, currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                size="small"
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </TableContainer>
    </Container>
  );
}
export function Logs({ userRole, historyLogs = [], loading, data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState("10"); // keep as string for dropdown compatibility

  const logsToDisplay = data ?? historyLogs;
  const totalPages = Math.ceil(logsToDisplay.length / rowsPerPage);

  // Paginated slice of logs
  const paginatedLogs = logsToDisplay.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate the range of page buttons to display (max 3)
  let startPage = Math.max(0, page - 1);
  let endPage = Math.min(totalPages - 1, startPage + 2);

  if (endPage - startPage < 2) {
    startPage = Math.max(0, endPage - 2);
  }

  // Page change handler
  const handleChangePage = (event, newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  // Rows per page change handler
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading history logs...</Typography>
      </Box>
    );
  }
  const formatAction = (action) => {
    if (!action) return "N/A";

    const createEmployeeMatch = action.match(/^Create Employee: (.+)$/);
    if (createEmployeeMatch) {
      return `Create Employee: <strong>${createEmployeeMatch[1]}</strong>`;
    }

    const addedPositionMatch = action.match(/^Added Position: (.+)$/);
    if (addedPositionMatch) {
      return `Added Position: <strong>${addedPositionMatch[1]}</strong>`;
    }

    const updatedPositionMatch = action.match(/^Updated Position: (.+)$/);
    if (updatedPositionMatch) {
      return `Updated Position: <strong>${updatedPositionMatch[1]}</strong>`;
    }

    const approvedTOIdMatch = action.match(
      /^Approved the Travel Order ID: (\d+)$/
    );
    if (approvedTOIdMatch) {
      return `Approved the Travel Order ID: <strong>${approvedTOIdMatch[1]}</strong>`;
    }

    const declinedTOIdMatch = action.match(
      /^Declined the Travel Order ID: (\d+)$/
    );
    if (declinedTOIdMatch) {
      return `Declined the Travel Order ID: <strong>${declinedTOIdMatch[1]}</strong>`;
    }

    const approvedOBIdMatch = action.match(
      /^Approved the Official Business ID: (\d+)$/
    );
    if (approvedOBIdMatch) {
      return `Approved the Official Business ID: <strong>${approvedOBIdMatch[1]}</strong>`;
    }

    const declinedOBIdMatch = action.match(
      /^Declined the Official Business ID: (\d+)$/
    );
    if (declinedOBIdMatch) {
      return `Declined the Official Business ID: <strong>${declinedOBIdMatch[1]}</strong>`;
    }

    return action;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        maxHeight: 800,
        overflowY: "auto",
      }}
    >
      {/* Rows Per Page selector only, top left */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>
          Rows per page:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          size="small"
          sx={{ minWidth: 80 }}
        >
          {[10, 25, 50].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Table sx={{ minWidth: 650, borderCollapse: "collapse" }}>
        <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
          <TableRow>
            <TableCell
              sx={{
                fontWeight: "bold",
                padding: "12px 16px",
                borderRight: "1px solid #ddd",
              }}
            >
              User
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                padding: "12px 16px",
                borderRight: "1px solid #ddd",
              }}
            >
              Action
            </TableCell>
            <TableCell
              sx={{
                fontWeight: "bold",
                padding: "12px 16px",
                borderRight: "1px solid #ddd",
              }}
            >
              Remarks
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", padding: "12px 16px" }}>
              Date
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedLogs.length > 0 ? (
            paginatedLogs.map((log) => (
              <TableRow
                key={log.id || `${log.user_name}-${log.date}`}
                hover
                sx={{
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  transition: "background-color 0.3s ease",
                }}
              >
                <TableCell
                  sx={{ padding: "8px 16px", borderRight: "1px solid #ddd" }}
                >
                  {log.user_name || "N/A"}
                </TableCell>
                <TableCell
                  sx={{ padding: "8px 16px", borderRight: "1px solid #ddd" }}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formatAction(log.action),
                    }}
                  />
                </TableCell>

                <TableCell
                  sx={{ padding: "8px 16px", borderRight: "1px solid #ddd" }}
                >
                  {log.remarks || "None"}
                </TableCell>
                <TableCell sx={{ padding: "8px 16px" }}>
                  {log.date
                    ? new Date(log.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                sx={{
                  textAlign: "center",
                  py: 3,
                  fontStyle: "italic",
                  color: "#888",
                }}
              >
                {data !== null ? "No data available" : "No logs available"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Page navigation only, bottom right */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          px: 2,
          py: 1.5,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, logsToDisplay.length)} of{" "}
          {logsToDisplay.length}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            onClick={() => handleChangePage(null, page - 1)}
            disabled={page === 0}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              "& .MuiButton-root": {
                minWidth: "32px",
                height: "32px",
                borderRadius: "6px",
                padding: 0,
              },
            }}
          >
            {[...Array(endPage - startPage + 1).keys()].map((i) => {
              const pageNum = startPage + i;
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "contained" : "text"}
                  size="small"
                  onClick={() => handleChangePage(null, pageNum)}
                  sx={{
                    fontWeight: page === pageNum ? 600 : 400,
                    backgroundColor:
                      page === pageNum ? "primary.main" : "transparent",
                    color:
                      page === pageNum
                        ? "primary.contrastText"
                        : "text.primary",
                    "&:hover": {
                      backgroundColor:
                        page === pageNum ? "primary.dark" : "action.hover",
                    },
                  }}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </Box>

          <IconButton
            onClick={() => handleChangePage(null, page + 1)}
            disabled={page >= totalPages - 1}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": {
                opacity: 0.5,
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </TableContainer>
  );
}
//02/17/25 | Function Approving Employee--to call into the Tabs in the Approving Home
//Boncales | 02/14/25 | DOLE-X CDO-FO Organizational Structure
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export function ApprovingEmployee({ refreshHistoryLogs, viewType = "organizational-chart" }) {
  const navigate = useNavigate();
  const [menuAnchor, setMenuAnchor] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [personnel, setPersonnel] = React.useState([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("All"); // Filter by position
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [rowsPerPage, setRowsPerPage] = useState(10); // 10 items per page
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingId, setEditingId] = useState(null); // ID of the row being edited
  const [editedName, setEditedName] = useState(""); // The name being edited
  const [headPositions, setHeadPositions] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handlePositionFilterChange = (e) => {
    setPositionFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1); // Convert from 0-based to 1-based
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to first page
  };

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((emp) => {
        const firstName = emp.first_name?.toLowerCase() || "";
        const lastName = emp.last_name?.toLowerCase() || "";
        const positionName = emp.position_name?.toLowerCase() || "";
        const term = searchTerm.toLowerCase();

        // Search filter
        const matchesSearch =
          firstName.includes(term) ||
          lastName.includes(term) ||
          positionName.includes(term);

        // Position filter
        const matchesPosition =
          positionFilter === "All" || emp.position_name === positionFilter;

        return matchesSearch && matchesPosition;
      })
    : [];

  const [editedData, setEditedData] = useState({
    first_name: "",
    last_name: "",
    position_name: "",
  });
  const handleEditEmployeeAll = (emp) => {
    setSelectedEmployee(emp);

    setEmployeeData({
      ...emp,
      isHead: emp.name === headOfCompany.name,
    });

    setEditedData({
      first_name: emp.first_name,
      last_name: emp.last_name,
      position_id: emp.position_id, // Use position ID instead of name
    });

    setEditingEmployeeId(emp.id);
  };
  const handleEdit = (emp) => {
    setSelectedEmployee(emp);

    setEmployeeData({
      ...emp,
      isHead: emp.name === headOfCompany.name,
    });

    setEditedData({
      first_name: emp.first_name,
      last_name: emp.last_name,
      position_id: emp.position_id, // Use position ID instead of name
    });

    setEditingEmployeeId(emp.id);
    setOpenEdit(true);
  };
  // Function to safely stringify an object, ignoring circular references
  const safeStringify = (obj) => {
    const seen = new Set();
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return; // Avoid circular reference
        }
        seen.add(value);
      }
      return value;
    });
  };

  const handleSave = async () => {
    try {
      if (!editingEmployeeId) return;

      // Send the updated data to the server
      await updateEmployee(editingEmployeeId, editedData);

      // Find the updated position name
      const updatedPosition = positions.find(
        (pos) => pos.id === editedData.position_id
      );

      // Reflect the changes locally
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === editingEmployeeId
            ? {
                ...emp,
                first_name: editedData.first_name,
                last_name: editedData.last_name,
                position_id: editedData.position_id,
                position_name: updatedPosition?.name || emp.position_name,
              }
            : emp
        )
      );

      // Exit edit mode
      setEditingEmployeeId(null);

      // ✅ Refresh history logs
      if (typeof refreshHistoryLogs === "function") {
        await refreshHistoryLogs();
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
      // Optionally show an error message to the user
    }
  };

  // Called when Edit icon is clicked
  const handleEditPosition = (position) => {
    setEditingId(position.id);
    setEditedName(position.name);
  };

  // Called when Save icon is clicked
  const handleSavePosition = async (id) => {
    try {
      await updatePosition(id, { name: editedName });

      setPositions((prev) =>
        prev.map((pos) => (pos.id === id ? { ...pos, name: editedName } : pos))
      );

      setEditingId(null);

      if (typeof refreshHistoryLogs === "function") {
        await refreshHistoryLogs(); // Refresh the logs after successful update
      }
    } catch (error) {
      console.error("Error saving position:", error);
      // Optional: handle error (e.g., show toast, revert UI, etc.)
    }
  };

  const [headOfCompany, setHeadOfCompany] = useState({
    image: "https://dolexportal.com/img/cdo/toledo.jpg",
    headName: "Emmanuel G. Toledo",
    headPosition: "Cagayan de Oro Field Office, Head, DOLE 10SSS",
  });

  useEffect(() => {
    // Assuming employees is an array passed as a prop or fetched elsewhere
    if (employees && employees.length > 0) {
      const head = employees.find((emp) => emp.isHead);

      if (head) {
        setHeadOfCompany({
          image: head.image || "",
          headName: head.name || head.HeadName || "No Name",
          headPosition: head.position || head.Headposition || "No Position",
        });
      }
    }
  }, [employees]); // Run effect whenever employees changes

  // Log headOfCompany state updates
  useEffect(() => {}, [headOfCompany]);

  // Move fetchData outside so it's accessible to both functions
  const [isFetching, setIsFetching] = useState(true); // Only for initial data load
  const fetchEmployeeData = async () => {
    try {
      setIsFetching(true);

      const response = await fetchEmployees(); // Expected: { employees: [...], head_positions: [...] }

      const employees = Array.isArray(response?.employees)
        ? response.employees
        : [];

      const headPositions = Array.isArray(response?.head_positions)
        ? response.head_positions
        : [];

      setPersonnel(employees);
      setHeadPositions(headPositions); // ✅ Make sure you're not using optional chaining here
    } catch (error) {
      console.error("Error fetching employee data:", error);
      setPersonnel([]);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const handleEditEmployeeSave = async (updatedEmployee) => {
    try {
      // Extract employee ID
      let employeeId =
        updatedEmployee instanceof FormData
          ? updatedEmployee.get("id")
          : updatedEmployee?.id;

      if (!employeeId) {
        throw new Error("Employee ID is missing before update call");
      }

      let payload;

      // If FormData, use directly
      if (updatedEmployee instanceof FormData) {
        payload = updatedEmployee;

        // Optional debug
        for (let pair of updatedEmployee.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      // If object with a photo file, convert to FormData
      else if (updatedEmployee.employee_photo instanceof File) {
        const formData = new FormData();
        formData.append("id", String(employeeId));
        formData.append("employee_photo", updatedEmployee.employee_photo);
        formData.append("first_name", updatedEmployee.first_name || "");
        formData.append("middle_name", updatedEmployee.middle_name || "");
        formData.append("last_name", updatedEmployee.last_name || "");
        formData.append("suffix", updatedEmployee.suffix || "");
        formData.append(
          "position_id",
          String(updatedEmployee.position_id || "")
        );
        formData.append("status", updatedEmployee.status || "active");
        formData.append("email", updatedEmployee.email || "");
        formData.append("phone", updatedEmployee.phone || "");
        formData.append("address", updatedEmployee.address || "");
        // formData.append("hire_date", updatedEmployee.hire_date || "");

        payload = formData;

        for (let pair of formData.entries()) {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
      // Otherwise use plain object
      else {
        payload = { ...updatedEmployee };
      }

      const response = await updateEmployee(employeeId, payload);
      const updatedData = response?.data || updatedEmployee;

      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.id === Number(employeeId) ? { ...emp, ...updatedData } : emp
        )
      );

      setOpenEdit(false);
      fetchEmployeeData();

      // ✅ Refresh the history log after update
      // ✅ Call the function to refresh history logs
      if (typeof refreshHistoryLogs === "function") {
        await refreshHistoryLogs();
      }
    } catch (error) {
      console.error("Failed to save employee:", error);
      Swal.fire({
        title: "Failed to save",
        text: error.message || "An unknown error occurred.",
        icon: "error",
      });
    }
  };

  // Default Personnel Directory
  const defaultPersonnel = [
    {
      image: "https://dolexportal.com/img/cdo/cagas.jpg",
      name: "CAGAS, ROMMIL M.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/harnaiz.jpg",
      name: "HARNAIZ, Mary Joyce A.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/mahusay.jpg",
      name: "MAHUSAY, Erlinda M.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/taeza.jpg",
      name: "TAEZA, Jennibeth P.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/cano.jpg",
      name: "CANO, Paolo Miguel P.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/aparecio.jpg",
      name: "APARICIO, Harold D.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/imsd/hazel.jpg",
      name: "SUMOBAY, Hazel S.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/alonto.jpg",
      name: "TALON, Sittie Nashiba D.",
      position: "SR. LEO",
    },
    {
      image: "https://dolexportal.com/img/cdo/caling.jpg",
      name: "CALING, Mhardy Mae V.",
      position: "LEO III",
    },
    {
      image: "https://dolexportal.com/img/cdo/busangilan.jpg",
      name: "BUSANGILAN, Rommyl Rey C.",
      position: "LEO III",
    },
    {
      image: "https://dolexportal.com/img/cdo/casino.jpg",
      name: "CASIÑO, Roy S.",
      position: "LEO III",
    },
    {
      image: "https://dolexportal.com/img/cdo/dalagan.jpg",
      name: "DALAGAN, Roel C.",
      position: "LEO III",
    },
    {
      image: "https://dolexportal.com/img/cdo/tangara.jpg",
      name: "TANGARA, Joyce R.",
      position: "LEO I",
    },
  ];

  // Load personnel and head of the company from localStorage
  React.useEffect(() => {
    const savedPersonnel = JSON.parse(localStorage.getItem("personnel")) || [];
    const savedHead = JSON.parse(localStorage.getItem("headOfCompany"));

    if (savedHead) {
      setHeadOfCompany(savedHead);
    }

    const mergedPersonnel = defaultPersonnel.map((defaultPerson) => {
      const editedPerson = savedPersonnel.find(
        (p) => p.name === defaultPerson.name
      );
      return editedPerson ? editedPerson : defaultPerson;
    });

    setPersonnel(mergedPersonnel);
  }, []);

  React.useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees(); // Expected: { employees: [...] }
        const employeeList = Array.isArray(data?.employees)
          ? data.employees
          : [];
        setEmployees(employeeList);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setEmployees([]); // fallback to empty array on error
      }
    };

    if (viewType === "manage-employee") loadEmployees();
  }, [viewType]);

  // Open menu for a specific employee
  const handleMenuOpen = (event, employee) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEmployee(null);
  };

  const [openEdit, setOpenEdit] = React.useState(false);

  const [employeeData, setEmployeeData] = React.useState(null);

  const handleClickOpen = () => {
    setOpenAdd(true);
    setOpenEdit(false);
  };
  const handleClose = () => {
    setOpenAdd(false);
    setOpenEdit(false);
    setOpen(false); // This will close the dialog by setting the open state to false
  };

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffix, setSuffix] = useState("");
  const [position, setPosition] = useState("");
  const [positionName, setPositionName] = useState("");
  const [imageError, setImageError] = useState("");

  const requiredPhotoPositions = ["LEO I", "LEO II", "LEO III", "Sr LEO"];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview (base64 string) for UI
      };
      reader.readAsDataURL(file); // Convert file to base64 string for preview
    }
  };

  // Remove Selected Image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null); // Reset the preview if image is removed
  };
  // Handle Form Submission
  const handleCreateEmployee = async () => {
    setImageError(""); // Clear previous image error
    const requiredPositions = ["LEO I", "LEO II", "LEO III", "SR LEO"];
    const selectedPositionName =
      positions.find((pos) => pos.id === position)?.name || "";
    const isPhotoRequired = requiredPositions.includes(selectedPositionName);

    if (!firstName || !lastName || !position) {
      Swal.fire({
        title: "Error",
        text: "Please fill in all required fields.",
        icon: "error",
      });
      handleClose();
      return;
    }

    if (isPhotoRequired && !image) {
      setImageError("Photo is required for LEO positions.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("middle_name", middleInitial || "");
      formData.append("suffix", suffix || "");
      formData.append("email", null);
      formData.append("hire_date", new Date().toISOString().split("T")[0]);
      formData.append("position_id", position);

      if (image instanceof File) {
        formData.append("employee_photo", image);
      }

      await storeEmployee(formData);

      Swal.fire({
        title: "Successfully saved!",
        icon: "success",
      });

      // Reset all fields
      setFirstName("");
      setMiddleInitial("");
      setLastName("");
      setSuffix("");
      setPosition("");
      setImage(null);
      setImagePreview(null);
      setImageError("");
      handleClose();

      // Refresh employee list
      try {
        const data = await fetchEmployees();
        const employeeList = Array.isArray(data?.employees)
          ? data.employees
          : [];
        setEmployees(employeeList);
      } catch (error) {
        console.error("Failed to refresh employees:", error);
      }

      // ✅ Call the function to refresh history logs
      if (typeof refreshHistoryLogs === "function") {
        await refreshHistoryLogs();
      }
    } catch (error) {
      console.error("Error creating employee:", error);

      Swal.fire({
        title: "Error",
        text: "An error occurred while saving the employee.",
        icon: "error",
      });
      handleClose();
    }
  };

  // Modal open/close state
  const [open, setOpen] = useState(false);
  const handleOpenPositionModal = () => setOpen(true);

  // Positions state

  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPositions = async () => {
      try {
        const data = await fetchPositions(); // Fetch positions from the API
        setPositions(data); // Set the fetched data to state
      } catch (error) {
        console.error("Error loading positions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPositions();
  }, []);

  const [positionNameInput, setPositionNameInput] = useState(""); // Separate state for position management modal

  const handleSubmitPosition = async () => {
    if (!positionNameInput.trim()) return; // Prevent empty input

    try {
      const newPosition = await storePosition(positionNameInput); // API call with toast inside

      // After adding a new position, refetch the positions from the server
      const updatedPositions = await fetchPositions(); // Re-fetch positions
      setPositions(updatedPositions); // Update state with the fresh data

      setPositionNameInput(""); // Clear input

      // Refresh history logs if the function exists
      if (typeof refreshHistoryLogs === "function") {
        await refreshHistoryLogs();
      }
    } catch (err) {
      console.error("Error saving position:", err);
    }
  };

  // Delete position
  const handleDeletePosition = async (id) => {
    const positionToDelete = positions.find((pos) => pos.id === id);
    handleClose();

    if (!positionToDelete) {
      return Swal.fire({
        title: "Error",
        text: "Position not found.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { popup: "swal-popup-zindex" },
      });
    }

    const result = await Swal.fire({
      title: `Are you sure you want to delete "${positionToDelete.name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-popup-zindex",
      },
    });

    if (result.isConfirmed) {
      const response = await SoftDeletePosition(id);

      if (response.success) {
        const updated = positions.filter((pos) => pos.id !== id);
        setPositions(updated);

        if (typeof refreshHistoryLogs === "function") {
          await refreshHistoryLogs();
        }

        Swal.fire({
          title: "Deleted!",
          text: `"${positionToDelete.name}" has been deleted.`,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup-zindex",
          },
        });
      } else {
        Swal.fire({
          title: "Error",
          text: response.message || "Failed to delete position.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup-zindex",
          },
        });
      }
    }
  };

  const hostname = window.location.hostname;

  const API_BASE_URL =
    hostname === "localhost" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
      ? `http://${hostname}:8000/api` // Development or LAN
      : `https://api.dolexcdo.online/api`; // Production

  // const handleEdit = (emp) => {
  //   setFirstName(emp.first_name);
  //   setLastName(emp.last_name);
  //   setMiddleInitial(emp.middle_initial || '');
  //   setSuffix(emp.suffix || '');
  //   setPosition(emp.position_id);
  //   setSelectedEmployee(emp); // You may want to track the selected one
  // };
  const handleDelete = async (id) => {
    const employee = filteredEmployees.find((emp) => emp.id === id);
    handleClose();

    if (!employee) {
      return Swal.fire({
        title: "Error",
        text: "Employee not found.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: { popup: "swal-popup-zindex" },
      });
    }

    const result = await Swal.fire({
      title: `Are you sure you want to delete "${employee.first_name} ${employee.last_name}"?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: "swal-popup-zindex",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await SoftDeleteEmployee(id);

        if (response.success) {
          await Swal.fire({
            title: "Deleted!",
            text: `"${employee.first_name} ${employee.last_name}" has been deleted.`,
            icon: "success",
            confirmButtonText: "OK",
            customClass: {
              popup: "swal-popup-zindex",
            },
          });

          await fetchEmployees(); // Refresh employee list

          if (typeof refreshHistoryLogs === "function") {
            await refreshHistoryLogs(); // Refresh history logs
          }
        } else {
          throw new Error(response.message || "Deletion failed.");
        }
      } catch (error) {
        await Swal.fire({
          title: "Error",
          text: error.message || "An error occurred while deleting.",
          icon: "error",
          confirmButtonText: "OK",
          customClass: {
            popup: "swal-popup-zindex",
          },
        });
      }
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        textAlign: "center",
        paddingBottom: 3,
        overflow: "visible", // Remove redundant scrollbar
      }}
    >
      <Card
        sx={{
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "#ffffff", // White background for card-like effect
          opacity: 0.95, // Adjust opacity here (value between 0 and 1)
        }}
      >
        {/* 02/14/25 | Title of the organizational strucuture */}
        {viewType === "organizational-chart" ? (
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ textAlign: "center", mb: 2 }}
          >
            Cagayan De Oro Provincial Field Office
            <br />
            <Box sx={{ textAlign: "center" }}>ORGANIZATIONAL STRUCTURE</Box>
          </Typography>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              gap: 2,
            }}
          >
            <Box sx={{ flex: 1 }} />
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ textAlign: { xs: "center", sm: "left" } }}
            >
              Manage Employees
            </Typography>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={handleClickOpen}
              >
                Add Employee
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleOpenPositionModal}
              >
                Manage Positions
              </Button>
            </Box>
          </Box>
        )}

        {/* Employee Table - Display directly in manage-employee view */}
        {viewType === "manage-employee" && (
          <Box mt={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              gap={2}
              mb={2}
            >
              <Typography variant="h6" gutterBottom>
                All Employees
              </Typography>
              <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Filter by Position</InputLabel>
                  <Select
                    value={positionFilter}
                    onChange={handlePositionFilterChange}
                    label="Filter by Position"
                  >
                    <MenuItem value="All">All Positions</MenuItem>
                    {positions
                      .filter((pos) => 
                        !["Sr LEO", "LEO I", "LEO II", "LEO III"].includes(pos.name)
                      )
                      .map((pos) => (
                        <MenuItem key={pos.id} value={pos.name}>
                          {pos.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ width: 200 }}
                />
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>No.</TableCell>
                    <TableCell>First Name</TableCell>
                    <TableCell>Last Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    const visibleEmployees =
                      filteredEmployees?.filter(
                        (emp) =>
                          ![
                            "Sr LEO",
                            "LEO I",
                            "LEO II",
                            "LEO III",
                          ].includes(emp.position_name)
                      ) || [];

                    // Pagination logic
                    const totalPages = Math.ceil(visibleEmployees.length / rowsPerPage);
                    const startIndex = (currentPage - 1) * rowsPerPage;
                    const endIndex = startIndex + rowsPerPage;
                    const paginatedEmployees = visibleEmployees.slice(startIndex, endIndex);

                    return paginatedEmployees.length > 0 ? (
                      paginatedEmployees.map((emp, index) => (
                        <TableRow
                          key={emp.id}
                          hover
                          sx={{
                            cursor: "pointer",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <TableCell>{startIndex + index + 1}</TableCell>

                          {editingEmployeeId === emp.id ? (
                            <>
                              <TableCell>
                                <TextField
                                  variant="standard"
                                  value={editedData.first_name}
                                  onChange={(e) =>
                                    setEditedData({
                                      ...editedData,
                                      first_name: e.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  variant="standard"
                                  value={editedData.last_name}
                                  onChange={(e) =>
                                    setEditedData({
                                      ...editedData,
                                      last_name: e.target.value,
                                    })
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <FormControl variant="standard" fullWidth>
                                  <Select
                                    value={editedData.position_id}
                                    onChange={(e) =>
                                      setEditedData({
                                        ...editedData,
                                        position_id: e.target.value,
                                      })
                                    }
                                  >
                                    {positions.map((pos) => (
                                      <MenuItem key={pos.id} value={pos.id}>
                                        {pos.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell align="center">
                                <Tooltip title="Save" arrow>
                                  <IconButton
                                    onClick={handleSave}
                                    size="small"
                                    sx={{ color: "green" }}
                                  >
                                    <SaveIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{emp.first_name}</TableCell>
                              <TableCell>{emp.last_name}</TableCell>
                              <TableCell>{emp.position_name}</TableCell>
                              <TableCell align="center">
                                <Tooltip title="Edit" arrow>
                                  <IconButton
                                    onClick={() =>
                                      handleEditEmployeeAll(emp)
                                    }
                                    size="small"
                                    sx={{ color: "#1976d2" }}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                  <IconButton
                                    onClick={() => handleDelete(emp.id)}
                                    size="small"
                                    sx={{ color: "#d32f2f" }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No data available
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination Controls */}
            <TablePagination
              component="div"
              count={filteredEmployees.filter(
                (emp) =>
                  ![
                    "Sr LEO",
                    "LEO I",
                    "LEO II",
                    "LEO III",
                  ].includes(emp.position_name)
              ).length}
              page={currentPage - 1} // Convert from 1-based to 0-based for TablePagination
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50]}
              labelRowsPerPage="Rows per page:"
            />
          </Box>
        )}

        {/* adding position */}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          sx={{ "& .MuiDialog-paper": { width: "95vw", maxWidth: 600 } }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: { xs: 1.5, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
            id="customized-dialog-title"
          >
            Manage Positions
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent
            dividers
            sx={{ maxHeight: "75vh", overflowY: "auto", p: { xs: 2, sm: 3 } }}
          >
            <Card
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
              }}
            >
              {/* Position Name Input Field */}
              <TextField
                label="Position Name"
                fullWidth
                variant="outlined"
                value={positionNameInput}
                onChange={(e) => setPositionNameInput(e.target.value)}
                required
                sx={{
                  mb: 2,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                }}
              />

              {/* Save Position Button */}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={handleSubmitPosition}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&:hover": { backgroundColor: "#D9D9D9" },
                  }}
                >
                  Save Position
                </Button>
              </Box>

              {/* Displaying Current Positions in a Table */}
              <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
                Current Positions
              </Typography>

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>No.</TableCell>

                      <TableCell>Position</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {positions.length > 0 ? (
                      positions.map((position, index) => (
                        <TableRow key={position.id}>
                          {/* No. column */}
                          <TableCell>{index + 1}</TableCell>

                          {/* Position name column */}
                          <TableCell>
                            {editingId === position.id ? (
                              <TextField
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                size="small"
                                variant="standard"
                              />
                            ) : (
                              position.name
                            )}
                          </TableCell>

                          {/* Actions column */}
                          <TableCell align="right">
                            {editingId === position.id ? (
                              <IconButton
                                onClick={() => handleSavePosition(position.id)}
                              >
                                <SaveIcon sx={{ color: "green" }} />
                              </IconButton>
                            ) : (
                              <IconButton
                                onClick={() => handleEditPosition(position)}
                              >
                                <EditIcon color="primary" />
                              </IconButton>
                            )}
                            <IconButton
                              onClick={() => handleDeletePosition(position.id)}
                            >
                              <DeleteIcon color="error" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          No positions added.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </DialogContent>
        </BootstrapDialog>

        {/* Head of the Company - Only show in organizational-chart view */}
        {viewType === "organizational-chart" && (
        <>
        {/* Head of the Company */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Head of the Company
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 5 }}>
          {headPositions
            .filter((h) => h.position === "DolexCDO Chief" && h.is_active === 1)
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

        {/* Personnel Directory */}
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Directory of Personnel
        </Typography>

        <Grid container spacing={2} justifyContent="center" mb={4}>
          {isFetching ? (
            // Loading state
            <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
              <Typography variant="body1" sx={{ mt: 2 }}>
                Loading personnel data...
              </Typography>
            </Grid>
          ) : (
            // Actual content
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
                      height: "100%", // Make all cards the same height
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      minHeight: "280px", // Set minimum height for consistency
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

                    <IconButton
                      sx={{ position: "absolute", top: 8, right: 8 }}
                      onClick={(event) => handleMenuOpen(event, person)}
                    >
                      <MoreHoriz />
                    </IconButton>
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
        </>
        )}

        {/* Menu for editing/removing employees - Available in both views */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose(); // This will close the menu
              handleEdit(selectedEmployee); // Use your existing edit handler
            }}
          >
            Edit
          </MenuItem>
        </Menu>

        {/* Move the dialog outside the Menu component */}
        <BootstrapDialog
          onClose={() => setOpenEdit(false)}
          aria-labelledby="customized-dialog-title"
          open={openEdit}
          sx={{ "& .MuiDialog-paper": { width: "95vw", maxWidth: 500 } }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: { xs: 1.5, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
            id="customized-dialog-title"
          >
            Edit Employee
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={() => setOpenEdit(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            dividers
            sx={{ maxHeight: "75vh", overflowY: "auto", p: { xs: 2, sm: 3 } }}
          >
            {selectedEmployee && (
              <EditEmployee
                employeeData={selectedEmployee}
                onClose={() => setOpenEdit(false)}
                availablePositions={positions}
                onSave={handleEditEmployeeSave}
              />
            )}
          </DialogContent>
        </BootstrapDialog>

        {/* Add Employee Dialog */}
        <BootstrapDialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={openAdd}
          sx={{ "& .MuiDialog-paper": { width: "95vw", maxWidth: 500 } }}
        >
          <DialogTitle
            sx={{
              m: 0,
              p: { xs: 1.5, sm: 2 },
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
            id="customized-dialog-title"
          >
            Add Employee
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent
            dividers
            sx={{ maxHeight: "75vh", overflowY: "auto", p: { xs: 2, sm: 3 } }}
          >
            <Card
              sx={{
                p: { xs: 2, sm: 4 },
                borderRadius: 3,
                backgroundColor: "#ffffff",
              }}
            >
              {/* Image Upload Section */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar
                  src={imagePreview || "https://picsum.photos/120"}
                  alt="Employee Photo"
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="add-employee-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="add-employee-image-upload">
                  <Button variant="contained" component="span">
                    Upload Photo
                  </Button>
                </label>
                {imageError && (
                  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                    {imageError}
                  </Typography>
                )}
              </Box>

              {/* First Name */}
              <TextField
                label="First Name"
                fullWidth
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                sx={{ mt: 2, mb: 2 }}
              />

              {/* Middle Initial */}
              <TextField
                label="Middle Initial"
                fullWidth
                variant="outlined"
                value={middleInitial}
                onChange={(e) => setMiddleInitial(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Last Name */}
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />

              {/* Suffix */}
              <TextField
                label="Suffix"
                fullWidth
                variant="outlined"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder="Jr., Sr., II, III, etc."
                sx={{ mb: 2 }}
              />

              {/* Position Dropdown */}
              <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                <InputLabel id="add-position-select-label">Position *</InputLabel>
                <Select
                  labelId="add-position-select-label"
                  id="add-position-select"
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    const selectedPos = positions.find((pos) => pos.id === e.target.value);
                    setPositionName(selectedPos?.name || "");
                    setImageError(""); // Clear error when position changes
                  }}
                  label="Position *"
                >
                  {positions.map((pos) => (
                    <MenuItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Save Button */}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  onClick={handleCreateEmployee}
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    "&:hover": { backgroundColor: "#D9D9D9" },
                  }}
                >
                  Save Employee
                </Button>
              </Box>
            </Card>
          </DialogContent>
        </BootstrapDialog>
      </Card>
    </Box>
  );
}
// Edit Employee details (name & position) in organizational structure
export function EditEmployee({
  employeeData,
  onClose,
  availablePositions = [],
  onSave,
}) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const hostname = window.location.hostname;

  const API_BASE_URL =
    hostname === "localhost" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
      ? `http://${hostname}:8000/api` // Development or LAN
      : `https://api.dolexcdo.online/api`; // Production

  // Initialize with employeeData photo if available
  const initialEmployeePhoto = employeeData?.employee_photo || null;

  const [employee, setEmployee] = useState({
    name: "",
    positionId: "",
    employee_photo: initialEmployeePhoto,
    imageFile: null,
  });

  // For previewing newly uploaded image (Base64 or URL)
  const [previewImage, setPreviewImage] = useState("");

  // Debugging: Log current employee and previewImage when they change

  useEffect(() => {
    const hostname = window.location.hostname;
    const baseUrl =
      hostname === "localhost" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.")
        ? `http://${hostname}:8000`
        : "https://travelsystem.dolexcdo.online";
    
    const currentAvatarSrc =
      previewImage ||
      (employee.employee_photo
        ? (() => {
            // Employee photos are in /storage/employee_photos/
            let imagePath = employee.employee_photo.replace(/^\/+/, "");
            
            // If path already includes full URL, use it as is
            if (imagePath.startsWith("http")) {
              return imagePath;
            }
            // If path already includes storage/employee_photos/, use it as is
            if (imagePath.startsWith("storage/employee_photos/")) {
              return `${baseUrl}/${imagePath}`;
            }
            // If path starts with employee_photos/, add storage/
            if (imagePath.startsWith("employee_photos/")) {
              return `${baseUrl}/storage/${imagePath}`;
            }
            // If path starts with storage/, add employee_photos/
            if (imagePath.startsWith("storage/")) {
              return `${baseUrl}/${imagePath}`;
            }
            // Otherwise, construct the full path (assume it's just a filename)
            return `${baseUrl}/storage/employee_photos/${imagePath}`;
          })()
        : "https://picsum.photos/120");
  }, [employee.employee_photo, previewImage]);

  // Sync employee state when employeeData changes
  useEffect(() => {
    if (employeeData) {
      const fullName = [
        employeeData.first_name,
        employeeData.middle_name,
        employeeData.last_name,
      ]
        .filter(Boolean)
        .join(" ");

      setEmployee({
        name: fullName,
        positionId: employeeData.position_id || "",
        employee_photo: employeeData.employee_photo || null,
        imageFile: null,
      });

      setPreviewImage(""); // Clear preview when loading new employee data
    }
  }, [employeeData]);

  // Compute avatar source (previewImage preferred, then stored photo, else placeholder)
  const avatarSrc =
    previewImage ||
    (employee.employee_photo
      ? `${API_BASE_URL.replace(
          /\/api\/?$/,
          ""
        )}/storage/${employee.employee_photo.replace(/^\/+/, "")}`
      : "https://picsum.photos/120");

  // Debugging: log avatar source when it changes
  useEffect(() => {}, [avatarSrc]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemoveImage = () => {
    setEmployee((prev) => ({
      ...prev,
      employee_photo: null,
      imageFile: null,
    }));
    setPreviewImage("");
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setEmployee((prev) => ({
        ...prev,
        imageFile: file, // new image file
        employee_photo: null, // clear current photo path because new image is pending upload
      }));

      // Create preview URL for UI
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveClick = async () => {
    if (!employee.name.trim()) {
      Swal.fire({ title: "Name cannot be empty", icon: "warning" });
      return;
    }

    try {
      // Parse name parts
      const nameParts = employee.name.trim().split(/\s+/);
      let firstName = "",
        middleName = null,
        lastName = "",
        suffix = null;

      if (nameParts.length === 1) {
        firstName = nameParts[0];
      } else if (nameParts.length === 2) {
        [firstName, lastName] = nameParts;
      } else {
        const suffixList = ["Jr", "Sr", "II", "III", "IV"];
        const lastPart = nameParts[nameParts.length - 1];

        if (suffixList.includes(lastPart)) {
          suffix = lastPart;
          nameParts.pop();
        }

        firstName = nameParts[0];
        lastName = nameParts.pop();
        if (nameParts.length > 0) {
          middleName = nameParts.slice(1).join(" ");
        }
      }

      // Prepare the updated employee data
      const updatedEmployee = {
        id: employeeData.id,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        suffix: suffix,
        position_id: Number(employee.positionId),
        // // Only include employee_photo if it's a string (existing path)
        // ...(employee.employee_photo && {
        //   employee_photo: employee.employee_photo,
      };

      // Log the base employee data

      // If there's a new image file, we need to include it
      let payload = updatedEmployee;
      if (employee.imageFile) {
        const formData = new FormData();
        formData.append("employee_photo", employee.imageFile);

        // Append other fields safely as strings
        Object.entries(updatedEmployee).forEach(([key, value]) => {
          formData.append(
            key,
            value !== null && value !== undefined ? String(value) : ""
          );
        });

        payload = formData;

        // Log FormData contents
      }

      // Call the parent's save handler with the correct payload
      await onSave(payload);

      onClose();
    } catch (error) {
      console.error("Save error:", error);
      Swal.fire({
        title: "Failed to save",
        text: error.message || "An error occurred while saving",
        icon: "error",
      });
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      sx={{ padding: { xs: 2, sm: 4 }, position: "relative" }}
    >
      {/* Image Upload Section */}
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          src={avatarSrc}
          alt="Employee Photo"
          sx={{ width: 120, height: 120, mb: 2 }}
          imgProps={{
            onError: (e) => {
              e.currentTarget.src = "/fallback-image.png";
            },
          }}
        />

        {/* {employee.employee_photo || previewImage ? (
          <Button
            variant="outlined"
            color="error"
            onClick={handleRemoveImage}
            sx={{ mb: 2 }}
          >
            Remove Image
          </Button>
        ) : null} */}

        <input
          accept="image/*"
          style={{ display: "none" }}
          id="employee-image-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="employee-image-upload">
          <Button variant="contained" component="span">
            Upload Photo
          </Button>
        </label>
      </Box>

      <TextField
        name="name"
        value={employee.name}
        onChange={handleChange}
        placeholder="Name"
        fullWidth
        variant="outlined"
        sx={{ mt: 1, fontSize: { xs: "0.875rem", sm: "1rem" } }}
      />

      {/* Dropdown for Position */}
      <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
        <InputLabel id="position-select-label">Position</InputLabel>
        <Select
          labelId="position-select-label"
          name="positionId"
          value={String(employee.positionId)}
          onChange={handleChange}
          label="Position"
        >
          {availablePositions.map((position) => (
            <MenuItem key={position.id} value={String(position.id)}>
              {position.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box display="flex" justifyContent="center" mt={3}>
        <Button
          variant="contained"
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: "0.875rem", sm: "1rem" },
            "&:hover": { backgroundColor: "#D9D9D9" },
          }}
          onClick={handleSaveClick}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
//Sample statistics of a person bar chart of TO/OB/Pass Slip

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
export function StatisticsEmployee({
  data: employeeCountsOfficialBusiness,
  travelOrderData: employeeCountsTravelOrder,
  passSlipData: employeeCountsPassSlip,
}) {
  const [view, setView] = useState(null); // Initial state is null (no filter)
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("YYYY-MM")); // Default to current month
  const [selectedWeek, setSelectedWeek] = useState(1); // Default to Week 1
  const [filteredData, setFilteredData] = useState({
    officialBusiness: [],
    travelOrder: [],
    passSlip: [],
  });

  const isMobile = useMediaQuery("(max-width:600px)");

  // Generate list of months for the selector (last 12 months + current month)
  const generateMonthOptions = () => {
    const months = [];
    const current = dayjs();
    for (let i = 11; i >= 0; i--) {
      const month = current.subtract(i, "month");
      months.push({
        value: month.format("YYYY-MM"),
        label: month.format("MMMM YYYY"),
      });
    }
    return months;
  };

  // Generate list of weeks for the selected month (Week 1-4)
  const generateWeekOptions = () => {
    const monthDayjs = dayjs(selectedMonth);
    const weeks = [];
    const firstDayOfMonth = monthDayjs.startOf("month");
    const lastDayOfMonth = monthDayjs.endOf("month");
    const firstWeekStart = firstDayOfMonth.startOf("week");
    
    // Generate 4 week options
    for (let week = 1; week <= 4; week++) {
      const weekStart = firstWeekStart.add((week - 1) * 7, "day");
      const weekEnd = weekStart.endOf("week");
      
      // Only include weeks that overlap with the selected month
      if (weekEnd.isSameOrAfter(firstDayOfMonth) && weekStart.isSameOrBefore(lastDayOfMonth)) {
        weeks.push({
          value: week,
          label: `Week ${week}`,
          startDate: weekStart.format("MMM D"),
          endDate: weekEnd.format("MMM D, YYYY"),
        });
      }
    }
    
    return weeks;
  };

  // Filter the data based on the selected view (weekly or monthly), month, and week
  const filterDataByDate = (data, view, monthValue, weekValue) => {
    // If no view is selected, return all data (no filtering)
    if (!view) {
      return Object.entries(data).map(([label, info]) => ({
        label,
        count: info.count,
        approved_at: info.approved_at || [],
      }));
    }

    const selectedMonthDayjs = dayjs(monthValue || selectedMonth);
    const selectedWeekNum = weekValue !== undefined ? weekValue : selectedWeek;
    let start, end;

    if (view === "week") {
      // For weekly, calculate the specific week based on selected month and week number
      const firstDayOfMonth = selectedMonthDayjs.startOf("month");
      const firstWeekStart = firstDayOfMonth.startOf("week");
      
      // Calculate the start and end of the selected week (Week 1-4)
      start = firstWeekStart.add((selectedWeekNum - 1) * 7, "day");
      end = start.endOf("week");
    } else {
      // For monthly, use the selected month
      start = selectedMonthDayjs.startOf("month");
      end = selectedMonthDayjs.endOf("month");
    }

    return Object.entries(data)
      .map(([label, info]) => {
        // Filter the approved_at dates (ignore null values)
        const filteredDates = (info.approved_at || []).filter((date) => {
          if (!date) return false; // skip nulls
          const d = dayjs(date);
          return d.isSameOrAfter(start) && d.isSameOrBefore(end);
        });

        return {
          label,
          count: filteredDates.length, // Use filtered count instead of total count
          approved_at: filteredDates,
        };
      })
      .filter((item) => item.approved_at.length > 0); // Only return items with filtered dates
  };

  // Format labels for display
  const formatLabel = (label) =>
    label
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // Whenever the view, selectedMonth, selectedWeek, or data changes, filter the data
  useEffect(() => {
    const filteredOB = filterDataByDate(employeeCountsOfficialBusiness, view, selectedMonth, selectedWeek);
    const filteredTO = filterDataByDate(employeeCountsTravelOrder, view, selectedMonth, selectedWeek);
    const filteredPS = filterDataByDate(employeeCountsPassSlip, view, selectedMonth, selectedWeek);

    setFilteredData({
      officialBusiness: filteredOB,
      travelOrder: filteredTO,
      passSlip: filteredPS,
    });
  }, [
    view,
    selectedMonth,
    selectedWeek,
    employeeCountsOfficialBusiness,
    employeeCountsTravelOrder,
    employeeCountsPassSlip,
  ]);

  const sections = [
    {
      title: "Travel Order Request",
      data: filteredData.travelOrder,
      color: "#4caf50",
      key: "TO",
    },
    {
      title: "Official Business Request",
      data: filteredData.officialBusiness,
      color: "#00bcd4",
      key: "OB",
    },
    {
      title: "Pass Slip Request",
      data: filteredData.passSlip,
      color: "#ff9800",
      key: "PS",
    },
  ];

  const handleDownloadImage = (id, sectionTitle) => {
    const wrapperElement = document.getElementById(id);
    if (wrapperElement) {
      html2canvas(wrapperElement).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${sectionTitle.replace(
          /\s+/g,
          "_"
        )}_chart_and_top3.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <Box sx={{ padding: { xs: 2, sm: 4 } }}>
      <Box 
        display="flex" 
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="center" 
        alignItems="center"
        gap={2}
        mb={3}
        flexWrap="wrap"
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(e, newView) => {
            setView(newView);
            // Reset to current month and week 1 when changing view
            if (newView) {
              setSelectedMonth(dayjs().format("YYYY-MM"));
              setSelectedWeek(1);
            }
          }}
          aria-label="View toggle"
        >
          <ToggleButton value="week" color="primary">
            Weekly
          </ToggleButton>
          <ToggleButton value="month" color="primary">
            Monthly
          </ToggleButton>
        </ToggleButtonGroup>
        
        {view && (
          <>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: { xs: "100%", sm: "200px" },
                maxWidth: { xs: "100%", sm: "250px" }
              }}
            >
              <InputLabel id="month-select-label">Select Month</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                label="Select Month"
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  // Reset to week 1 when month changes
                  setSelectedWeek(1);
                }}
              >
                {generateMonthOptions().map((month) => (
                  <MenuItem key={month.value} value={month.value}>
                    {month.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {view === "week" && (
              <FormControl 
                size="small" 
                sx={{ 
                  minWidth: { xs: "100%", sm: "180px" },
                  maxWidth: { xs: "100%", sm: "200px" }
                }}
              >
                <InputLabel id="week-select-label">Select Week</InputLabel>
                <Select
                  labelId="week-select-label"
                  id="week-select"
                  value={selectedWeek}
                  label="Select Week"
                  onChange={(e) => setSelectedWeek(e.target.value)}
                >
                  {generateWeekOptions().map((week) => (
                    <MenuItem key={week.value} value={week.value}>
                      {week.label} ({week.startDate} - {week.endDate})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </>
        )}
      </Box>

      {sections.map((section, index) => {
        const top3 = [...section.data]
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        return (
          <Card key={index} sx={{ mb: 4, p: 3 }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  {section.title}
                </Typography>
                <Tooltip title="Download Graph">
                  <IconButton
                    onClick={() =>
                      handleDownloadImage(
                        `chart-container-${index}`,
                        section.title
                      )
                    }
                  >
                    <CameraAltOutlined />
                  </IconButton>
                </Tooltip>
              </Box>

              <Box
                id={`chart-container-${index}`}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 2, sm: 3 },
                  backgroundColor: "white",
                  p: { xs: 1, sm: 2 },
                  borderRadius: 2,
                  width: "100%",
                  maxWidth: "100%",
                  overflow: "hidden",
                }}
              >
                <Box
                  id={`chart-${index}`}
                  sx={{
                    overflowX: "auto",
                    flex: 1,
                    minWidth: 0,
                    width: "100%",
                    "& .MuiChartsAxis-tick": {
                      fontSize: { xs: "10px", sm: "12px" },
                    },
                  }}
                >
                  <BarChart
                    xAxis={[
                      {
                        scaleType: "band",
                        data: section.data.map((item) =>
                          window.innerWidth < 600
                            ? item.label.split(" ")[0].substring(0, 8) +
                              (item.label.split(" ")[0].length > 8 ? "..." : "")
                            : item.label.split(" ")[0]
                        ),
                        tickLabelStyle: {
                          fontSize: window.innerWidth < 600 ? 10 : 12,
                          textAnchor: "start",
                        },
                        tickLabelAngle: window.innerWidth < 600 ? -45 : -30,
                      },
                    ]}
                    series={[
                      {
                        data: section.data.map((item) => item.count),
                        color: section.color,
                        valueFormatter: (_, context) => {
                          const item = section.data?.[context?.index];
                          return item ? `${item.label}: ${item.count}` : "";
                        },
                      },
                    ]}
                    margin={{
                      bottom: window.innerWidth < 600 ? 70 : 80,
                      left: window.innerWidth < 600 ? 40 : 50,
                      right: window.innerWidth < 600 ? 20 : 30,
                      top: window.innerWidth < 600 ? 20 : 30,
                    }}
                    width={Math.max(
                      section.data.length * (window.innerWidth < 600 ? 60 : 90),
                      window.innerWidth < 600
                        ? Math.min(350, window.innerWidth - 40)
                        : window.innerWidth < 900
                        ? 500
                        : 800
                    )}
                    height={
                      window.innerWidth < 600
                        ? 250
                        : window.innerWidth < 900
                        ? 300
                        : 400
                    }
                  />
                </Box>

                <Box
                  sx={{
                    width: { xs: "100%", md: 250 },
                    mt: { xs: 2, md: 0 },
                    minWidth: { xs: "100%", md: 200 },
                    maxWidth: { xs: "100%", md: 300 },
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    mb={1}
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.1rem" },
                      textAlign: { xs: "center", md: "left" },
                    }}
                  >
                    Top 3 Employees
                  </Typography>
                  {top3.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{
                        textAlign: { xs: "center", md: "left" },
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      No data
                    </Typography>
                  ) : (
                    top3.map((item, i) => (
                      <Box
                        key={i}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          background: "#f5f5f5",
                          p: { xs: 0.8, sm: 1 },
                          mb: { xs: 0.8, sm: 1 },
                          borderRadius: "8px",
                          flexDirection: { xs: "column", sm: "row" },
                          gap: { xs: 0.5, sm: 0 },
                          textAlign: { xs: "center", sm: "left" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            wordBreak: "break-word",
                            flex: 1,
                          }}
                        >
                          {window.innerWidth < 600 && item.label.length > 20
                            ? item.label.substring(0, 20) + "..."
                            : item.label}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          sx={{
                            fontSize: { xs: "0.8rem", sm: "0.875rem" },
                            backgroundColor: {
                              xs: section.color,
                              sm: "transparent",
                            },
                            color: { xs: "white", sm: "inherit" },
                            px: { xs: 1, sm: 0 },
                            py: { xs: 0.3, sm: 0 },
                            borderRadius: { xs: 1, sm: 0 },
                            minWidth: { xs: "auto", sm: "30px" },
                            textAlign: "center",
                          }}
                        >
                          {item.count}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}
//User Profile
export function UserProfile({
  users = [],
  setUsers,
  refreshHistoryLogs, // This is now handleGetHistory from parent
  setLoading,
}) {
  // Map API users to local person format on load/update
  const [people, setPeople] = useState([
    { id: null, name: "", signature: null, password: "", user_role: "" },
  ]);
  const [formErrors, setFormErrors] = React.useState({});
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const pageCount = Math.ceil(users.length / rowsPerPage);
  const pagedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addPersonModalOpen, setAddPersonModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({
    name: "",
    signature: null,
    password: "",
    user_role: "",
  });

  const handleAddUser = async () => {
    try {
      setFormErrors({});
      setLoading(true);

      // Validate fields
      if (!newUser.name || !newUser.user_role || !newUser.password) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please fill in all fields.",
        });
        return;
      }

      const payload = {
        username: newUser.name,
        user_role: newUser.user_role,
        password: newUser.password,
        password_confirmation: newUser.password,
      };

      console.log("Submitting new user...", payload);
      const response = await StoreUser(payload);

      if (response?.success) {
        console.log("User created successfully", response.data);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "User added successfully!",
        });

        // Update users list
        setUsers((prevUsers) => [
          ...prevUsers,
          {
            id: response.data?.id,
            username: newUser.name,
            user_role: newUser.user_role,
          },
        ]);

        // Reset form
        setAddPersonModalOpen(false);
        setNewUser({ name: "", user_role: "", password: "" });

        // Enhanced history refresh with error handling
        if (typeof refreshHistoryLogs === "function") {
          try {
            console.log("Attempting to refresh history logs...");
            await refreshHistoryLogs();
            console.log("History logs refreshed successfully");
          } catch (refreshError) {
            console.error("History refresh failed:", refreshError);
            Swal.fire({
              icon: "info",
              title: "User Added",
              text: "User was created but history log refresh failed",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        } else {
          console.warn("refreshHistoryLogs is not a function");
        }
      } else if (response?.errors) {
        console.log("Validation errors", response.errors);
        setFormErrors(response.errors);
      }
    } catch (error) {
      console.error("Error adding user:", {
        error: error.message,
        response: error.response?.data,
      });
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "Failed to add user. Please try again.",
      });
    } finally {
      setLoading(false);
      console.log("Add user operation completed");
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [newUser, setNewUser] = useState({
    name: "",
    user_role: "",
    password: "",
  });

  const handleSignatureUpload = (event, isNewPerson = false) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      /*************  ✨ Windsurf Command ⭐  *************/
      // Once the file has been read, update the signature of either the new person or
      // the selected person, depending on the value of `isNewPerson`.
      /*******  0868414d-2483-418a-a755-103066e2d35e  *******/
      reader.onloadend = () => {
        if (isNewPerson) {
          setNewPerson((prev) => ({ ...prev, signature: reader.result }));
        } else {
          setSelectedPerson((prev) => ({ ...prev, signature: reader.result }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPerson = () => {
    if (newPerson.name && newPerson.password) {
      setPeople((prev) => [...prev, newPerson]);
      setNewPerson({ name: "", signature: null, password: "", user_role: "" });
      setAddPersonModalOpen(false);
      Swal.fire({
        title: "Successfully Added!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      setAddPersonModalOpen(false);
      Swal.fire({
        title: "Please fill in the required fields!",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setAddPersonModalOpen(true);
      });
    }
  };

  // Define this outside your component
  function mapUsersToPeople(users) {
    if (!Array.isArray(users) || users.length === 0) return [];
    return users.map((u) => ({
      id: u.id,
      name: u.username,
      user_role: u.user_role || "",
      signature: null,
      password: "",
    }));
  }

  // Sync people when users change
  useEffect(() => {
    const mapped = mapUsersToPeople(users);
    setPeople(mapped);
  }, [users]);

  // Handle updating user info
  const handleSubmitUpdate = async () => {
    setModalOpen(false);

    const result = await Swal.fire({
      title: "Are you sure you want to continue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      if (!selectedPerson?.id) {
        return Swal.fire({
          title: "Error",
          text: "User ID is missing. Cannot update user.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      const response = await UpdateUser(selectedPerson);

      if (response.success) {
        // Update users state immutably to reflect change immediately
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === selectedPerson.id
              ? {
                  ...user,
                  username: selectedPerson.username,
                  user_role: selectedPerson.user_role,
                }
              : user
          )
        );

        // ✅ Refetch history logs after successful update
        if (typeof refreshHistoryLogs === "function") {
          await refreshHistoryLogs();
        }

        setModalOpen(false);

        Swal.fire({
          title: response.message || "Changes successfully updated!",
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Update failed",
          text: response.message || "There was an error updating the user.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeletePerson = async (person) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${person.username}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await SoftDeleteUser(person.id);

      if (response.success) {
        // Immutably remove the deleted user from the users list state
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.id !== person.id)
        );

        Swal.fire({
          title: "Deleted!",
          text: `${person.username} has been deleted.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || "Failed to delete user.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };
  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= pageCount) return;
    setPage(newPage);
  };
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        maxHeight: 800,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: "100%",
          margin: "auto",
          px: 5, // horizontal padding to avoid edge-to-edge
          py: 3,
          borderRadius: 2,
          minHeight: "50vh",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 2, sm: 0 },
            mb: { xs: 2, sm: 3 },
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
              textAlign: { xs: "center", sm: "left" },
              order: { xs: 1, sm: 1 },
            }}
          >
            User Profile
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setAddPersonModalOpen(true)}
            sx={{
              alignSelf: { xs: "center", sm: "flex-end" },
              order: { xs: 2, sm: 2 },
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              px: { xs: 2, sm: 3 },
              py: { xs: 1, sm: 1.5 },
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: "300px", sm: "none" },
              textTransform: "none",
              whiteSpace: "nowrap",
            }}
          >
            Add New Authorized Person
          </Button>
        </Box>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 400, borderRadius: "12px" }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  No.
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  Username
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  User Role
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem", pl: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedUsers.map((user, index) => (
                <TableRow key={user.id} hover>
                  <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      px: 1,
                      py: 0.5,
                      fontSize: "0.875rem",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setSelectedPerson(user);
                      setModalOpen(true);
                    }}
                  >
                    {user.username}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                    {user.user_role}
                  </TableCell>
                  <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          minWidth: "60px",
                          height: "28px",
                        }}
                        onClick={() => {
                          setSelectedPerson(user);
                          setModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{
                          padding: "4px 8px",
                          fontSize: "0.7rem",
                          minWidth: "60px",
                          height: "28px",
                        }}
                        onClick={() => {
                          handleDeletePerson(user);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Edit Person Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <CloseIcon
              sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }}
              onClick={() => setModalOpen(false)}
            />
            <Typography variant="h5" mb={3}>
              Edit Profile
            </Typography>
            <TextField
              label="Full Name"
              value={selectedPerson?.username || ""}
              onChange={(e) =>
                setSelectedPerson((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="User Role"
              value={selectedPerson?.user_role || ""}
              onChange={(e) =>
                setSelectedPerson((prev) => ({
                  ...prev,
                  user_role: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="guard">Guard</MenuItem>
              <MenuItem value="evaluator">Evaluator</MenuItem>
            </TextField>

            {/* <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Upload E-Signature
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleSignatureUpload(e)}
            />
          </Button> */}
            {selectedPerson?.signature && (
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="body1">Signature Preview:</Typography>
                <Avatar
                  variant="square"
                  src={selectedPerson.signature}
                  sx={{ width: 200, height: 100, margin: "auto" }}
                />
              </Box>
            )}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={selectedPerson?.password || ""}
              onChange={(e) =>
                setSelectedPerson((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword((prev) => !prev)}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitUpdate}
              fullWidth
            >
              Apply Changes
            </Button>
          </Box>
        </Modal>

        {/* Add Person Modal */}
        <Modal
          open={addPersonModalOpen}
          onClose={() => setAddPersonModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "85%", md: 500 },
              maxWidth: "500px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              maxHeight: { xs: "95vh", sm: "90vh" },
              overflowY: "auto",
            }}
          >
            <CloseIcon
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 8 },
                right: { xs: 8, sm: 8 },
                cursor: "pointer",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
              onClick={() => setAddPersonModalOpen(false)}
            />

            <Typography
              variant="h5"
              sx={{
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                pr: { xs: 4, sm: 5 },
              }}
            >
              Add New Authorized User
            </Typography>

            <TextField
              label="Full Name"
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              value={newUser.name}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, name: e.target.value }))
              }
              error={Boolean(formErrors.username)}
              helperText={
                formErrors.username ? formErrors.username.join(" ") : ""
              }
              size="small"
            />

            <FormControl
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              error={Boolean(formErrors.user_role)}
            >
              <InputLabel id="user-role-label" size="small">
                User Role
              </InputLabel>
              <Select
                labelId="user-role-label"
                value={newUser.user_role}
                label="User Role"
                size="small"
                onChange={(e) =>
                  setNewUser((prev) => ({ ...prev, user_role: e.target.value }))
                }
              >
                <MenuItem value="" disabled>
                  Select a user role
                </MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="evaluator">Evaluator</MenuItem>
                <MenuItem value="guard">Guard</MenuItem>
              </Select>
              {formErrors.user_role && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{
                    display: "block",
                    mt: 0.5,
                    fontSize: { xs: "0.7rem", sm: "0.75rem" },
                  }}
                >
                  {formErrors.user_role.join(" ")}
                </Typography>
              )}
            </FormControl>

            <TextField
              label="Password"
              type="password"
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              value={newUser.password}
              onChange={(e) =>
                setNewUser((prev) => ({ ...prev, password: e.target.value }))
              }
              error={Boolean(formErrors.password)}
              helperText={
                formErrors.password ? formErrors.password.join(" ") : ""
              }
              size="small"
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              fullWidth
              sx={{
                mt: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Add User
            </Button>
          </Box>
        </Modal>
      </Box>
      {/* Pagination */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          px: 2,
          py: 1.5,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          borderRadius: "0 0 12px 12px",
        }}
      >
        {/* Left aligned text - now with proper spacing */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexShrink: 0,
            mr: 2, // Add right margin for better spacing
            whiteSpace: "nowrap", // Prevent text wrapping
          }}
        >
          Showing {page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, users.length)} of {users.length}
        </Typography>

        {/* Right aligned pagination - with improved spacing */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto", // Ensures it stays right-aligned
          }}
        >
          <IconButton
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": { opacity: 0.5 },
              "&:hover": { backgroundColor: "action.hover" }, // Add hover effect
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          {/* Page numbers - now with responsive behavior */}
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "auto", // Allows horizontal scrolling if many pages
              scrollbarWidth: "none", // Hide scrollbar
              "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Webkit
              "& .MuiButton-root": {
                minWidth: "32px",
                height: "32px",
                borderRadius: "6px",
                padding: 0,
              },
            }}
          >
            {[...Array(pageCount).keys()].map((pageNum) => (
              <Button
                key={pageNum}
                variant={page === pageNum ? "contained" : "text"}
                size="small"
                onClick={() => handleChangePage(pageNum)}
                sx={{
                  fontWeight: page === pageNum ? 600 : 400,
                  backgroundColor:
                    page === pageNum ? "primary.main" : "transparent",
                  color:
                    page === pageNum ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      page === pageNum ? "primary.dark" : "action.hover",
                  },
                }}
              >
                {pageNum + 1}
              </Button>
            ))}
          </Box>

          <IconButton
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= pageCount - 1}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": { opacity: 0.5 },
              "&:hover": { backgroundColor: "action.hover" }, // Add hover effect
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </TableContainer>
  );
}
//Manage Head Component
export function ManageHead({ setLoading, refreshHistoryLogs, refetch }) {
  // Static sample data for Head positions
  const [headPositions, setHeadPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 👈 Add loading state
  const hostname = window.location.hostname;
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger hidden file input
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedHead((prev) => ({
        ...prev,
        profileImageFile: file, // store it like signatureFile
      }));
    }
  };
  const API_BASE_URL =
    hostname === "localhost" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
      ? `http://${hostname}:8000/api` // Development or LAN
      : `https://api.dolexcdo.online/api`; // Production

  const [previewImage, setPreviewImage] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleGetHeadPosition = async () => {
    setIsLoading(true); // 👈 Start loading
    const result = await FetchHeadPositions();

    if (result.success) {
      setHeadPositions(result.data);
    } else {
      console.error("⚠️ Failed to fetch head positions:", result.message);
    }

    setIsLoading(false); // 👈 Stop loading
  };

  // Automatically call it on component mount
  useEffect(() => {
    handleGetHeadPosition();
  }, []);

  const [formErrors, setFormErrors] = React.useState({});
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const pageCount = Math.ceil(headPositions.length / rowsPerPage);
  const pagedHeadPositions = headPositions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const dropzoneStyle = {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    marginBottom: "16px",
    fontSize: "13px",
    backgroundColor: "#f9f9f9",
  };
  const [selectedHead, setSelectedHead] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addHeadModalOpen, setAddHeadModalOpen] = useState(false);
  const [newHead, setNewHead] = useState({
    name: "",
    position: "",
    office: "",
    email: "",
    phone: "",
    dateAppointed: "",
    profile_image: null,
    signature: null,
  });

  const handleDrop = (acceptedFiles, field) => {
    const file = acceptedFiles[0];
    const previewUrl = URL.createObjectURL(file);

    if (field === "profile_image") {
      setNewHead((prev) => ({
        ...prev,
        profile_image: file,
        profilePreview: previewUrl,
      }));
    } else if (field === "signature") {
      setNewHead((prev) => ({
        ...prev,
        signature: file,
        signaturePreview: previewUrl,
      }));
    }
  };

  const { getRootProps: getProfileProps, getInputProps: getProfileInputProps } =
    useDropzone({
      onDrop: (files) => handleDrop(files, "profile_image"),
      accept: { "image/*": [] },
    });

  const {
    getRootProps: getSignatureProps,
    getInputProps: getSignatureInputProps,
  } = useDropzone({
    onDrop: (files) => handleDrop(files, "signature"),
    accept: { "image/*": [] },
  });
  const handleAddHead = async () => {
    try {
      setFormErrors({});
      setLoading(true);

      const {
        name,
        position,
        office,
        email,
        phone,
        dateAppointed,
        profile_image,
        signature,
      } = newHead;

      // ✅ Validate required fields
      if (!name || !position || !email) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please fill in all required fields.",
        });
        setLoading(false);
        return;
      }

      // ✅ Optional: validate position is one of allowed
      const allowedPositions = [
        "OIC",
        "DolexCDO Chief",
        "Regional Director",
        "Assistant Regional Director",
        "OIC_Chief",
      ];

      if (!allowedPositions.includes(position)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Position",
          text: `"${position}" is not a recognized position.`,
        });
        setLoading(false);
        return;
      }

      const payload = new FormData();
      payload.append("name", name);
      payload.append("position", position);
      payload.append("office", office);
      payload.append("email", email);
      payload.append("phone", phone || "");
      payload.append(
        "dateAppointed",
        dateAppointed || new Date().toISOString().split("T")[0]
      );
      payload.append("status", "Active");

      if (profile_image) {
        payload.append("profile_image", profile_image);
      }

      if (signature) {
        payload.append("signature", signature);
      }

      const response = await StoreHeadPosition(payload);

      if (response?.data) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Head position added successfully!",
        });

        setAddHeadModalOpen(false);
        setNewHead({
          name: "",
          position: "",
          office: "",
          email: "",
          phone: "",
          dateAppointed: null,
          profile_image: null,
          signature: null,
          profilePreview: "",
          signaturePreview: "",
          status: "Active",
        });

        if (typeof handleGetHeadPosition === "function") {
          await handleGetHeadPosition();
        }

        if (typeof refreshHistoryLogs === "function") {
          try {
            await refreshHistoryLogs();
          } catch (err) {
            console.warn("History log refresh failed", err);
          }
        }
      } else if (response?.errors) {
        setFormErrors(response.errors);
      } else {
        throw new Error(response?.message || "Unknown error occurred");
      }
    } catch (error) {
      console.error("Error adding head position:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to add head position. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle updating head position info

  const handleSubmitUpdate = async () => {
    setModalOpen(false);

    const result = await Swal.fire({
      title: "Are you sure you want to continue?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return Swal.fire({
        title: "Cancelled",
        icon: "info",
        confirmButtonText: "OK",
      });
    }

    if (!selectedHead?.id) {
      return Swal.fire({
        title: "Error",
        text: "Head position ID is missing. Cannot update.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    try {
      const formData = new FormData();

      // ✅ Validate if the position is one of the allowed values (optional)
      const allowedPositions = [
        "OIC",
        "DolexCDO Chief",
        "Regional Director",
        "Assistant Regional Director",
        "OIC_Chief",
      ];

      if (!allowedPositions.includes(selectedHead.position)) {
        return Swal.fire({
          title: "Invalid Position",
          text: `The selected position "${selectedHead.position}" is not allowed.`,
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      formData.append("name", selectedHead.name || "");
      formData.append("position", selectedHead.position || "");
      formData.append("department", selectedHead.department || "");
      formData.append("email", selectedHead.email || "");
      formData.append("phone", selectedHead.phone || "");
      formData.append("dateAppointed", selectedHead.dateAppointed || "");
      formData.append("is_active", selectedHead.is_active?.toString() || "1");

      if (selectedHead.signatureFile) {
        formData.append("signature", selectedHead.signatureFile);
      }

      if (selectedHead.profileImageFile) {
        formData.append("profile_image", selectedHead.profileImageFile);
      }

      const response = await UpdateHeadPosition(selectedHead.id, formData);

      if (!response.success) {
        return Swal.fire({
          title: "Error",
          text: response.message || "Failed to update head position",
          icon: "error",
          confirmButtonText: "OK",
        });
      }

      setHeadPositions((prevHeads) =>
        prevHeads.map((head) =>
          head.id === selectedHead.id
            ? {
                ...selectedHead,
                signature: response.data?.signature || selectedHead.signature,
                profile_image:
                  response.data?.profile_image || selectedHead.profile_image,
                signatureFile: null,
                profileImageFile: null,
              }
            : head
        )
      );

      setSelectedHead((prev) => ({
        ...prev,
        signatureFile: null,
        profileImageFile: null,
      }));

      Swal.fire({
        title: "Changes successfully updated!",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire({
        title: "Unexpected Error",
        text: "Something went wrong while updating.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleDeleteHead = async (head) => {
    const result = await Swal.fire({
      title: `Are you sure you want to remove ${head.name} from ${head.position}?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteHeadPosition(head.id);

        if (response.success) {
          // ✅ Remove from UI after successful deletion
          setHeadPositions((prevHeads) =>
            prevHeads.filter((h) => h.id !== head.id)
          );

          Swal.fire({
            title: "Removed!",
            text: `${head.name} has been removed from ${head.position}.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        } else {
          Swal.fire({
            title: "Error",
            text: response.message || "Failed to delete head position.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the head position.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } else {
      Swal.fire({
        title: "Cancelled",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const handleChangePage = (newPage) => {
    if (newPage < 0 || newPage >= pageCount) return;
    setPage(newPage);
  };

  const getStatusChip = (status) => {
    const color = status === "Active" ? "success" : "default";
    return (
      <Chip
        label={status}
        color={color}
        size="small"
        sx={{ fontSize: "0.75rem" }}
      />
    );
  };

  const handleToggleStatus = async (headId, isActive) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${
        isActive ? "activate" : "deactivate"
      } this head position.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const result = await updateHeadStatus(headId, isActive);
      if (result.success) {
        setHeadPositions((prev) =>
          prev.map((head) =>
            head.id === headId ? { ...head, is_active: isActive ? 1 : 0 } : head
          )
        );

        Swal.fire(
          "Updated!",
          "Head position status has been updated.",
          "success"
        );

        // ✅ Call refetch if defined
        if (typeof refetch === "function") await refetch();
      } else {
        console.error("❌ Failed to update status:", result.message);
        Swal.fire("Error!", result.message || "Failed to update.", "error");
      }
    }
  };

  const handleToggleOfficerInCharge = async (headId, isOfficerInCharge) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${
        isOfficerInCharge ? "enable" : "disable"
      } Officer-in-Charge.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const result = await updateHeadStatus(headId, isOfficerInCharge);
      if (result.success) {
        setHeadPositions((prev) =>
          prev.map((head) =>
            head.id === headId
              ? { ...head, is_officer_in_charge: isOfficerInCharge ? 1 : 0 }
              : head
          )
        );
        Swal.fire(
          "Updated!",
          "Officer-in-Charge status has been updated.",
          "success"
        );
        if (typeof refetch === "function") {
          await refetch(); // ✅ refetch is in scope
        }
      } else {
        console.error("❌ Failed to update officer-in-charge:", result.message);
        Swal.fire("Error!", result.message || "Failed to update.", "error");
      }
    }
  };

  const handleToggleDolexCDOChief = async (headId, isDolexCDOChief) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${
        isDolexCDOChief ? "enable" : "disable"
      } DOLEX-CDO Chief.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
    });

    if (confirm.isConfirmed) {
      const result = await updateHeadStatus(headId, isDolexCDOChief);
      if (result.success) {
        setHeadPositions((prev) =>
          prev.map((head) =>
            head.id === headId
              ? { ...head, is_dolex_cdo_chief: isDolexCDOChief ? 1 : 0 }
              : head
          )
        );
        Swal.fire(
          "Updated!",
          "DOLEX-CDO Chief status has been updated.",
          "success"
        );

        if (typeof refetch === "function") {
          await refetch(); // ✅ refetch is in scope
        }
      } else {
        console.error("❌ Failed to update DolexCDO Chief:", result.message);
        Swal.fire("Error!", result.message || "Failed to update.", "error");
      }
    }
  };
  return (
    <TableContainer
      component={Paper}
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        p: 2,
        maxHeight: 800,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          width: "100%",
          maxWidth: "100%",
          margin: "auto",
          px: 5,
          py: 3,
          borderRadius: 2,
          minHeight: "50vh",
          overflow: "auto",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: {
              xs: "1.2rem", // phones
              sm: "1.5rem", // tablets
              md: "2rem", // small desktops
              lg: "2.5rem", // large screens
            },
            textAlign: {
              xs: "center",
              sm: "left",
            },
          }}
        >
          DOLEX CDO - Head Positions Management
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddHeadModalOpen(true)}
          sx={{ alignSelf: "flex-end" }}
        >
          Add New Head Position
        </Button>

        <TableContainer
          component={Paper}
          sx={{ maxHeight: 400, borderRadius: "12px" }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  No.
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  Name
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  Position
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  Signature
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  Officer-in-Charge
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                  DolexCDO Chief
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem", pl: 3 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      Loading head positions...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : pagedHeadPositions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No head positions found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pagedHeadPositions.map((head, index) => {
                  const isRegionalDirector =
                    head.position === "Regional Director";

                  return (
                    <TableRow key={head.id} hover>
                      <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                        {page * rowsPerPage + index + 1}
                      </TableCell>

                      <TableCell
                        sx={{
                          px: 1,
                          py: 0.5,
                          fontSize: "0.875rem",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                        onClick={() => {
                          setSelectedHead(head);
                          setModalOpen(true);
                        }}
                      >
                        {head.name}
                      </TableCell>

                      <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "primary.main" }}
                        >
                          {head.position}
                        </Typography>
                      </TableCell>

                      {/* Signature */}
                      <TableCell sx={{ px: 1, py: 0.5 }}>
                        {head.signature ? (
                          <Box
                            component="img"
                            src={`${API_BASE_URL.replace("/api", "")}/${
                              head.signature
                            }`}
                            alt="Signature"
                            onClick={() => {
                              setPreviewImage(
                                `${API_BASE_URL.replace("/api", "")}/${
                                  head.signature
                                }`
                              );
                              setIsPreviewOpen(true);
                            }}
                            onError={(e) => {
                              const fallback =
                                "/images/signatures/esignotfound.jpg";
                              if (!e.target.src.includes(fallback)) {
                                e.target.onerror = null;
                                e.target.src = fallback;
                              }
                            }}
                            sx={{
                              height: 40,
                              cursor: "pointer",
                              objectFit: "contain",
                              borderRadius: 1,
                              border: "1px solid #ddd",
                            }}
                          />
                        ) : (
                          <Typography variant="caption" color="textSecondary">
                            No signature
                          </Typography>
                        )}
                      </TableCell>

                      {/* OIC Toggle */}
                      <TableCell sx={{ px: 1, py: 0.5 }}>
                        <Switch
                          checked={
                            head.position === "OIC"
                              ? head.is_active === 1
                              : head.is_officer_in_charge === 1
                          }
                          onChange={(e) => {
                            if (head.position === "OIC") {
                              handleToggleStatus(head.id, e.target.checked);
                            } else {
                              handleToggleOfficerInCharge(
                                head.id,
                                e.target.checked
                              );
                            }
                          }}
                          size="small"
                          color="primary"
                          disabled={
                            isRegionalDirector ||
                            head.position === "DolexCDO Chief"
                          }
                        />
                      </TableCell>

                      {/* Chief Toggle */}
                      <TableCell sx={{ px: 1, py: 0.5 }}>
                        <Switch
                          checked={
                            head.position === "DolexCDO Chief"
                              ? head.is_active === 1
                              : head.is_dolex_cdo_chief === 1
                          }
                          onChange={(e) => {
                            if (head.position === "DolexCDO Chief") {
                              handleToggleStatus(head.id, e.target.checked);
                            } else {
                              handleToggleDolexCDOChief(
                                head.id,
                                e.target.checked
                              );
                            }
                          }}
                          size="small"
                          color="primary"
                          disabled={
                            isRegionalDirector || head.position === "OIC"
                          }
                        />
                      </TableCell>

                      {/* TH Cell for Regional Director */}
                      <TableCell sx={{ px: 1, py: 0.5 }}>
                        {isRegionalDirector ? (
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: "bold",
                              fontSize: "0.75rem",
                              color: "secondary.main",
                            }}
                          >
                            Regional Director
                          </Typography>
                        ) : (
                          "-"
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell sx={{ px: 1, py: 0.5, fontSize: "0.875rem" }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              minWidth: "60px",
                              height: "28px",
                            }}
                            onClick={() => {
                              setSelectedHead(head);
                              setModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{
                              padding: "4px 8px",
                              fontSize: "0.7rem",
                              minWidth: "60px",
                              height: "28px",
                            }}
                            onClick={() => handleDeleteHead(head)}
                          >
                            Remove
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Signature Preview
            <IconButton
              aria-label="close"
              onClick={() => setIsPreviewOpen(false)}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers>
            {previewImage && (
              <img
                src={previewImage}
                alt="Full Signature"
                style={{
                  width: "100%",
                  maxHeight: "500px",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/images/signatures/esignotfound.jpg"; // Local fallback
                }}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Head Position Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <CloseIcon
              sx={{ position: "absolute", top: 8, right: 8, cursor: "pointer" }}
              onClick={() => setModalOpen(false)}
            />
            <Typography variant="h5" mb={3}>
              Edit Head Position
            </Typography>
            {/* Profile Image */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mt: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  mt: 2,
                }}
              >
                <Typography variant="subtitle2">Profile Image</Typography>

                <Box
                  onClick={handleImageClick}
                  sx={{
                    position: "relative",
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #ccc",
                    cursor: "pointer",
                    "&:hover .overlay": {
                      opacity: 1,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={
                      selectedHead?.profileImageFile
                        ? URL.createObjectURL(selectedHead.profileImageFile)
                        : `${API_BASE_URL.replace(
                            "/api",
                            ""
                          )}/${selectedHead?.profile_image?.replace(
                            /^\/+/,
                            ""
                          )}`
                    }
                    alt="Profile"
                    onError={(e) => {
                      const fallback =
                        "/images/profile_images/default-profile.png";
                      if (!e.target.src.includes(fallback)) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  {/* Hover overlay text */}
                  <Box
                    className="overlay"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      bgcolor: "rgba(0,0,0,0.4)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      textAlign: "center",
                      px: 1,
                    }}
                  >
                    Click to update the Profile
                  </Box>
                </Box>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Box>
            </Box>
            <TextField
              label="Full Name"
              value={selectedHead?.name || ""}
              onChange={(e) =>
                setSelectedHead((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              fullWidth
              sx={{ mt: 2, mb: 2 }} // ✅ Add top margin (pt doesn't affect root element well here)
            />

            <TextField
              select
              label="Position"
              value={selectedHead?.position || ""}
              onChange={(e) =>
                setSelectedHead((prev) => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value="DolexCDO Chief">DOLEX CDO Head</MenuItem>
              <MenuItem value="Regional Director">Regional Director</MenuItem>
              <MenuItem value="Assistant Regional Director">
                Assistant Regional Director
              </MenuItem>
              <MenuItem value="OIC">Office In Charge</MenuItem>
              <MenuItem value="OIC_Chief">OIC, Chief</MenuItem>
            </TextField>

            <TextField
              label="Email"
              type="email"
              value={selectedHead?.email || ""}
              onChange={(e) =>
                setSelectedHead((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />

            <TextField
              label="Date Appointed"
              type="date"
              value={selectedHead?.dateAppointed || ""}
              onChange={(e) =>
                setSelectedHead((prev) => ({
                  ...prev,
                  dateAppointed: e.target.value,
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              select
              label="Status"
              value={selectedHead?.is_active ?? 1}
              onChange={(e) =>
                setSelectedHead((prev) => ({
                  ...prev,
                  is_active: Number(e.target.value),
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            >
              <MenuItem value={1}>Active</MenuItem>
              <MenuItem value={0}>Inactive</MenuItem>
            </TextField>

            {/* Current Signature Display */}
            {selectedHead ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  mt: 3,
                }}
              >
                {/* Signature Image */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle2">Current Signature</Typography>
                  <Box
                    component="img"
                    src={
                      selectedHead?.signature
                        ? `${API_BASE_URL.replace(
                            "/api",
                            ""
                          )}/${selectedHead.signature.replace(/^\/+/, "")}`
                        : "/images/signatures/esignotfound.jpg"
                    }
                    alt="Current Signature"
                    onError={(e) => {
                      const fallback = "/images/signatures/esignotfound.jpg";
                      if (!e.target.src.includes(fallback)) {
                        e.target.onerror = null;
                        e.target.src = fallback;
                      }
                    }}
                    sx={{
                      maxHeight: 80,
                      maxWidth: "100%",
                      objectFit: "contain",
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="textSecondary" align="center">
                No profile selected.
              </Typography>
            )}

            {/* New Signature Preview */}
            {selectedHead?.signatureFile && (
              <Box sx={{ mb: 2, textAlign: "center" }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  New Signature Preview
                </Typography>
                <Box
                  component="img"
                  src={URL.createObjectURL(selectedHead.signatureFile)}
                  alt="New Signature Preview"
                  sx={{
                    maxHeight: 80,
                    maxWidth: "100%",
                    objectFit: "contain",
                    border: "2px solid #1976d2",
                    borderRadius: 1,
                  }}
                />
              </Box>
            )}

            {/* Signature Upload Button */}
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2, mb: 2 }} // ✅ Added top margin
              startIcon={<CloudUploadIcon />}
            >
              {selectedHead?.signatureFile
                ? "Change Signature"
                : "Upload New Signature"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file size (e.g., max 5MB)
                    if (file.size > 5 * 1024 * 1024) {
                      alert("File size should be less than 5MB");
                      return;
                    }

                    // Validate file type
                    if (!file.type.startsWith("image/")) {
                      alert("Please select a valid image file");
                      return;
                    }

                    setSelectedHead((prev) => ({
                      ...prev,
                      signatureFile: file,
                    }));
                  }
                }}
              />
            </Button>

            {/* Remove signature option */}
            {selectedHead?.signatureFile && (
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  setSelectedHead((prev) => ({
                    ...prev,
                    signatureFile: null,
                  }));
                }}
                fullWidth
                sx={{ mb: 2 }}
              >
                Remove New Signature
              </Button>
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitUpdate}
              fullWidth
              disabled={!selectedHead}
            >
              Apply Changes
            </Button>
          </Box>
        </Modal>

        {/* Add Head Position Modal */}
        <Modal
          open={addHeadModalOpen}
          onClose={() => setAddHeadModalOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "95%", sm: "80%", md: 600 },
              maxWidth: "600px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 2,
              maxHeight: { xs: "95vh", sm: "90vh" },
              overflowY: "auto",
            }}
          >
            <CloseIcon
              sx={{
                position: "absolute",
                top: { xs: 8, sm: 8 },
                right: { xs: 8, sm: 8 },
                cursor: "pointer",
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
              onClick={() => setAddHeadModalOpen(false)}
            />

            <Typography
              variant="h5"
              sx={{
                mb: { xs: 2, sm: 3 },
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                pr: { xs: 4, sm: 5 },
              }}
            >
              Add New Head Position
            </Typography>

            <TextField
              label="Full Name"
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              value={newHead.name}
              onChange={(e) => setNewHead({ ...newHead, name: e.target.value })}
              size="small"
            />

            <FormControl fullWidth sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <InputLabel id="position-label" size="small">
                Position *
              </InputLabel>
              <Select
                labelId="position-label"
                value={newHead.position}
                label="Position *"
                size="small"
                onChange={(e) =>
                  setNewHead({ ...newHead, position: e.target.value })
                }
              >
                <MenuItem value="" disabled>
                  Select a position
                </MenuItem>
                <MenuItem value="DolexCDO Chief">DOLEX CDO Head</MenuItem>
                <MenuItem value="Regional Director">Regional Director</MenuItem>
                <MenuItem value="Assistant Regional Director">
                  Assistant Regional Director
                </MenuItem>
                <MenuItem value="OIC">Office In Charge</MenuItem>
                <MenuItem value="OIC_Chief">OIC, Chief</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Email"
              type="email"
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              value={newHead.email}
              onChange={(e) =>
                setNewHead({ ...newHead, email: e.target.value })
              }
              size="small"
            />

            <TextField
              label="Date Appointed"
              type="date"
              fullWidth
              sx={{ mb: { xs: 1.5, sm: 2 } }}
              value={newHead.dateAppointed}
              onChange={(e) =>
                setNewHead({ ...newHead, dateAppointed: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              size="small"
            />

            {/* Profile Image Upload */}
            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Profile Image
              </Typography>
              <div
                {...getProfileProps()}
                style={{
                  ...dropzoneStyle,
                  padding: window.innerWidth < 600 ? "12px" : "16px",
                  minHeight: window.innerWidth < 600 ? "80px" : "100px",
                }}
              >
                <input {...getProfileInputProps()} />
                {newHead.profilePreview ? (
                  <img
                    src={newHead.profilePreview}
                    alt="Profile Preview"
                    style={{
                      width: window.innerWidth < 600 ? 80 : 100,
                      height: window.innerWidth < 600 ? 80 : 100,
                      objectFit: "cover",
                      marginBottom: 8,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                    }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: window.innerWidth < 600 ? "0.8rem" : "1rem",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {window.innerWidth < 600
                      ? "Tap to select profile image"
                      : "Drag and drop profile image here, or click to select"}
                  </p>
                )}
              </div>
            </Box>

            {/* Signature Upload */}
            <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
              >
                Signature
              </Typography>
              <div
                {...getSignatureProps({
                  style: {
                    ...dropzoneStyle,
                    padding: window.innerWidth < 600 ? "12px" : "16px",
                    minHeight: window.innerWidth < 600 ? "60px" : "80px",
                  },
                })}
              >
                <input {...getSignatureInputProps()} />
                {newHead.signaturePreview ? (
                  <img
                    src={newHead.signaturePreview}
                    alt="Signature Preview"
                    style={{
                      width: window.innerWidth < 600 ? 80 : 100,
                      height: window.innerWidth < 600 ? 40 : 50,
                      objectFit: "contain",
                      marginBottom: 8,
                    }}
                  />
                ) : (
                  <p
                    style={{
                      fontSize: window.innerWidth < 600 ? "0.8rem" : "1rem",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    {window.innerWidth < 600
                      ? "Tap to select signature"
                      : "Drag and drop signature image here, or click to select"}
                  </p>
                )}
              </div>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt: { xs: 1.5, sm: 2 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
              onClick={handleAddHead}
            >
              Add Head Position
            </Button>
          </Box>
        </Modal>
      </Box>

      {/* Pagination */}
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
          px: 2,
          py: 1.5,
          backgroundColor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
          borderRadius: "0 0 12px 12px",
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            flexShrink: 0,
            mr: 2,
            whiteSpace: "nowrap",
          }}
        >
          Showing {page * rowsPerPage + 1}-
          {Math.min((page + 1) * rowsPerPage, headPositions.length)} of{" "}
          {headPositions.length}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ml: "auto",
          }}
        >
          <IconButton
            onClick={() => handleChangePage(page - 1)}
            disabled={page === 0}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": { opacity: 0.5 },
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              overflowX: "auto",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              "& .MuiButton-root": {
                minWidth: "32px",
                height: "32px",
                borderRadius: "6px",
                padding: 0,
              },
            }}
          >
            {[...Array(pageCount).keys()].map((pageNum) => (
              <Button
                key={pageNum}
                variant={page === pageNum ? "contained" : "text"}
                size="small"
                onClick={() => handleChangePage(pageNum)}
                sx={{
                  fontWeight: page === pageNum ? 600 : 400,
                  backgroundColor:
                    page === pageNum ? "primary.main" : "transparent",
                  color:
                    page === pageNum ? "primary.contrastText" : "text.primary",
                  "&:hover": {
                    backgroundColor:
                      page === pageNum ? "primary.dark" : "action.hover",
                  },
                }}
              >
                {pageNum + 1}
              </Button>
            ))}
          </Box>

          <IconButton
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= pageCount - 1}
            size="small"
            sx={{
              borderRadius: "6px",
              "&:disabled": { opacity: 0.5 },
              "&:hover": { backgroundColor: "action.hover" },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box> */}
    </TableContainer>
  );
}

export const TOSIGN = ({ data, onClose }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [pdfUri, setPdfUri] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [isSignatureLoaded, setIsSignatureLoaded] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const hostname = window.location.hostname;

  const API_BASE_URL =
    hostname === "localhost" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.")
      ? `http://${hostname}:8000/api` // Development or LAN
      : `https://api.dolexcdo.online/api`; // Production

  // Helper to load image as Base64
  const loadImageAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (err) => reject("❌ Failed to load image: " + err);
      img.src = url;
    });
  };

  // Load signature from travel_order
  useEffect(() => {
    const oicSignaturePath = data?.travel_order?.oic_signature;
    const chiefSignaturePath = data?.travel_order?.chief_signature;

    let selectedSignaturePath = null;

    if (oicSignaturePath) {
      selectedSignaturePath = oicSignaturePath;
      console.log("🖋️ Using OIC signature");
    } else if (chiefSignaturePath) {
      selectedSignaturePath = chiefSignaturePath;
    } else {
      console.log("❌ No signature path found");
      setSignatureDataUrl(null);
      setIsSignatureLoaded(true);
      return;
    }

    const signatureFilename = selectedSignaturePath.replace(
      "images/signatures/",
      ""
    );
    // Strip "/api" if present to access the correct static asset base path
    const basePath = API_BASE_URL.replace(/\/api\/?$/, "");

    const fullUrl = `${basePath}/cors-signature/${signatureFilename}`;

    loadImageAsBase64(fullUrl)
      .then((dataUrl) => {
        setSignatureDataUrl(dataUrl);
        setIsSignatureLoaded(true);
      })
      .catch((err) => {
        console.error("❌ Failed to load signature image:", err);
        setSignatureDataUrl(null);
        setIsSignatureLoaded(true);
      });
  }, [data, API_BASE_URL]);

  // Generate PDF only after signature is loaded (or determined to be unavailable)
  useEffect(() => {
    if (!data || !isSignatureLoaded) return;

    setIsGeneratingPdf(true);

    // Use setTimeout to allow the loading message to render
    setTimeout(() => {
      const pdf = generatePDF();
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      setPdfUri(url);
      setIsGeneratingPdf(false);
    }, 100);

    // Cleanup function to revoke object URL
    return () => {
      if (pdfUri) {
        URL.revokeObjectURL(pdfUri);
      }
    };
  }, [data, isSignatureLoaded]); // Remove signatureDataUrl from dependencies

  const handleClose = () => {
    if (pdfUri) {
      URL.revokeObjectURL(pdfUri);
    }
    onClose();
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    const signatureX = 133;
    const signatureY = 205;
    const signatureXFor = 120;
    const signatureYFor = 225;

    // Get head position data from travel_order
    const headPositionName = data?.travel_order?.chief_name || "N/A";
    const headPositionSignature = data?.travel_order?.oic_signature || "N/A";
    const regHeadName = data?.travel_order?.regional_head_name?.trim();
    const isOIC = !!data?.travel_order?.oic_signature;
    const oicLabel = "FOR:";

    if (isOIC) {
      pdf.setFontSize(10); // Set smaller font size
      pdf.text(oicLabel, signatureXFor, signatureYFor - 8); // Display label only for OIC
    }

    // Document border
    pdf.rect(10, 10, 190, 277);

    // Header - assuming logo is imported/defined elsewhere
    if (typeof logo !== "undefined") {
      pdf.addImage(logo, "PNG", 40, 15, 22, 20);
    }

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("Republic of the Philippines", 115, 20, { align: "center" });
    pdf.text("DEPARTMENT OF LABOR AND EMPLOYMENT", 115, 25, {
      align: "center",
    });
    pdf.text("Regional Office No. X", 115, 30, { align: "center" });
    pdf.text("NORTHERN MINDANAO", 115, 35, { align: "center" });

    // Travel Order ID
    const travelOrderId = data?.travel_order?.id || "___";
    const formattedId = travelOrderId.toString().padStart(3, "0");
    pdf.rect(138, 40, 50, 15);
    pdf.text(`TO No.: CDO-2025-${formattedId}`, 140, 45);
    pdf.text("Numbered by: _____", 140, 50);

    pdf.setFontSize(14);
    pdf.text("MEMORANDUM", 20, 70);
    const sampleName = {
      firstName: "JOFFREY",
      mi: "M",
      lastName: "SUYAO",
    };

    const regionalHeadName =
      data?.travel_order?.regional_head_name || "JOFFREY M. SUYAO";

    const rawDate = data?.travel_order?.date;
    const formattedDate = rawDate
      ? new Date(rawDate)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase()
      : "APRIL 7, 2025";

    const sampleRE =
      data?.travel_order?.re || "REQUEST FOR AUTHORITY TO TRAVEL";

    pdf.setFont("helvetica", "bold");

    // FOR section
    pdf.text(`FOR          :`, 20, 80);
    pdf.text(` ${regHeadName || "JOFFREY M. SUYAO"}`, 50, 80);

    // RE section
    pdf.text(`RE             :`, 20, 90);
    pdf.text(sampleRE, 50, 90);

    // DATE section
    pdf.text(`DATE        :`, 20, 100);
    pdf.text(formattedDate, 50, 100);

    // Divider Line
    pdf.line(20, 105, 190, 105);

    // Employee Names
    const names =
      data?.employees?.map(
        (emp) =>
          `${emp.first_name.toUpperCase()} ${emp.last_name.toUpperCase()}`
      ) || [];

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);

    const allNames = names.join(", ");
    const labelWidth = 30;
    const contentWidth = 150;
    let nameY = 115;

    // Add the label
    pdf.text("Name :", 20, nameY);

    // Wrap the names text
    const wrappedNames = pdf.splitTextToSize(allNames, contentWidth);

    // Print each wrapped line
    wrappedNames.forEach((line, index) => {
      pdf.text(line, 20 + labelWidth, nameY + index * 7);
    });

    // UPDATE nameY to account for the wrapped lines
    nameY += wrappedNames.length * 7 + 5;

    // Travel Dates
    const fromDate = data?.travel_order?.travel_from;
    const toDate = data?.travel_order?.travel_to;

    const formattedFrom = fromDate
      ? new Date(fromDate)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase()
      : "APRIL 10, 2025";

    const formattedTo = toDate
      ? new Date(toDate)
          .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase()
      : "APRIL 11, 2025";

    const dateRange = `${formattedFrom} - ${formattedTo}`;

    // DURATION OF TRAVEL
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.text("DURATION OF TRAVEL :", 20, nameY);

    pdf.setFont("helvetica", "bold");
    pdf.text(dateRange, 75, nameY);
    nameY += 10;

    // TRAVEL BY section
    const travelByLand = data?.travel_order?.travel_by_land === 1;
    const travelByWater = data?.travel_order?.travel_by_water === 1;
    const travelByAir = data?.travel_order?.travel_by_air === 1;

    pdf.setFont("helvetica", "normal");
    pdf.text("TRAVEL BY:  ", 20, nameY);

    pdf.setFont("helvetica", "bold");
    pdf.text(travelByAir ? "(X)AIR" : "( )AIR", 50, nameY);
    pdf.text(travelByLand ? "(X)LAND" : "( )LAND", 85, nameY);
    pdf.text(travelByWater ? "(X)WATER" : "( )WATER", 125, nameY);
    nameY += 10;

    // DESTINATION section
    const destination =
      data?.travel_order?.destination?.toUpperCase() || "BRGY NAZARETH, CDOC";

    pdf.setFont("helvetica", "normal");
    pdf.text("DESTINATION:", 20, nameY);

    pdf.setFont("helvetica", "bold");
    pdf.text(destination, 55, nameY);
    nameY += 10;

    // PURPOSE section
    const purpose =
      data?.travel_order?.purpose?.toUpperCase() ||
      "TO CONDUCT TUPAD VALIDATION AND CONTRACT SIGNING";

    pdf.setFont("helvetica", "normal");
    pdf.text("PURPOSE:", 20, nameY);

    pdf.setFont("helvetica", "bold");
    pdf.text(purpose, 50, nameY);

    // APPROVED BY section
    pdf.setFont("helvetica", "normal");
    pdf.text("APPROVED BY :", 20, 195);
    // Render Signature if available
    if (signatureDataUrl?.startsWith("data:image")) {
      try {
        const adjustedY = signatureY + 3; // 👈 Push it 10 units lower
        pdf.addImage(signatureDataUrl, "PNG", signatureX, adjustedY, 30, 20);
      } catch (error) {
        console.error("❌ Failed to add signature to PDF:", error);
        pdf.setFont("helvetica", "italic");
        pdf.setFontSize(10);
        pdf.text("[Signature failed to render]", signatureX, signatureY + 20);
      }
    } else {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text("[Signature not available]", signatureX, signatureY + 20);
    }

    // Add Head Name below signature
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    // pdf.text(headPositionName.toUpperCase(), signatureX, signatureY + 30);

    // Signatory details for approval section
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);

    const approverName = headPositionName || "__________";
    const textWidth = pdf.getTextWidth(approverName);
    const x = 120;
    const y = 225;

    // Add the name and underline
    pdf.text(approverName, x, y);
    pdf.line(x, y + 1, x + textWidth, y + 1);

    // Add the position
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(12);
    pdf.text("Chief LEO", 133, y + 8);

    // Instructions
    pdf.line(10, 260, 200, 260);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");

    pdf.text(
      "INSTRUCTION: Division Chiefs shall prepare this form three (3) \n copies which must be attached to Appendix once approved",
      13,
      265
    );
    pdf.line(92, 280, 92, 260);
    pdf.text("Note: ", 95, 265);
    pdf.rect(105, 262, 4, 4);
    pdf.text("On Official Time only (No Claim)", 110, 265);
    pdf.rect(105, 267, 4, 4);
    pdf.text(
      "Live-in Activity (1 day before-1 day after claim only)",
      110,
      270
    );
    pdf.rect(105, 272, 4, 4);
    pdf.text("May use the official vehicle", 110, 275);
    pdf.rect(153, 262, 4, 4);
    pdf.text("Others:_____________________", 158, 265);

    return pdf;
  };

  const handleDownload = () => {
    const pdf = generatePDF();
    pdf.save("official_business_form.pdf");
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Travel Order
        <IconButton
          onClick={handleClose}
          aria-label="close"
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
          }}
        >
          <iframe
            title="PDF Preview"
            src={pdfUri}
            style={{
              width: "100%",
              height: "500px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Button variant="contained" onClick={handleDownload}>
            Download
          </Button>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

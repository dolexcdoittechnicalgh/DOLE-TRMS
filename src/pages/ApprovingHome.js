//Boncales | 02/12/25 | Approving Home
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Box, Button } from "@mui/material";
import Container from "@mui/material/Container";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { InputBase, IconButton } from "@mui/material";
import { Search, FilterList } from "@mui/icons-material";
import "../pages/Approving.css";
import { useSearchParams } from "react-router-dom";
import { useNotifications } from "./NotificationContext";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useAppContext } from "../contexts/ContextProvider";
import {
  fetchToDetails,
  fetchTOhistory,
  fetchObDetails,
  fetchPassSlipDetails,
  fetchHistoryLogs,
  fetchAllUsers,
  fetchnameandsignature,
  getPendingNotifications,
} from "../api"; // adjust path as needed
//02/17/2025 | Importing functions from Functions.js
import {
  ApprovingEmployee,
  ApprovingPending,
  ApprovingReports,
  ApprovingHistory,
  ApprovingDeclined,
  Header,
  StatisticsEmployee,
  UserProfile,
  Logs,
  ManageHead,
  Dashboard,
} from "./Functions";
import echo from "../utils/echo"; // 👈 Your configured Echo instance

import dayjs from "dayjs";
import isBetweenPlugin from "dayjs/plugin/isBetween";

// Extend dayjs with the isBetween plugin
dayjs.extend(isBetweenPlugin);

// Helper function to get request date for sorting
const getRequestDate = (report) => {
  if (report.type === "OB" && report.official_business) {
    return report.official_business.created_at || report.official_business.date_of_business || report.date || report.created_at;
  } else if (report.type === "TO" && report.travel_order) {
    return report.travel_order.created_at || report.travel_order.date || report.date || report.created_at;
  } else if (report.type === "PS" && report.pass_slip) {
    return report.pass_slip.created_at || report.pass_slip.date || report.date || report.created_at;
  }
  return report.created_at || report.date || "";
};

// Helper function to sort by request date (newest first)
const sortByRequestDate = (data) => {
  return [...(data || [])].sort((a, b) => {
    const dateA = dayjs(getRequestDate(a));
    const dateB = dayjs(getRequestDate(b));
    
    // If dates are invalid, put them at the end
    if (!dateA.isValid() && !dateB.isValid()) return 0;
    if (!dateA.isValid()) return 1;
    if (!dateB.isValid()) return -1;
    
    // Sort newest first (descending order)
    return dateB.valueOf() - dateA.valueOf();
  });
};

function ApprovingHome() {
  const [searchParams, setSearchParams] = useSearchParams();
  // Handle legacy "pending" tab by converting to "travel-requests" with "pending" sub-tab
  const urlTab = searchParams.get("tab");
  const initialTab = urlTab === "pending" || urlTab === "history" ? "travel-requests" : (urlTab || "dashboard");
  const [value, setValue] = React.useState(initialTab);
  // Set initial sub-tab based on URL or default to "pending"
  const initialSubTab = urlTab === "pending" ? "pending" : (urlTab === "history" ? "approved" : (searchParams.get("subTab") || "pending"));
  const [travelRequestsSubTab, setTravelRequestsSubTab] = React.useState(initialSubTab);
  
  // Employee subtab state - get from URL or default
  const urlEmployeeSubTab = searchParams.get("employeeSubTab");
  const [employeeSubTab, setEmployeeSubTab] = React.useState(urlEmployeeSubTab || "organizational-chart");
  
  // Sync state with URL params when URL changes (e.g., browser back/forward buttons)
  // This ensures state stays in sync with URL when navigating via browser controls
  useEffect(() => {
    const urlTab = searchParams.get("tab");
    const currentTabValue = urlTab === "pending" || urlTab === "history" ? "travel-requests" : (urlTab || "dashboard");
    
    // Only update if URL tab differs from current state
    if (currentTabValue !== value) {
      setValue(currentTabValue);
      
      // Sync subtabs based on the tab
      if (currentTabValue === "travel-requests") {
        const urlSubTab = searchParams.get("subTab") || (urlTab === "pending" ? "pending" : urlTab === "history" ? "approved" : "pending");
        setTravelRequestsSubTab(urlSubTab);
      } else if (currentTabValue === "employee") {
        const urlEmpSubTab = searchParams.get("employeeSubTab") || "organizational-chart";
        setEmployeeSubTab(urlEmpSubTab);
      }
    } else {
      // Tab matches, but check if subtabs need syncing
      if (currentTabValue === "travel-requests") {
        const urlSubTab = searchParams.get("subTab") || "pending";
        if (urlSubTab !== travelRequestsSubTab) {
          setTravelRequestsSubTab(urlSubTab);
        }
      } else if (currentTabValue === "employee") {
        const urlEmpSubTab = searchParams.get("employeeSubTab") || "organizational-chart";
        if (urlEmpSubTab !== employeeSubTab) {
          setEmployeeSubTab(urlEmpSubTab);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]); // Use toString() to compare URL params, not the object reference
  
  const { logout } = useAppContext(); // Use context's logout function
  
  // Update URL params when main tab changes
  const handleChange = (event, newValue) => {
    if (!newValue) return; // Prevent setting to null
    
    setValue(newValue);
    
    // Update URL with new tab
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", newValue);
    
    // Handle subtabs based on the new tab
    if (newValue === "travel-requests") {
      // Keep or set the subtab for travel-requests
      if (travelRequestsSubTab) {
        newParams.set("subTab", travelRequestsSubTab);
      } else if (!newParams.get("subTab")) {
        newParams.set("subTab", "pending"); // Default subtab
      }
      newParams.delete("employeeSubTab");
    } else if (newValue === "employee") {
      // Keep or set the subtab for employee
      if (employeeSubTab) {
        newParams.set("employeeSubTab", employeeSubTab);
      } else if (!newParams.get("employeeSubTab")) {
        newParams.set("employeeSubTab", "organizational-chart"); // Default subtab
      }
      newParams.delete("subTab");
    } else {
      // Clear subtabs when switching away from travel-requests or employee tabs
      newParams.delete("subTab");
      newParams.delete("employeeSubTab");
    }
    
    setSearchParams(newParams, { replace: true });
  };
  
  // Update URL params when travel requests subtab changes
  const handleTravelRequestsSubTabChange = (event, newValue) => {
    if (!newValue) return;
    
    setTravelRequestsSubTab(newValue);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", "travel-requests");
    newParams.set("subTab", newValue);
    setSearchParams(newParams, { replace: true });
  };
  
  // Update URL params when employee subtab changes
  const handleEmployeeSubTabChange = (event, newValue) => {
    if (!newValue) return;
    
    setEmployeeSubTab(newValue);
    
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", "employee");
    newParams.set("employeeSubTab", newValue);
    setSearchParams(newParams, { replace: true });
  };

  // Handler to navigate from Dashboard cards to Travel Requests subtabs
  const handleNavigateToSubtab = (subtab) => {
    setValue("travel-requests");
    setTravelRequestsSubTab(subtab);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", "travel-requests");
    newParams.set("subTab", subtab);
    setSearchParams(newParams, { replace: true });
  };
  const navigate = useNavigate(); // Initialize navigate
  const { updateNotifications } = useNotifications();
  const handleLogout = () => {
    // Show confirmation dialog using Swal
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      reverseButtons: false, // Reverse the button order
      background: "#ffffff",
      color: "#212121",
      confirmButtonColor: "#1976d2",
      cancelButtonColor: "#757575",
      buttonsStyling: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout(); // Call the logout function from context
        navigate("/"); // Redirect to login page after logout
      } else {
        Swal.fire({
          title: "Cancelled",
          text: "Your session is safe.",
          icon: "info",
          background: "#ffffff",
          color: "#212121",
          confirmButtonColor: "#1976d2",
        }); // Show cancel message
      }
    });
  };
  const [pendingData, setPendingData] = useState([]); // Initialize it as an empty array

  // Define state for combined pending data (TO + OB)
  const [combinedPendingData, setCombinedPendingData] = useState([]);
  // Separate state for ALL pending records (including both "pending" and "pendingAdmin") for pending tab
  const [allPendingData, setAllPendingData] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(true);
  const [error, setError] = useState(null);
  const { userRole } = useAppContext();
  const [employeeCountsOfficialBusiness, setEmployeeCountsOfficialBusiness] =
    useState({});
  const [employeeCountsTravelOrder, setEmployeeCountsTravelOrder] = useState(
    {}
  );
  const [employeeCountsPassSlip, setEmployeeCountsPassSlip] = useState({});
  const [headPosition, setHeadPosition] = useState(null);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const headPositionId = headPosition?.data?.id;
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const filterByRole = (data, key, role) => {
    console.log(`🔵 filterByRole called with key="${key}", role="${role}", data length=${data?.length || 0}`);
    return data.filter((item, index) => {
      if (!item || typeof item !== "object") {
        console.log(`  ❌ Item ${index} is not an object:`, item);
        return false;
      }

      // Ensure the key exists and the status is defined within the nested object or fallback to top-level status
      const status =
        item[key] && item[key].status !== undefined
          ? item[key].status
          : item.status;

      console.log(`  Item ${index} status:`, status, `(from ${item[key]?.status !== undefined ? `item[${key}].status` : 'item.status'})`);

      // If no status is found, skip the item
      if (!status) {
        console.log(`  ❌ Item ${index} has no status, filtering out`);
        return false;
      }

      // Always include "approved" and "declined" statuses
      if (status === "approved" || status === "declined") {
        console.log(`  ✅ Item ${index} with status "${status}" included (approved/declined)`);
        return true;
      }

      // Role-based logic for pending statuses
      switch (role) {
        case "admin":
          // Admin can view "pendingAdmin" status
          const adminResult = status === "pendingAdmin";
          console.log(`  ${adminResult ? '✅' : '❌'} Item ${index} with status "${status}" ${adminResult ? 'included' : 'filtered out'} (admin sees only pendingAdmin)`);
          return adminResult;
        case "evaluator":
          // Evaluator can view "pending" status
          const evalResult = status === "pending";
          console.log(`  ${evalResult ? '✅' : '❌'} Item ${index} with status "${status}" ${evalResult ? 'included' : 'filtered out'} (evaluator sees only pending)`);
          return evalResult;
        default:
          console.log(`  ❌ Item ${index} with status "${status}" filtered out (unknown role: ${role})`);
          return false;
      }
    });
  };

  const getToDetails = async () => {
    try {
      console.log("🔵 Starting getToDetails...");
      setIsLoadingPending(true);

      console.log("🔵 Calling API endpoints...");
      const [toResponse, obResponse, psResponse, headResponse] =
        await Promise.all([
          fetchToDetails(),
          fetchObDetails(),
          fetchPassSlipDetails(),
          fetchnameandsignature(),
        ]);

      console.log("✅ Head position Response:", headResponse);
      console.log("✅ TO API Response:", toResponse);
      console.log("✅ TO API Response.data:", toResponse?.data);
      console.log("✅ TO API Response.data type:", typeof toResponse?.data);
      console.log("✅ TO API Response.data is array?", Array.isArray(toResponse?.data));
      if (toResponse?.data && toResponse.data.length > 0) {
        console.log("✅ First TO item structure:", toResponse.data[0]);
        console.log("✅ First TO item keys:", Object.keys(toResponse.data[0] || {}));
      }
      console.log("✅ OB API Response:", obResponse);
      console.log("✅ PS API Response:", psResponse);

      const hostname = window.location.hostname;

      const API_BASE_URL =
        hostname === "localhost" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.")
          ? `http://${hostname}:8000` // Local or LAN
          : window.location.origin; // Production

      const signaturePath = headResponse?.data?.signature;

      let fullSignatureUrl = null;

      if (signaturePath) {
        // ✅ Normalize path to avoid duplicate slashes
        const normalizedPath = signaturePath.replace(/^\/+/, "");
        fullSignatureUrl = `${API_BASE_URL}/${normalizedPath}`;

        setSignatureUrl(fullSignatureUrl);
      } else {
        // Optional fallback
        const fallbackUrl = "https://via.placeholder.com/150";
        setSignatureUrl(fallbackUrl);
        console.warn("⚠️ No signature found. Using fallback:", fallbackUrl);
      }

      console.log("🔵 Processing head position...");
      setHeadPosition(headResponse?.data);
      
      // ----- TRAVEL ORDER -----
      console.log("🔵 Processing Travel Orders...");
      console.log("🔵 toResponse type:", typeof toResponse);
      console.log("🔵 toResponse.data:", toResponse?.data);
      console.log("🔵 toResponse.data is array?", Array.isArray(toResponse?.data));
      
      const travelOrders = Array.isArray(toResponse?.data)
        ? toResponse.data
        : [];
      console.log("🔵 travelOrders length:", travelOrders.length);
      console.log("🔵 userRole:", userRole);
      
      const filteredTO = filterByRole(travelOrders, "travel_order", userRole);
      console.log("🔵 filteredTO length:", filteredTO.length);
      console.log("🔵 filteredTO items:", filteredTO);
      if (filteredTO.length > 0) {
        console.log("🔵 First filtered TO item:", filteredTO[0]);
        console.log("🔵 First filtered TO item status:", filteredTO[0]?.travel_order?.status || filteredTO[0]?.status);
      }

      // For pending tab: Include ALL records with pending/pendingAdmin status (not filtered by role)
      const allPendingTO = travelOrders.filter((item) => {
        const status = item?.travel_order?.status || item?.status;
        return status === "pending" || status === "pendingAdmin";
      });

      const combinedPendingToData = filteredTO.map((order) => ({
        ...order,
        type: "TO",
        approved_at: order.travel_order?.approved_at || "",
      }));

      const allPendingToData = allPendingTO.map((order) => ({
        ...order,
        type: "TO",
        approved_at: order.travel_order?.approved_at || "",
      }));

      if (toResponse?.employee_countsTravelOrder) {
        setEmployeeCountsTravelOrder(toResponse.employee_countsTravelOrder);
      }

      // ----- OFFICIAL BUSINESS -----
      console.log("🔵 Processing Official Business...");
      console.log("🔵 obResponse type:", typeof obResponse);
      console.log("🔵 obResponse.data:", obResponse?.data);
      console.log("🔵 obResponse.data is array?", Array.isArray(obResponse?.data));
      
      const obItems = Array.isArray(obResponse?.data) ? obResponse.data : [];
      console.log("🔵 obItems length:", obItems.length);
      
      const filteredOB = filterByRole(obItems, "official_business", userRole);
      console.log("🔵 filteredOB length:", filteredOB.length);

      // For pending tab: Include ALL records with pending/pendingAdmin status (not filtered by role)
      const allPendingOB = obItems.filter((item) => {
        const status = item?.official_business?.status || item?.status;
        return status === "pending" || status === "pendingAdmin";
      });

      const combinedPendingObData = filteredOB.map((order) => ({
        ...order,
        type: "OB",
        approved_at: order.official_business?.approved_at || "",
      }));

      const allPendingObData = allPendingOB.map((order) => ({
        ...order,
        type: "OB",
        approved_at: order.official_business?.approved_at || "",
      }));

      if (obResponse?.employee_countsOfficialBusiness) {
        setEmployeeCountsOfficialBusiness(
          obResponse.employee_countsOfficialBusiness
        );
      }

      // ----- PASS SLIPS -----
      console.log("🔵 Processing Pass Slips...");
      console.log("🔵 psResponse type:", typeof psResponse);
      console.log("🔵 psResponse:", psResponse);
      console.log("🔵 psResponse.data:", psResponse?.data);
      console.log("🔵 psResponse is array?", Array.isArray(psResponse));
      console.log("🔵 psResponse.data is array?", Array.isArray(psResponse?.data));
      
      const psArray = Array.isArray(psResponse)
        ? psResponse
        : Array.isArray(psResponse?.data)
        ? psResponse.data
        : [];
      console.log("🔵 psArray length:", psArray.length);

      const filteredPS = filterByRole(psArray, "pass_slip", userRole);
      console.log("🔵 filteredPS length:", filteredPS.length);

      // For pending tab: Include ALL records with pending/pendingAdmin status (not filtered by role)
      const allPendingPS = psArray.filter((item) => {
        const status = item?.pass_slip?.status || item?.status;
        return status === "pending" || status === "pendingAdmin";
      });

      const combinedPendingPsData = filteredPS.map((ps) => {
        const employee = ps.employees?.[0] || {};
        return {
          ...ps,
          type: "PS",
          approved_at: ps.pass_slip?.approved_at || "",
          place_to_visit: ps.pass_slip?.place_to_visit || "",
          reason: ps.pass_slip?.reason || "",
          full_name: `${employee.first_name || ""} ${
            employee.middle_name ? employee.middle_name[0] + "." : ""
          } ${employee.last_name || ""}`.trim(),
        };
      });

      const allPendingPsData = allPendingPS.map((ps) => {
        const employee = ps.employees?.[0] || {};
        return {
          ...ps,
          type: "PS",
          approved_at: ps.pass_slip?.approved_at || "",
          place_to_visit: ps.pass_slip?.place_to_visit || "",
          reason: ps.pass_slip?.reason || "",
          full_name: `${employee.first_name || ""} ${
            employee.middle_name ? employee.middle_name[0] + "." : ""
          } ${employee.last_name || ""}`.trim(),
        };
      });

      if (psResponse?.employee_countsPassSlip) {
        setEmployeeCountsPassSlip(psResponse.employee_countsPassSlip);
      }

      // ----- COMBINE ALL -----
      console.log("🔵 Combining all data...");
      console.log("🔵 combinedPendingToData length:", combinedPendingToData.length);
      console.log("🔵 combinedPendingObData length:", combinedPendingObData.length);
      console.log("🔵 combinedPendingPsData length:", combinedPendingPsData.length);
      
      const combinedPendingAllData = [
        ...combinedPendingToData,
        ...combinedPendingObData,
        ...combinedPendingPsData,
      ];
      console.log("✅ Combined data length:", combinedPendingAllData.length);

      // For pending tab: Combine ALL pending records (both "pending" and "pendingAdmin")
      const allPendingAllData = [
        ...allPendingToData,
        ...allPendingObData,
        ...allPendingPsData,
      ];
      console.log("✅ All pending data length (for pending tab):", allPendingAllData.length);
      console.log("✅ Successfully completed getToDetails");

      setCombinedPendingData(combinedPendingAllData);
      setAllPendingData(allPendingAllData);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      console.error("❌ Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
      });
      setError(error.response?.data?.message || error.message || "Unknown error occurred.");
    } finally {
      setIsLoadingPending(false);
    }
  };

  // ✅ Call on component mount
  useEffect(() => {
    getToDetails();
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  // In your parent component
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleGetHistory = async () => {
    try {
      setLoading(true);
      const response = await fetchHistoryLogs();
      const rawData = response.data || response;

      const formattedData = Array.isArray(rawData)
        ? rawData.map((log) => ({
            ...log,
            date: log.date ? log.date.substring(0, 10) : "",
          }))
        : [];

      setHistoryLogs(formattedData);
    } catch (error) {
      console.error("Failed to fetch history logs:", error);
      setHistoryLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetHistory();
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return null; // Return null when no search term

    const term = searchTerm.toLowerCase();
    return historyLogs.filter((log) => {
      // Safely handle potential missing properties
      const userName = String(log.user_name || "").toLowerCase();
      const action = String(log.action || "").toLowerCase();
      const date = String(log.date || "").toLowerCase();
      const remarks = String(log.remarks || "").toLowerCase();

      return (
        userName.includes(term) ||
        action.includes(term) ||
        date.includes(term) ||
        remarks.includes(term)
      );
    });
  }, [historyLogs, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };
  // Removed automatic date range filtering - show all data by default
  console.log("🔵 combinedPendingData:", combinedPendingData?.length);
  
  // Filter only by search term (no date filtering)
  const filteredDataBySearch = combinedPendingData?.filter((report) => {
    // Get the date based on type
    let dateStr = null;
    if (report.type === "OB" && report.official_business) {
      dateStr = report.official_business.date_of_business || report.date;
    } else if (report.type === "TO" && report.travel_order) {
      dateStr = report.travel_order.date || report.date;
    } else if (report.type === "PS" && report.pass_slip) {
      dateStr = report.pass_slip.time_start || report.pass_slip.date || report.date;
    } else {
      dateStr = report.date;
    }

    let reportDate = dayjs(dateStr);
    if (!reportDate.isValid()) {
      console.log("⚠️ Invalid date for report:", report.type, dateStr);
      return false;
    }

    // Date filtering removed - show all data by default
    // Date filtering will be handled in individual components when user selects a range

    const status =
      report.type === "OB" && report.official_business
        ? report.official_business.status
        : report.type === "TO" && report.travel_order
        ? report.travel_order.status
        : report.type === "PS" && report.pass_slip
        ? report.pass_slip.status
        : "";

    const combinedText = [
      report.type === "OB"
        ? "Official Business"
        : report.type === "TO"
        ? "Travel Order"
        : report.type === "PS"
        ? "Pass Slip"
        : "",

      status,

      reportDate.format("YYYY-MM-DD"),

      ...(report.employees?.map(
        (emp) => `${emp.first_name} ${emp.last_name}`
      ) || []),

      report.type === "OB"
        ? report.official_business?.travel_to
        : report.type === "TO"
        ? report.travel_order?.destination
        : report.type === "PS"
        ? report.pass_slip?.place_to_visit
        : "",
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchTerm.trim() === "" || combinedText.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });
  
  console.log("🔵 filteredDataBySearch length:", filteredDataBySearch?.length);
  console.log("🔵 combinedPendingData length:", combinedPendingData?.length);
  console.log("🔵 searchTerm:", searchTerm);
  
  // For pending tab: Use allPendingData (includes ALL pending/pendingAdmin records, ApprovingPending will filter by role)
  // Default display shows filtered pending based on user role
  // Admin: only "pendingAdmin" (confirmed by evaluator)
  // Evaluator: only "pending" (initial pending from calendar)
  // Sort by request date (newest first)
  const pendingTabData = useMemo(() => {
    if (!allPendingData || allPendingData.length === 0) return [];
    
    // Filter based on user role
    const filtered = allPendingData.filter((item) => {
      if (!item || !item.type) return false;
      
      const status =
        item.type === "OB" && item.official_business
          ? item.official_business.status
          : item.type === "TO" && item.travel_order
          ? item.travel_order.status
          : item.type === "PS" && item.pass_slip
          ? item.pass_slip.status
          : undefined;
      
      // Admin only sees requests confirmed by evaluator (pendingAdmin)
      // Evaluator only sees initial pending requests (pending)
      if (userRole === "admin") {
        return status === "pendingAdmin";
      } else if (userRole === "evaluator") {
        return status === "pending";
      }
      
      return false;
    });
    
    return sortByRequestDate(filtered);
  }, [allPendingData, userRole]);
  
  const reportsTabData = filteredDataBySearch;
  
  // Sort historyTabData by request date (newest first)
  const historyTabData = useMemo(() => {
    return sortByRequestDate(filteredDataBySearch || []);
  }, [filteredDataBySearch]);
  
  // Filter declined data and sort by request date (newest first)
  const declinedTabData = useMemo(() => {
    const declined = (filteredDataBySearch || []).filter((report) => {
      const status =
        report.type === "OB" && report.official_business
          ? report.official_business.status
          : report.type === "TO" && report.travel_order
          ? report.travel_order.status
          : report.type === "PS" && report.pass_slip
          ? report.pass_slip.status
          : "";
      return status === "declined" || status === "Declined";
    });
    return sortByRequestDate(declined);
  }, [filteredDataBySearch]);

  // Filter approved data for dashboard count
  const approvedTabData = useMemo(() => {
    return (filteredDataBySearch || []).filter((report) => {
      const status =
        report.type === "OB" && report.official_business
          ? report.official_business.status
          : report.type === "TO" && report.travel_order
          ? report.travel_order.status
          : report.type === "PS" && report.pass_slip
          ? report.pass_slip.status
          : "";
      return status === "approved" || status === "Approved";
    });
  }, [filteredDataBySearch]);

  // Calculate counts for dashboard
  const pendingCount = pendingTabData.length;
  const approvedCount = approvedTabData.length;
  const declinedCount = declinedTabData.length;
  
  // Calculate counts for TO, OB, and Pass Slips
  const totalTOCount = useMemo(() => {
    return (combinedPendingData || []).filter((item) => item.type === "TO").length;
  }, [combinedPendingData]);
  
  const totalOBCount = useMemo(() => {
    return (combinedPendingData || []).filter((item) => item.type === "OB").length;
  }, [combinedPendingData]);
  
  const totalPassSlipCount = useMemo(() => {
    return (combinedPendingData || []).filter((item) => item.type === "PS").length;
  }, [combinedPendingData]);
  
  console.log("🔵 pendingTabData length:", pendingTabData.length);
  console.log("🔵 allPendingData length:", allPendingData?.length || 0);
  console.log("🔵 reportsTabData length:", reportsTabData.length);
  console.log("🔵 historyTabData length:", historyTabData.length);
  const handleNotificationResult = (result) => {
    if (result.success) {
      const obCount = result.data?.pending_ob_count || 0;
      const toCount = result.data?.pending_to_count || 0;
      const psCount = result.data?.pending_ps_count || 0;

      const newNotifications = [
        obCount > 0 && {
          id: "ob-notification",
          title: "OB Requests",
          message: `${obCount} pending approval${obCount > 1 ? "s" : ""}`,
        },
        toCount > 0 && {
          id: "to-notification",
          title: "TO Requests",
          message: `${toCount} pending approval${toCount > 1 ? "s" : ""}`,
        },
        psCount > 0 && {
          id: "ps-notification",
          title: "Pass Slips",
          message: `${psCount} pending approval${psCount > 1 ? "s" : ""}`,
        },
      ].filter(Boolean);

      updateNotifications(newNotifications);
    } else {
      console.warn("❌ Invalid result received:", result);
    }
  };

  const fetchNotifications = async () => {
    try {
      const result = await getPendingNotifications();
      handleNotificationResult(result);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAndListen = async () => {
      await fetchNotifications();

      const channel = echo.channel("travel-orders");

      channel.listen(".travel-order.status.updated", (event) => {
        if (isMounted) {
          fetchNotifications();
        }
      });
    };

    fetchAndListen();

    return () => {
      isMounted = false;
      echo.leaveChannel("travel-orders");
    };
  }, []);

  //filtering dont touch
  const [filteringDate, setFilteringDate] = useState("week"); // or "month"

  const filterDataByDate = (data, filteringDate) => {
    const today = dayjs();
    let startDate, endDate;

    // Determine the date range based on the filteringDate parameter (week or month)
    switch (filteringDate) {
      case "week":
        startDate = today.startOf("week");
        endDate = today.endOf("week");
        break;
      case "month":
        startDate = today.startOf("month");
        endDate = today.endOf("month");
        break;
      default:
        startDate = today.startOf("day");
        endDate = today.endOf("day");
    }

    // Filter the data based on the date range
    return data.filter((item) => {
      const itemDate = dayjs(item.date); // Assuming each item has a 'date' field
      return itemDate.isBetween(startDate, endDate, null, "[]"); // Filter the data within the date range
    });
  };

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const loadUsers = async () => {
      const result = await fetchAllUsers();
      if (result.success) {
        setUsers(result.users);
      } else {
        console.error("Could not load users:", result.message);
      }
    };
    loadUsers();
  }, []);
  return (
    <Box
      sx={{
        backgroundImage: "url('bgimage1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        overflow: "hidden",
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
      <Header getToDetails={getToDetails} handleLogout={handleLogout} />

      <Container
        fixed
        sx={{
          p: { xs: 1, sm: 2 },
        }}
      >
        {/* Tabs */}
        <TabContext value={value}>
          <Box 
            sx={{ 
              borderBottom: 2, 
              borderColor: "divider", 
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: { xs: "8px 8px 0 0", sm: "12px 12px 0 0" },
              padding: { xs: "0 4px", sm: "0 8px" },
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 2 },
            }}
          >
              <TabList
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  flex: 1,
                  minHeight: { xs: "40px", sm: "48px" },
                  "& .MuiTabs-scrollButtons": {
                    width: { xs: "32px", sm: "40px" },
                    "&.Mui-disabled": {
                      opacity: 0.3,
                    },
                  },
                  "& .MuiTabs-indicator": {
                    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                    height: 3,
                    borderRadius: "3px 3px 0 0",
                  },
                }}
              >
              <Tab
                label="Dashboard"
                value="dashboard"
                sx={{ 
                  fontSize: { xs: "11px", sm: "14px" },
                  minHeight: { xs: "40px", sm: "48px" },
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                }}
              />
              <Tab
                label="Travel Requests"
                value="travel-requests"
                sx={{ 
                  fontSize: { xs: "11px", sm: "14px" },
                  minHeight: { xs: "40px", sm: "48px" },
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                }}
              />
              <Tab
                label="Reports"
                value="reports"
                sx={{ 
                  fontSize: { xs: "11px", sm: "14px" },
                  minHeight: { xs: "40px", sm: "48px" },
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                  whiteSpace: "nowrap",
                }}
              />
              <Tab
                label="Logs"
                value="logs"
                sx={{ 
                  fontSize: { xs: "11px", sm: "14px" },
                  minHeight: { xs: "40px", sm: "48px" },
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                }}
              />
              <Tab
                label="Employee"
                value="employee"
                sx={{ 
                  fontSize: { xs: "11px", sm: "14px" },
                  minHeight: { xs: "40px", sm: "48px" },
                  padding: { xs: "6px 8px", sm: "12px 16px" },
                }}
              />
              {userRole !== "evaluator" && (
                <Tab
                  label="User Profile"
                  value="user-profile"
                  sx={{ 
                    fontSize: { xs: "11px", sm: "14px" },
                    minHeight: { xs: "40px", sm: "48px" },
                    padding: { xs: "6px 8px", sm: "12px 16px" },
                    whiteSpace: "nowrap",
                  }}
                />
              )}
              {userRole !== "evaluator" && (
                <Tab
                  label="MANAGE HEAD"
                  value="manage-head"
                  sx={{ 
                    fontSize: { xs: "11px", sm: "14px" },
                    minHeight: { xs: "40px", sm: "48px" },
                    padding: { xs: "6px 8px", sm: "12px 16px" },
                    whiteSpace: "nowrap",
                  }}
                />
              )}
              </TabList>
              
              {/* Search Bar */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  px: { xs: 0.75, sm: 1 },
                  py: { xs: 0.25, sm: 0.5 },
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  width: { xs: "120px", sm: "200px" },
                  maxWidth: { xs: "150px", sm: "250px" },
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.06)",
                  transition: "all 0.3s ease",
                  ml: "auto",
                  "&:hover": {
                    borderColor: "#1976d2",
                    boxShadow: "0 4px 10px rgba(25, 118, 210, 0.15)",
                  },
                }}
              >
                <IconButton size="small" sx={{ p: { xs: 0.25, sm: 0.5 } }}>
                  <Search fontSize="small" />
                </IconButton>
                <InputBase
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  sx={{ 
                    flex: 1, 
                    fontSize: { xs: "11px", sm: "13px" },
                    "& input": {
                      padding: { xs: "2px 0", sm: "4px 0" },
                    },
                  }}
                />
                <IconButton size="small" sx={{ p: { xs: 0.25, sm: 0.5 } }}>
                  <FilterList fontSize="small" />
                </IconButton>
              </Box>
          </Box>

          <TabPanel 
            value="dashboard"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <Dashboard
              pendingCount={pendingCount}
              approvedCount={approvedCount}
              declinedCount={declinedCount}
              toCount={totalTOCount}
              obCount={totalOBCount}
              passSlipCount={totalPassSlipCount}
              employeeCountsOfficialBusiness={employeeCountsOfficialBusiness}
              employeeCountsTravelOrder={employeeCountsTravelOrder}
              employeeCountsPassSlip={employeeCountsPassSlip}
              onNavigateToSubtab={handleNavigateToSubtab}
              allData={combinedPendingData}
            />
          </TabPanel>

          <TabPanel 
            value="travel-requests"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <TabContext value={travelRequestsSubTab}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: "divider", 
                mb: { xs: 1.5, sm: 2 },
                overflowX: "hidden",
              }}>
                <TabList
                  onChange={handleTravelRequestsSubTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    minHeight: { xs: "40px", sm: "48px" },
                    "& .MuiTabs-scrollButtons": {
                      width: { xs: "32px", sm: "40px" },
                    },
                    "& .MuiTabs-indicator": {
                      background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      height: 2,
                    },
                  }}
                >
                  <Tab
                    label="Pending"
                    value="pending"
                    sx={{ 
                      fontSize: { xs: "11px", sm: "14px" },
                      minHeight: { xs: "40px", sm: "48px" },
                      padding: { xs: "6px 12px", sm: "12px 24px" },
                    }}
                  />
                  <Tab
                    label="Approved"
                    value="approved"
                    sx={{ 
                      fontSize: { xs: "11px", sm: "14px" },
                      minHeight: { xs: "40px", sm: "48px" },
                      padding: { xs: "6px 12px", sm: "12px 24px" },
                    }}
                  />
                  <Tab
                    label="Declined"
                    value="declined"
                    sx={{ 
                      fontSize: { xs: "11px", sm: "14px" },
                      minHeight: { xs: "40px", sm: "48px" },
                      padding: { xs: "6px 12px", sm: "12px 24px" },
                    }}
                  />
                </TabList>
              </Box>
              <TabPanel value="pending" sx={{ paddingTop: "8px !important", paddingBottom: "0 !important" }}>
                <ApprovingPending
                  data={pendingTabData}
                  allPendingData={allPendingData}
                  isLoading={isLoadingPending}
                  refetch={getToDetails}
                  refreshHistoryLogs={handleGetHistory}
                  userRole={userRole}
                  Headposition={headPosition}
                  signatureUrl={signatureUrl}
                  notifications={notifications}
                />
              </TabPanel>
              <TabPanel 
                value="approved"
                sx={{ 
                  overflowX: { xs: "auto", sm: "visible" },
                  paddingTop: "8px !important", 
                  paddingBottom: "0 !important" 
                }}
              >
                <ApprovingHistory
                  data={historyTabData}
                  isLoading={isLoadingPending}
                  userRole={userRole}
                  Headposition={headPosition}
                  signatureUrl={signatureUrl}
                />
              </TabPanel>
              <TabPanel value="declined" sx={{ paddingTop: "8px !important", paddingBottom: "0 !important" }}>
                <ApprovingDeclined
                  data={declinedTabData}
                  isLoading={isLoadingPending}
                  userRole={userRole}
                  Headposition={headPosition}
                  signatureUrl={signatureUrl}
                />
              </TabPanel>
            </TabContext>
          </TabPanel>
          <TabPanel 
            value="reports"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <ApprovingReports
              data={reportsTabData}
              isLoading={isLoadingPending}
              userRole={userRole}
            />
          </TabPanel>

          <TabPanel 
            value="logs"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <Logs
              userRole={userRole}
              historyLogs={historyLogs}
              loading={loading}
              data={filteredLogs} // ✅ pass here
            />
          </TabPanel>

          <TabPanel 
            value="employee"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <TabContext value={employeeSubTab}>
              <Box sx={{ 
                borderBottom: 1, 
                borderColor: "divider", 
                mb: { xs: 1.5, sm: 2 },
                overflowX: "hidden",
              }}>
                <TabList
                  onChange={handleEmployeeSubTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  allowScrollButtonsMobile
                  sx={{
                    minHeight: { xs: "40px", sm: "48px" },
                    "& .MuiTabs-scrollButtons": {
                      width: { xs: "32px", sm: "40px" },
                    },
                    "& .MuiTabs-indicator": {
                      background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
                      height: 2,
                    },
                  }}
                >
                  <Tab
                    label="Organizational Chart"
                    value="organizational-chart"
                    sx={{ 
                      fontSize: { xs: "11px", sm: "14px" },
                      minHeight: { xs: "40px", sm: "48px" },
                      padding: { xs: "6px 12px", sm: "12px 24px" },
                    }}
                  />
                  <Tab
                    label="Manage Employee"
                    value="manage-employee"
                    sx={{ 
                      fontSize: { xs: "11px", sm: "14px" },
                      minHeight: { xs: "40px", sm: "48px" },
                      padding: { xs: "6px 12px", sm: "12px 24px" },
                    }}
                  />
                </TabList>
              </Box>
              <TabPanel value="organizational-chart" sx={{ paddingTop: "8px !important", paddingBottom: "0 !important" }}>
                <ApprovingEmployee
                  refreshHistoryLogs={handleGetHistory}
                  setLoading={setLoading}
                  viewType="organizational-chart"
                />
              </TabPanel>
              <TabPanel value="manage-employee" sx={{ paddingTop: "8px !important", paddingBottom: "0 !important" }}>
                <ApprovingEmployee
                  refreshHistoryLogs={handleGetHistory}
                  setLoading={setLoading}
                  viewType="manage-employee"
                />
              </TabPanel>
            </TabContext>
          </TabPanel>

          <TabPanel 
            value="user-profile"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <UserProfile
              users={users}
              setUsers={setUsers}
              refreshHistoryLogs={handleGetHistory} // Pass the actual function
              setLoading={setLoading}
            />
          </TabPanel>
          <TabPanel 
            value="manage-head"
            sx={{ 
              p: { xs: 1, sm: 2 },
            }}
          >
            <ManageHead
              users={users}
              setUsers={setUsers}
              refreshHistoryLogs={handleGetHistory} // Pass the actual function
              setLoading={setLoading}
              refetch={getToDetails}
            />
          </TabPanel>
        </TabContext>
      </Container>
    </Box>
  );
}

export default ApprovingHome;

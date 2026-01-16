import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Box,
  IconButton,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import Header from "./Header";
import TravelOrderForm from "./TravelOrderForm";
import OfficialBusinessForm from "./OfficialBusinessForm";
import PassSlipForm from "./PassSlipForm";

import { fetchEmployeeNames, storeTravelOrder } from "../api";

import "./TOOBForm.css"; // ✅ Make sure you have the CSS you added

function TOOBForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0); // Stepper: 0 = select type, 1 = form (kept for backward compatibility)
  const [formType, setFormType] = useState(""); // "travel", "ob", "pass"
  const [modalOpen, setModalOpen] = useState(false); // Modal open/close state

  const [employeeData, setEmployeeData] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    requester: { name: "", position: "", firstName: "", lastName: "" },
    re: "",
    date: today,
    destination: "",
    employees: [],
    travelFrom: "",
    travelTo: "",
    travelBy: { Land: true, Water: false, Air: false },
    purpose: "",
    previousTravel: "No",
    officialBusiness: {
      employees: [{ name: "", position: "", firstName: "", lastName: "" }],
      office: "",
      dateOfBusiness: "",
      itineraryFrom: "",
      itineraryTo: "",
      departureDate: "",
      expectedReturn: "",
      division: "",
      purpose: "",
    },
    name: "",
    signature: "",
    startDate: "",
    endDate: "",
    placeToVisit: "",
    reason: "",
  });

  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        const response = await fetchEmployeeNames();
        const mappedData = response.map((emp) => ({
          id: emp.id,
          name: `${emp.first_name} ${
            emp.middle_name ? emp.middle_name + " " : ""
          }${emp.last_name}`.trim(),
          position: emp.position,
          signature: emp.signature,
          firstName: emp.first_name,
          middleName: emp.middle_name,
          lastName: emp.last_name,
        }));
        setEmployeeData(mappedData);
      } catch (err) {
        console.error("Failed to load employee names", err);
      }
    };

    loadEmployeeData();
  }, []);

  const handleChange = (e, section, index) => {
    const { name, value } = e.target;

    const updateEmployeeData = (employeesArray, employeeValue, idx) => {
      const selectedEmployee = employeeData.find(
        (employee) => employee.id === employeeValue
      );

      if (selectedEmployee) {
        const [firstName, lastName] = selectedEmployee.name.split(" ");
        employeesArray[idx] = {
          name: selectedEmployee.name,
          id: selectedEmployee.id,
          position: selectedEmployee.position,
          firstName,
          lastName,
          signature: selectedEmployee.signature,
        };
      } else {
        employeesArray[idx][name] = value;
      }

      return employeesArray;
    };

    if (section === "requester") {
      const selectedEmployee = employeeData.find(
        (employee) => employee.id === value
      );
      if (selectedEmployee) {
        setFormData((prev) => ({
          ...prev,
          requester: {
            name: selectedEmployee.name,
            position: selectedEmployee.position,
            id: selectedEmployee.id,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          requester: {
            name: value,
            position: prev.requester.position || "",
            id: null,
          },
        }));
      }
    } else if (section === "employees") {
      const updatedEmployees = [...formData.employees];
      const updatedEmployeeData = updateEmployeeData(updatedEmployees, value, index);
      const employeeIds = updatedEmployeeData.map((emp) => emp.id);
      setFormData((prev) => ({
        ...prev,
        employees: updatedEmployeeData,
        employee_ids: [formData.requester.id, ...employeeIds],
      }));
    } else if (section === "officialBusinessEmployees") {
      const updatedEmployees = [...formData.officialBusiness.employees];
      const updatedEmployeeData = updateEmployeeData(updatedEmployees, value, index);
      const employeeIds = updatedEmployeeData.map((emp) => emp.id);
      setFormData((prev) => ({
        ...prev,
        officialBusiness: {
          ...prev.officialBusiness,
          employees: updatedEmployeeData,
        },
        employee_ids: [formData.requester.id, ...employeeIds],
      }));
    } else if (section === "officialBusiness") {
      setFormData((prev) => ({
        ...prev,
        officialBusiness: { ...prev.officialBusiness, [name]: value },
      }));
    } else if (section === "passSlip") {
      const selectedEmployee = employeeData.find(
        (employee) => employee.id === value
      );
      if (selectedEmployee) {
        setFormData((prev) => ({
          ...prev,
          name: selectedEmployee.name,
          employee_id: selectedEmployee.id,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          name: value,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addEmployee = (section) => {
    const newEmployee = { name: "", position: "", signature: "" };
    if (section === "travel") {
      setFormData((prev) => ({
        ...prev,
        employees: [...prev.employees, newEmployee],
      }));
    } else if (section === "officialBusiness") {
      setFormData((prev) => ({
        ...prev,
        officialBusiness: {
          ...prev.officialBusiness,
          employees: [...prev.officialBusiness.employees, newEmployee],
        },
      }));
    }
  };

  const removeEmployee = (index, section) => {
    if (section === "travel") {
      if (formData.employees.length <= 1) {
        Swal.fire({
          title: "Warning",
          text: "The form must have at least one employee for Travel Order.",
          icon: "warning",
          confirmButtonColor: "#1554D2",
        });
        return;
      }
      setFormData((prev) => {
        const updatedEmployees = prev.employees.filter((_, i) => i !== index);
        return { ...prev, employees: updatedEmployees };
      });
    } else if (section === "officialBusiness") {
      if (formData.officialBusiness.employees.length <= 1) {
        Swal.fire({
          title: "Warning",
          text: "The form must have at least one employee for Official Business.",
          icon: "warning",
          confirmButtonColor: "#1554D2",
        });
        return;
      }
      setFormData((prev) => {
        const updatedEmployees = prev.officialBusiness.employees.filter(
          (_, i) => i !== index
        );
        return {
          ...prev,
          officialBusiness: {
            ...prev.officialBusiness,
            employees: updatedEmployees,
          },
        };
      });
    }
  };

  const handleTravelByChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      travelBy: {
        ...prev.travelBy,
        [name]: checked ? 1 : 0,
      },
    }));
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return "N/A";
    const date = new Date(datetime);
    return date.toISOString().split("T")[0];
  };

  const handleCreateTravelOrder = async (e) => {
    e.preventDefault();
    
    // Validation: Check all required fields
    if (!formData.requester?.name || !formData.requester?.id) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please select a requester name.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    if (!formData.date) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please select a date.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    if (!formData.travelFrom || !formData.travelTo) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please provide travel start and end dates.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    if (!formData.destination || formData.destination.trim() === "") {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please provide a destination.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    if (!formData.purpose || formData.purpose.trim() === "") {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please provide a purpose.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    if (!formData.previousTravel) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please indicate if there was a previous travel record.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    // Check if at least one travel method is selected
    if (!formData.travelBy?.Land && !formData.travelBy?.Water && !formData.travelBy?.Air) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please select at least one travel method (Land, Water, or Air).",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    const requester = formData.requester || {};
    const requesterId = Number(requester.id);
    const additionalEmployees = Array.isArray(formData.employees)
      ? formData.employees.filter((emp) => emp?.id !== undefined && emp?.id !== null)
      : [];

    const requestData = {
      employee_id: requesterId,
      re: "REQUEST FOR AUTHORITY TO TRAVEL",
      date: formData.date,
      destination: formData.destination.trim(),
      travel_from: formData.travelFrom,
      travel_to: formData.travelTo,
      travel_by_land: formData.travelBy?.Land ? 1 : 0,
      travel_by_water: formData.travelBy?.Water ? 1 : 0,
      travel_by_air: formData.travelBy?.Air ? 1 : 0,
      purpose: formData.purpose.trim(),
      previous_travel: formData.previousTravel,
      travel_start_date: formData.travelFrom,
      travel_end_date: formData.travelTo,
      employee_ids: [requesterId, ...additionalEmployees.map((emp) => emp.id)],
    };

    const travelModes = [];
    if (formData.travelBy?.Land) travelModes.push("Land");
    if (formData.travelBy?.Water) travelModes.push("Water");
    if (formData.travelBy?.Air) travelModes.push("Air");

    const formattedHTML = `
      <div style="text-align: left;">
        <p><strong>Requester:</strong> ${requester?.name || "N/A"}</p>
        <p><strong>Other Employees:</strong> ${
          additionalEmployees.map((emp) => emp.name).join(", ") || "None"
        }</p>
        <p><strong>Destination:</strong> ${formData.destination || "N/A"}</p>
        <p><strong>From:</strong> ${formData.travelFrom || "N/A"}</p>
        <p><strong>To:</strong> ${formData.travelTo || "N/A"}</p>
        <p><strong>Travel By:</strong> ${travelModes.join(", ") || "None"}</p>
        <p><strong>Purpose:</strong> ${formData.purpose || "N/A"}</p>
        <p><strong>Previous Travel:</strong> ${formData.previousTravel || "N/A"}</p>
        <p><strong>Start Date:</strong> ${formatDateTime(formData.travelFrom)}</p>
        <p><strong>End Date:</strong> ${formatDateTime(formData.travelTo)}</p>
      </div>
    `;

    const { isConfirmed } = await Swal.fire({
      title: "Confirm Travel Order Details",
      html: formattedHTML,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      width: "50%",
    });

    if (!isConfirmed) return;

    try {
      await storeTravelOrder(requestData);

      Swal.fire("Success", "Travel order created successfully.", "success");

      setFormData({
        requester: { name: "", position: "", firstName: "", lastName: "" },
        re: "",
        date: "",
        destination: "",
        employees: [],
        travelFrom: "",
        travelTo: "",
        travelBy: { Land: false, Water: false, Air: false },
        purpose: "",
        previousTravel: "",
        officialBusiness: {
          employees: [{ name: "", position: "", firstName: "", lastName: "" }],
          office: "",
          dateOfBusiness: "",
          itineraryFrom: "",
          itineraryTo: "",
          departureDate: "",
          expectedReturn: "",
          division: "",
          purpose: "",
        },
        name: "",
        signature: "",
        startDate: "",
        endDate: "",
        placeToVisit: "",
        reason: "",
      });
    } catch (error) {
      console.error("Error creating travel order:", error);
      Swal.fire("Error", "Failed to create travel order.", "error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "Please confirm that all information is correct.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1554D2",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Form Data Submitted:", formData);
        Swal.fire({
          title: "Form Submitted Successfully!",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/to-form");
      }
    });
  };

  return (
    <div className="to-form-container">
      <Header />

      <Paper
        elevation={0}
        sx={{
          padding: 4,
          margin: "20px auto",
          maxWidth: { xs: "95%", sm: "1200px" },
          width: "100%",
          background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.8)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton 
            onClick={() => navigate("/")}
            sx={{
              color: "#424242",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <IconButton 
            onClick={() => navigate("/")}
            sx={{
              color: "#424242",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Step 1: Select Form Type */}
        {step === 0 && (
          <Box display="flex" justifyContent="center" gap={2} mt={2}>
            <div id="kind_forms">
              <h1>Form Type</h1>
              <div id="select-button">
                <button
                  className={`form-type-button ${formType === "travel" ? "active" : ""}`}
                  onClick={() => {
                    setFormType("travel");
                    setModalOpen(true);
                  }}
                >
                  Travel Order
                </button>
                <button
                  className={`form-type-button ${formType === "ob" ? "active" : ""}`}
                  onClick={() => {
                    setFormType("ob");
                    setModalOpen(true);
                  }}
                >
                  Official Business
                </button>
                <button
                  className={`form-type-button ${formType === "pass" ? "active" : ""}`}
                  onClick={() => {
                    setFormType("pass");
                    setModalOpen(true);
                  }}
                >
                  Pass Slip
                </button>
              </div>
            </div>

          </Box>
        )}

        {/* Modal for selected form */}
        <Dialog
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setFormType("");
          }}
          maxWidth="sm"
          fullWidth={false}
          PaperProps={{
            sx: {
              maxWidth: { xs: "85vw", sm: "600px", md: "650px" },
              width: { xs: "85vw", sm: "600px", md: "650px" },
              maxHeight: "90vh",
              borderRadius: "16px",
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              pb: 1,
            }}
          >
            <Box sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" }, fontWeight: 600 }}>
              {formType === "travel"
                ? "Travel Order Form"
                : formType === "ob"
                ? "Official Business Form"
                : "Pass Slip Form"}
            </Box>
            <IconButton
              onClick={() => {
                setModalOpen(false);
                setFormType("");
              }}
              sx={{
                color: (theme) => theme.palette.grey[500],
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.grey[100],
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent
            dividers
            sx={{
              maxHeight: "calc(90vh - 120px)",
              overflowY: "auto",
              p: { xs: 1.5, sm: 2 },
            }}
          >
            {formType === "travel" && (
              <TravelOrderForm
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
                addEmployee={addEmployee}
                removeEmployee={removeEmployee}
                handleTravelByChange={handleTravelByChange}
                handleSubmit={handleSubmit}
                handleCreateTravelOrder={handleCreateTravelOrder}
                employeeData={employeeData}
              />
            )}

            {formType === "ob" && (
              <OfficialBusinessForm
                formData={formData}
                handleChange={handleChange}
                addEmployee={addEmployee}
                removeEmployee={removeEmployee}
                handleSubmit={handleSubmit}
                employeeData={employeeData}
                setFormData={setFormData}
              />
            )}

            {formType === "pass" && (
              <PassSlipForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                employeeData={employeeData}
              />
            )}
          </DialogContent>
        </Dialog>
      </Paper>
    </div>
  );
}

export default TOOBForm;

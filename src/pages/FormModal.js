import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TravelOrderForm from "./TravelOrderForm";
import OfficialBusinessForm from "./OfficialBusinessForm";
import PassSlipForm from "./PassSlipForm";
import { fetchEmployeeNames, storeTravelOrder, StoreOfficialBusiness, storePassSlip } from "../api";
import Swal from "sweetalert2";

function FormModal({ open, onClose, onSuccess }) {
  const [formTypeSelectionOpen, setFormTypeSelectionOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [selectedFormType, setSelectedFormType] = useState("");
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
    employee_id: "",
  });

  useEffect(() => {
    if (open) {
      setFormTypeSelectionOpen(true);
      setFormModalOpen(false);
      setSelectedFormType("");
    }
  }, [open]);

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
      cancelButtonText: "Cancel",
    });
  };

  const formatDateTime = (datetime) => {
    if (!datetime) return "N/A";
    const date = new Date(datetime);
    return date.toISOString().split("T")[0];
  };

  const handleCreateTravelOrder = async (e) => {
    e.preventDefault();
    
    // Validation
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
        text: "Please select a Previous Travel option.",
        icon: "warning",
        confirmButtonColor: "#1554D2",
      });
      return;
    }

    const hasTravelMode = formData.travelBy.Land || formData.travelBy.Water || formData.travelBy.Air;
    if (!hasTravelMode) {
      Swal.fire({
        title: "Missing Required Field",
        text: "Please select at least one Travel By method (Land, Water, or Air).",
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

    const formattedHTML = `
      <div style="text-align: left; padding: 10px;">
        <p><strong>Requester:</strong> ${formData.requester.name}</p>
        <p><strong>Date:</strong> ${formatDateTime(formData.date)}</p>
        <p><strong>Destination:</strong> ${formData.destination}</p>
        <p><strong>Purpose:</strong> ${formData.purpose}</p>
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

      // Close modal and reset form
      handleFormSuccess();
    } catch (error) {
      console.error("Error creating travel order:", error);
      Swal.fire("Error", "Failed to create travel order.", "error");
    }
  };

  const handleFormTypeSelect = (type) => {
    setSelectedFormType(type);
    setFormTypeSelectionOpen(false);
    setFormModalOpen(true);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setSelectedFormType("");
  };

  const handleCloseSelection = () => {
    setFormTypeSelectionOpen(false);
    if (onClose) onClose();
  };

  // Handler for successful form submission - closes modal and calls onSuccess
  const handleFormSuccess = () => {
    setFormModalOpen(false);
    setFormTypeSelectionOpen(false);
    setSelectedFormType("");
    
    // Reset form data
    setFormData({
      requester: { name: "", position: "", firstName: "", lastName: "" },
      re: "",
      date: today,
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
      employee_id: "",
    });

    if (onSuccess) onSuccess();
    if (onClose) onClose();
  };

  return (
    <>
      {/* Form Type Selection Modal */}
      <Dialog
        open={formTypeSelectionOpen}
        onClose={handleCloseSelection}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 600 }}>Select Form Type</Box>
            <IconButton onClick={handleCloseSelection}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <Button
              variant="contained"
              onClick={() => handleFormTypeSelect("travel")}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Travel Order
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFormTypeSelect("ob")}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Official Business
            </Button>
            <Button
              variant="contained"
              onClick={() => handleFormTypeSelect("pass")}
              sx={{ py: 1.5, fontSize: "1rem" }}
            >
              Pass Slip
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Form Modal */}
      <Dialog
        open={formModalOpen}
        onClose={handleCloseForm}
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
            {selectedFormType === "travel"
              ? "Travel Order Form"
              : selectedFormType === "ob"
              ? "Official Business Form"
              : "Pass Slip Form"}
          </Box>
          <IconButton
            onClick={handleCloseForm}
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
          {selectedFormType === "travel" && (
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

          {selectedFormType === "ob" && (
            <OfficialBusinessForm
              formData={formData}
              handleChange={handleChange}
              addEmployee={addEmployee}
              removeEmployee={removeEmployee}
              handleSubmit={handleSubmit}
              employeeData={employeeData}
              setFormData={setFormData}
              onSuccess={handleFormSuccess}
            />
          )}

          {selectedFormType === "pass" && (
            <PassSlipForm
              employeeData={employeeData}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default FormModal;

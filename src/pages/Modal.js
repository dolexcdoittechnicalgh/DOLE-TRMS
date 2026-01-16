import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./Modal.css";

const CalendarModal = ({ events = [], onClose }) => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All"); // Filter by Type: All, TO, OB, PS
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const isMobile = windowWidth <= 768;
  const isSmallMobile = windowWidth <= 480;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.classList.remove("modal-open");
    };
  }, []);

  const filterEmployees = (employees, term) => {
    if (!term) return employees;
    return employees.filter((emp) =>
      `${emp.first_name} ${emp.last_name}`
        .toLowerCase()
        .includes(term.toLowerCase())
    );
  };

  // Process all events into a flat list for table display (one row per event/form with all employees combined)
  const tableRows = [];
  
  events.forEach((evt) => {
    const eventType = evt.type || evt.resource?.type || "PS";
    const employees = evt.employees || evt.resource?.employees || [];
    const record = evt.record || evt.resource?.record || {};
    const status = evt.status?.toLowerCase() || "pending";
    const normalizedStatus = status === "pendingadmin" ? "pending" : status;

    // Filter by status if not "All"
    if (activeTab !== "All" && normalizedStatus !== activeTab.toLowerCase()) {
      return;
    }

    // Filter by type if not "All"
    if (typeFilter !== "All" && eventType !== typeFilter) {
      return;
    }

    const filteredEmployees = filterEmployees(employees, search);
    
    // Skip if no employees match the search filter
    if (filteredEmployees.length === 0) {
      return;
    }

    const isOB = eventType === "OB";
    const isPS = eventType === "PS";

    // Get start and end dates
    let startDate, endDate;
    if (eventType === "TO") {
      startDate = record.travel_from ? new Date(record.travel_from) : null;
      endDate = record.travel_to ? new Date(record.travel_to) : null;
    } else if (eventType === "PS") {
      startDate = record.time_start ? new Date(record.time_start) : null;
      endDate = record.time_end ? new Date(record.time_end) : null;
    } else {
      startDate = record.departure_date ? new Date(record.departure_date) : null;
      endDate = record.expected_return ? new Date(record.expected_return) : null;
    }

    // Format employee names: use comma separator, and show "+X more" if more than 2
    let employeeNames;
    if (filteredEmployees.length === 0) {
      return; // Skip if no employees
    } else if (filteredEmployees.length === 1) {
      employeeNames = `${filteredEmployees[0].first_name} ${filteredEmployees[0].last_name}`;
    } else if (filteredEmployees.length === 2) {
      // Two employees: "Mark, Jayson"
      employeeNames = filteredEmployees
        .map((emp) => `${emp.first_name} ${emp.last_name}`)
        .join(", ");
    } else {
      // More than 2 employees: "Mark, Jayson, and +X more"
      const firstTwoNames = filteredEmployees
        .slice(0, 2)
        .map((emp) => `${emp.first_name} ${emp.last_name}`)
        .join(", ");
      const remainingCount = filteredEmployees.length - 2;
      employeeNames = `${firstTwoNames}, and +${remainingCount} more`;
    }

    // Create one row per event/form with all employees combined
    tableRows.push({
      type: eventType,
      employeeName: employeeNames,
      employees: filteredEmployees, // Keep all employees for detail modal
      destination: isOB
        ? record.travel_to || "N/A"
        : isPS
        ? record.place_to_visit || "N/A"
        : record.destination || "N/A",
      purpose: record.purpose || record.reason || "N/A",
      status: normalizedStatus,
      startDate: startDate,
      endDate: endDate,
      record: record,
      eventType: eventType,
    });
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-box"
        style={{ 
          maxWidth: isSmallMobile ? "100vw" : isMobile ? "95vw" : "100vw", 
          width: isSmallMobile ? "100%" : "fit-content",
          padding: isSmallMobile ? "12px" : isMobile ? "20px" : "32px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header" style={{ position: "relative", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "flex-start" : "center", gap: isMobile ? "12px" : "5px" }}>
          <h2 style={{ 
            marginBottom: isMobile ? "8px" : "10px", 
            color: "#212121",
            fontSize: isSmallMobile ? "18px" : isMobile ? "20px" : "24px",
            width: isMobile ? "100%" : "auto",
          }}>Events Details</h2>

          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 12px" : "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: isSmallMobile ? "12px" : "14px",
              backgroundColor: "white",
              color: "#212121",
              minWidth: isSmallMobile ? "120px" : "150px",
              outline: "none",
              fontFamily: "Poppins, sans-serif",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Declined">Declined</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: isSmallMobile ? "8px 12px" : "10px 20px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: isSmallMobile ? "12px" : "14px",
              backgroundColor: "white",
              color: "#212121",
              minWidth: isSmallMobile ? "100px" : "130px",
              outline: "none",
              fontFamily: "Poppins, sans-serif",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <option value="All">All Types</option>
            <option value="TO">Travel Orders</option>
            <option value="OB">Official Business</option>
            <option value="PS">Pass Slips</option>
          </select>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              marginLeft: isMobile ? "0" : "auto",
              marginTop: isMobile ? "0" : "0",
              maxWidth: "100%",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "35px",
                paddingRight: "10px",
                border: "1px solid #ccc",
                borderRadius: "20px",
                height: isSmallMobile ? "32px" : "36px",
                width: isMobile ? "100%" : "200px",
                fontSize: isSmallMobile ? "12px" : "14px",
                boxSizing: "border-box",
              }}
            />
            <FaSearch
              style={{
                position: "absolute",
                left: "10px",
                color: "gray",
                pointerEvents: "none",
                fontSize: isSmallMobile ? "12px" : "14px",
              }}
            />
          </div>

          <FaTimes
            className="close-icon"
            onClick={onClose}
            style={{
              position: "absolute",
              top: isSmallMobile ? "8px" : "-8px",
              right: isSmallMobile ? "8px" : "-8px",
              fontSize: isSmallMobile ? "20px" : "24px",
              cursor: "pointer",
              color: "#212121",
              zIndex: 1000,
            }}
          />
        </div>

        {/* Display all events in a proper table */}
        <div
          className="table-section"
          style={{
            marginTop: isMobile ? "20px" : "30px",
            fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "12px",
            lineHeight: "1.4",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            width: "100%",
          }}
        >
          {tableRows.length > 0 ? (
            <table
              style={{
                width: "100%",
                minWidth: isMobile ? "600px" : "100%",
                borderCollapse: "collapse",
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f0f0f0",
                  }}
                >
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Type
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Employee Name
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Destination
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Purpose
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Start Date
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    End Date
                  </th>
                  <th
                    style={{
                      padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      fontWeight: "bold",
                      fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px",
                      color: "#212121",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => setSelectedDetail(row)}
                    style={{
                      backgroundColor: index % 2 === 0 ? "white" : "#f9f9f9",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#e3f2fd";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = index % 2 === 0 ? "white" : "#f9f9f9";
                    }}
                  >
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.type}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.employeeName}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        maxWidth: isMobile ? "120px" : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isMobile ? "nowrap" : "normal",
                      }}
                    >
                      {row.destination}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        maxWidth: isMobile ? "120px" : "none",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: isMobile ? "nowrap" : "normal",
                      }}
                    >
                      {row.purpose}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.startDate
                        ? row.startDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: isMobile ? "short" : "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        color: "#212121",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.endDate
                        ? row.endDate.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: isMobile ? "short" : "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td
                      style={{
                        padding: isSmallMobile ? "6px 4px" : isMobile ? "8px 6px" : "10px 12px",
                        border: "1px solid #ccc",
                        fontSize: isSmallMobile ? "9px" : isMobile ? "10px" : "13px",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        textAlign: "center",
                        color:
                          row.status === "approved"
                            ? "#4caf50"
                            : row.status === "pending"
                            ? "#ff9800"
                            : row.status === "declined"
                            ? "#f44336"
                            : "#757575",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <table
                style={{
                  width: "100%",
                  minWidth: isMobile ? "600px" : "100%",
                  borderCollapse: "collapse",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#f0f0f0" }}>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Type</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Employee Name</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Destination</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Purpose</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Start Date</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>End Date</th>
                    <th style={{ padding: isSmallMobile ? "8px 6px" : isMobile ? "10px 8px" : "12px", textAlign: "left", border: "1px solid #ccc", fontWeight: "bold", fontSize: isSmallMobile ? "10px" : isMobile ? "11px" : "14px", color: "#212121", whiteSpace: "nowrap" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#999", fontStyle: "italic", fontSize: isSmallMobile ? "11px" : isMobile ? "12px" : "14px" }}>
                      No events scheduled for this date
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div
          className="modal-overlay"
          style={{ zIndex: 10000 }}
          onClick={() => setSelectedDetail(null)}
        >
          <div
            className="modal-box"
            style={{
              maxWidth: isSmallMobile ? "100vw" : isMobile ? "95vw" : "600px",
              width: isSmallMobile ? "100%" : "90%",
              padding: isSmallMobile ? "16px" : isMobile ? "20px" : "24px",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: isMobile ? "16px" : "20px",
              flexWrap: "wrap",
              gap: "8px",
            }}>
              <h2 style={{ 
                margin: 0, 
                color: "#212121",
                fontSize: isSmallMobile ? "18px" : isMobile ? "20px" : "24px",
              }}>Request Details</h2>
              <FaTimes
                onClick={() => setSelectedDetail(null)}
                style={{
                  fontSize: isSmallMobile ? "18px" : "20px",
                  cursor: "pointer",
                  color: "#212121",
                }}
              />
            </div>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              gap: isMobile ? "10px" : "12px",
              fontSize: isSmallMobile ? "13px" : isMobile ? "14px" : "16px",
            }}>
              <div>
                <strong>Type:</strong> {selectedDetail.type}
              </div>
              <div>
                <strong>Employee Name:</strong> {selectedDetail.employeeName}
              </div>
              <div>
                <strong>Destination:</strong> {selectedDetail.destination}
              </div>
              <div>
                <strong>Purpose:</strong> {selectedDetail.purpose}
              </div>
              <div>
                <strong>Start Date:</strong>{" "}
                {selectedDetail.startDate
                  ? selectedDetail.startDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
              <div>
                <strong>End Date:</strong>{" "}
                {selectedDetail.endDate
                  ? selectedDetail.endDate.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    color: "#fff",
                    fontWeight: "600",
                    backgroundColor:
                      selectedDetail.status === "approved"
                        ? "#4caf50"
                        : selectedDetail.status === "pending"
                        ? "#ff9800"
                        : selectedDetail.status === "declined"
                        ? "#f44336"
                        : "#757575",
                  }}
                >
                  {selectedDetail.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarModal;

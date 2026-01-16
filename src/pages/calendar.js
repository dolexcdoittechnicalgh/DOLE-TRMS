import React, { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FaPlus, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./calendar.css";
import CalendarModal from "./Modal";
import FormModal from "./FormModal";
import { CalendarFooter, CalendarHeader } from "./CalendarFunctions";
import { fetchCalendarEvents } from "../api";
import { useAppContext } from "../contexts/ContextProvider";

const localizer = momentLocalizer(moment);

const CustomToolbar = ({ label, onNavigate, onRequestTravel }) => {
  return (
    <div className="calendar-header">
      <div className="header-container">
        <div className="month-navigation">
          <button className="nav-btn" onClick={() => onNavigate("PREV")}>
            <FaChevronLeft />
          </button>
          <span className="month-display">{label}</span>
          <button className="nav-btn" onClick={() => onNavigate("NEXT")}>
            <FaChevronRight />
          </button>
        </div>
        <span className="calendar-title-text ">Calendar of Activities</span>
        <Button 
          className="add-btn" 
          onClick={onRequestTravel}
          startIcon={<FaPlus />}
          sx={{
            textTransform: "none",
            gap: 1,
          }}
        >
          Request Travel
        </Button>
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [calendarHeight, setCalendarHeight] = useState(500);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { darkMode, toggleDarkMode } = useAppContext();

  // Handle responsive breakpoints - matching your CSS breakpoints
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 570);
      setIsTablet(window.innerWidth > 570 && window.innerWidth <= 1024);
      
      // Calculate calendar height based on viewport
      const viewportHeight = window.innerHeight;
      const headerHeight = viewportHeight * 0.13;
      const footerHeight = 35; // Fixed footer height (reduced to half)
      const padding = 45; // Reduced padding to match footer height
      const availableHeight = viewportHeight - headerHeight - footerHeight - padding;
      
      if (window.innerWidth <= 570) {
        setCalendarHeight(Math.max(350, availableHeight * 0.7));
      } else if (window.innerWidth <= 1024) {
        setCalendarHeight(Math.max(400, availableHeight * 0.75));
      } else {
        setCalendarHeight(Math.max(500, availableHeight * 0.8));
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetchCalendarEvents();
        const rawEvents = response.data;

        const transformedEvents = rawEvents.map((item) => {
          const { type, record, employees } = item;

          const employeeNames = employees
            .map((emp) => `${emp.first_name} ${emp.last_name}`)
            .join(", ");

          const title = `${type} - ${employeeNames}`;

          let start, end;

          if (type === "TO") {
            start = new Date(record.travel_from);
            end = new Date(record.travel_to);
          } else if (type === "PS") {
            start = new Date(record.time_start);
            end = new Date(record.time_end);
          } else {
            start = new Date(record.departure_date);
            end = new Date(record.expected_return);
          }

          return {
            title,
            start,
            end,
            allDay: false,
            status: record.status || "Pending",
            resource: item,
          };
        });

        setEvents(transformedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    loadEvents();
  }, []);

  const closeDayModal = () => setSelectedDayEvents([]);
  const handleEventClick = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);
  
  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  
  const handleRequestTravel = () => {
    setFormModalOpen(true);
  };
  
  const handleFormSuccess = () => {
    // Reload events after successful form submission
    loadEvents();
  };
  
  const loadEvents = async () => {
    try {
      const response = await fetchCalendarEvents();
      const rawEvents = response.data;

      const transformedEvents = rawEvents.map((item) => {
        const { type, record, employees } = item;

        const employeeNames = employees
          .map((emp) => `${emp.first_name} ${emp.last_name}`)
          .join(", ");

        const title = `${type} - ${employeeNames}`;

        let start, end;

        if (type === "TO") {
          start = new Date(record.travel_from);
          end = new Date(record.travel_to);
        } else if (type === "PS") {
          start = new Date(record.time_start);
          end = new Date(record.time_end);
        } else {
          start = new Date(record.departure_date);
          end = new Date(record.expected_return);
        }

        return {
          title,
          start,
          end,
          allDay: false,
          status: record.status || "Pending",
          resource: item,
        };
      });

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
    }
  };

  // Move "+X more" links to date cell beside day number
  useEffect(() => {
    const moveShowMoreLinks = () => {
      // Get the current month from the calendar toolbar label
      const monthLabel = document.querySelector(".month-display");
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      
      if (monthLabel) {
        const labelText = monthLabel.textContent.trim();
        // Parse "January 2026" format
        const monthMatch = labelText.match(/(\w+)\s+(\d{4})/);
        if (monthMatch) {
          const monthNames = ["January", "February", "March", "April", "May", "June",
                             "July", "August", "September", "October", "November", "December"];
          const monthName = monthMatch[1];
          currentMonth = monthNames.indexOf(monthName);
          currentYear = parseInt(monthMatch[2], 10);
        }
      }

      // Find all "+X more" links (check all, not just unmoved ones, to handle re-renders)
      const showMoreLinks = document.querySelectorAll(".rbc-show-more");
      
      showMoreLinks.forEach((link) => {
        // Get the href which contains date info (format: #YYYY-MM-DD)
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const dateStr = href.substring(1); // Remove the #
        try {
          const linkDate = new Date(dateStr);
          
          if (isNaN(linkDate.getTime())) return;

          // Find all date cells
          const dateCells = document.querySelectorAll(".rbc-date-cell");
          
          dateCells.forEach((dateCell) => {
            // Get the day number from the date cell
            const dayNumberEl = dateCell.querySelector(".rbc-day-number");
            let dayNumberText = "";
            
            if (dayNumberEl) {
              dayNumberText = dayNumberEl.textContent.trim();
            } else {
              // Fallback: get day number from text content
              dayNumberText = dateCell.textContent.trim().match(/^\d+/)?.[0] || "";
            }
            
            const dayNum = parseInt(dayNumberText, 10);
            if (isNaN(dayNum)) return;

            // Create date for this cell
            const cellDate = new Date(currentYear, currentMonth, dayNum);
            
            // Check if dates match
            if (
              cellDate.getFullYear() === linkDate.getFullYear() &&
              cellDate.getMonth() === linkDate.getMonth() &&
              cellDate.getDate() === linkDate.getDate()
            ) {
              // Check if link is not already in this cell
              if (!dateCell.contains(link)) {
                // Remove from current parent if it has one (to avoid duplicates)
                if (link.parentNode && link.parentNode !== dateCell) {
                  link.parentNode.removeChild(link);
                }
                // Mark as moved
                link.setAttribute("data-moved", "true");
                // Move to date cell - append after all content
                dateCell.appendChild(link);
              }
            }
          });
        } catch (error) {
          console.error("Error moving show more link:", error);
        }
      });
    };

    // Use MutationObserver to watch for calendar updates
    const calendarContainer = document.querySelector(".rbc-calendar");
    if (calendarContainer) {
      let timer;
      const observer = new MutationObserver(() => {
        // Debounce to avoid too many calls
        clearTimeout(timer);
        timer = setTimeout(() => {
          moveShowMoreLinks();
        }, 200);
      });

      observer.observe(calendarContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style'],
      });

      // Initial move with multiple attempts to ensure calendar is rendered
      const initialTimer1 = setTimeout(() => {
        moveShowMoreLinks();
      }, 300);
      
      const initialTimer2 = setTimeout(() => {
        moveShowMoreLinks();
      }, 800);
      
      const initialTimer3 = setTimeout(() => {
        moveShowMoreLinks();
      }, 1500);

      return () => {
        clearTimeout(timer);
        clearTimeout(initialTimer1);
        clearTimeout(initialTimer2);
        clearTimeout(initialTimer3);
        observer.disconnect();
      };
    }
  }, [events, currentDate]);

  // Handle "+X more" overflow links - intercept clicks and open modal
  useEffect(() => {
    const handleOverflowClick = (e) => {
      const target = e.target;
      // Check if it's a "+X more" link
      const link = target.classList.contains("rbc-show-more") 
        ? target 
        : target.closest(".rbc-show-more");
      
      if (link) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the href which contains the date info (format: #YYYY-MM-DD)
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          const dateStr = href.substring(1); // Remove the #
          const clickedDate = new Date(dateStr);
          
          if (!isNaN(clickedDate.getTime())) {
            const eventsForDay = events.filter((event) => {
              const eventDate = new Date(event.start);
              return (
                eventDate.getFullYear() === clickedDate.getFullYear() &&
                eventDate.getMonth() === clickedDate.getMonth() &&
                eventDate.getDate() === clickedDate.getDate()
              );
            });
            
            // Always open modal, even if empty
            setSelectedDayEvents(eventsForDay);
          }
        } else {
          // Fallback: find the parent day cell
          const dateCell = link.closest(".rbc-date-cell");
          if (dateCell) {
            const dayNumberEl = dateCell.querySelector(".rbc-day-number");
            if (dayNumberEl) {
              const dayNum = parseInt(dayNumberEl.textContent.trim(), 10);
              const monthLabel = document.querySelector(".month-display");
              let currentMonth = new Date().getMonth();
              let currentYear = new Date().getFullYear();
              
              if (monthLabel) {
                const labelText = monthLabel.textContent.trim();
                const monthMatch = labelText.match(/(\w+)\s+(\d{4})/);
                if (monthMatch) {
                  const monthNames = ["January", "February", "March", "April", "May", "June",
                                     "July", "August", "September", "October", "November", "December"];
                  const monthName = monthMatch[1];
                  currentMonth = monthNames.indexOf(monthName);
                  currentYear = parseInt(monthMatch[2], 10);
                }
              }
              
              const clickedDate = new Date(currentYear, currentMonth, dayNum);
              if (!isNaN(clickedDate.getTime())) {
                const eventsForDay = events.filter((event) => {
                  const eventDate = new Date(event.start);
                  return (
                    eventDate.getFullYear() === clickedDate.getFullYear() &&
                    eventDate.getMonth() === clickedDate.getMonth() &&
                    eventDate.getDate() === clickedDate.getDate()
                  );
                });
                
                // Always open modal, even if empty
                setSelectedDayEvents(eventsForDay);
              }
            }
          }
        }
      }
    };

    const calendarContainer = document.querySelector(".rbc-calendar");
    if (calendarContainer) {
      calendarContainer.addEventListener("click", handleOverflowClick, true);
      return () => {
        calendarContainer.removeEventListener("click", handleOverflowClick, true);
      };
    }
  }, [events]);

  // Add direct click handlers to date cells for better mobile support
  useEffect(() => {
    const handleDateCellClick = (e) => {
      // Don't trigger if clicking on an event or show-more link
      if (e.target.closest('.rbc-event') || e.target.closest('.rbc-show-more')) {
        return;
      }

      const dateCell = e.target.closest('.rbc-date-cell');
      if (!dateCell) return;

      const dayNumberEl = dateCell.querySelector(".rbc-day-number");
      if (!dayNumberEl) return;

      const dayNum = parseInt(dayNumberEl.textContent.trim(), 10);
      if (isNaN(dayNum)) return;

      // Get current month/year from calendar
      const monthLabel = document.querySelector(".month-display");
      let currentMonth = new Date().getMonth();
      let currentYear = new Date().getFullYear();
      
      if (monthLabel) {
        const labelText = monthLabel.textContent.trim();
        const monthMatch = labelText.match(/(\w+)\s+(\d{4})/);
        if (monthMatch) {
          const monthNames = ["January", "February", "March", "April", "May", "June",
                             "July", "August", "September", "October", "November", "December"];
          const monthName = monthMatch[1];
          currentMonth = monthNames.indexOf(monthName);
          currentYear = parseInt(monthMatch[2], 10);
        }
      }

      const clickedDate = new Date(currentYear, currentMonth, dayNum);
      
      const eventsForDay = events.filter((event) => {
        const eventDate = new Date(event.start);
        return (
          eventDate.getFullYear() === clickedDate.getFullYear() &&
          eventDate.getMonth() === clickedDate.getMonth() &&
          eventDate.getDate() === clickedDate.getDate()
        );
      });

      // Always open modal, even if empty
      setSelectedDayEvents(eventsForDay);
    };

    const calendarContainer = document.querySelector(".rbc-calendar");
    if (calendarContainer) {
      calendarContainer.addEventListener("click", handleDateCellClick, true);
      return () => {
        calendarContainer.removeEventListener("click", handleDateCellClick, true);
      };
    }
  }, [events]);

  const eventPropGetter = (event) => {
    let className = "";
    if (event.status === "Pending") className = "pending";
    if (event.status === "Approved") className = "approved";
    if (event.status === "Declined") className = "declined";
    return { className };
  };

  const handleDayClick = (slotInfo) => {
    const clickedDate = slotInfo.start;

    const eventsForDay = events.filter((event) => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getFullYear() === clickedDate.getFullYear() &&
        eventDate.getMonth() === clickedDate.getMonth() &&
        eventDate.getDate() === clickedDate.getDate()
      );
    });

    // Always open the modal, even if there are no events
    setSelectedDayEvents(eventsForDay);
  };

  // Responsive calendar height - use state value
  const getCalendarHeight = () => {
    return calendarHeight;
  };

  // Responsive calendar views
  const getCalendarViews = () => {
    if (isMobile) {
      return ["month", "agenda"];
    }
    return ["month", "week", "day", "agenda"];
  };

  // Responsive default view
  const getDefaultView = () => {
    return isMobile ? "month" : "month";
  };

  const calendarStyle = {
    height: getCalendarHeight(),
    fontSize: isMobile ? "12px" : "14px",
  };

  return (
    <Box className={`calendar ${darkMode ? "dark-mode" : ""}`}>
      <div className="calendar-container">
        <div className="calendar-header-container">
        </div>

        <CalendarHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

        <div className="scrollable-container">
          <Container className="calendar-content" maxWidth={false}>
            <div className="legends-container">
              <div className={`legend ${darkMode ? "dark-mode" : ""}`}>
                <div className="legend-header">
                  <span className="legend-title">LEGENDS:</span>
                  <div className="legend-items-wrapper">
                    <div className="legend-item">
                      <span className="legend-color approved"></span>
                      <span className="legend-text">Approved</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color pending"></span>
                      <span className="legend-text">Pending</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color declined"></span>
                      <span className="legend-text">Declined</span>
                    </div>
                  </div>
                </div>
                <div className="note">
                  <p>
                    <strong>Note:</strong>{" "}
                    <span className="note-text">
                      To request a travel order or official business, kindly click
                      the "+" button to proceed.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="calendar-wrapper">
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={calendarStyle}
                selectable
                onSelectSlot={handleDayClick}
                onSelectEvent={handleEventClick}
                views={getCalendarViews()}
                defaultView={getDefaultView()}
                popup={false}
                popupOffset={isMobile ? { x: 10, y: 10 } : undefined}
                components={{
                  toolbar: (props) => <CustomToolbar {...props} onRequestTravel={handleRequestTravel} />,
                  footer: CalendarFooter,
                }}
                eventPropGetter={(event) => {
                  let backgroundColor = "#3174ad"; // default blue
                  let className = "";
                  
                  const status = event.status?.toLowerCase() || "pending";
                  
                  if (status === "approved") {
                    backgroundColor = "#4caf50";
                    className = "approved";
                  } else if (status === "pending" || status === "pendingadmin") {
                    backgroundColor = "#ff9800";
                    className = "pending";
                  } else if (status === "declined") {
                    backgroundColor = "#f44336";
                    className = "declined";
                  }
                  
                  return {
                    style: {
                      fontSize: isMobile ? "10px" : "11px",
                      padding: isMobile ? "1px 2px" : "2px 4px",
                      lineHeight: isMobile ? "1.2" : "1.4",
                      backgroundColor: backgroundColor,
                      borderColor: backgroundColor,
                      color: "#fff",
                    },
                    className: className,
                  };
                }}
                dayLayoutAlgorithm="no-overlap"
                step={60}
                showMultiDayTimes={!isMobile}
                rtl={false}
                formats={{
                  dayHeaderFormat: isMobile ? "ddd" : "dddd",
                  dayRangeHeaderFormat: ({ start, end }, culture, localizer) => {
                    if (isMobile) {
                      return (
                        localizer.format(start, "MMM DD", culture) +
                        " - " +
                        localizer.format(end, "MMM DD", culture)
                      );
                    }
                    return (
                      localizer.format(start, "MMMM DD", culture) +
                      " - " +
                      localizer.format(end, "MMMM DD", culture)
                    );
                  },
                  monthHeaderFormat: isMobile ? "MMM YYYY" : "MMMM YYYY",
                }}
              />
            </div>
          </Container>
        </div>

        {selectedEvent && (
          <CalendarModal events={[selectedEvent]} onClose={closeModal} />
        )}
        {selectedDayEvents.length > 0 && (
          <CalendarModal
            events={selectedDayEvents}
            onClose={closeDayModal}
            isMultiple
          />
        )}
        <FormModal
          open={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          onSuccess={handleFormSuccess}
        />
        <CalendarFooter />
      </div>
    </Box>
  );
};

export default CalendarPage;

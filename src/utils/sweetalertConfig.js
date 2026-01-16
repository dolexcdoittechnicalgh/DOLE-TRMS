import Swal from "sweetalert2";

// Elegant and professional SweetAlert2 configuration
const sweetAlertConfig = {
  // Custom styling
  customClass: {
    popup: "swal2-popup-elegant",
    title: "swal2-title-elegant",
    htmlContainer: "swal2-html-container-elegant",
    confirmButton: "swal2-confirm-elegant",
    cancelButton: "swal2-cancel-elegant",
    denyButton: "swal2-deny-elegant",
    input: "swal2-input-elegant",
    validationMessage: "swal2-validation-message-elegant",
  },
  
  // Default settings
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
  showClass: {
    popup: "swal2-show-elegant",
    backdrop: "swal2-backdrop-show",
  },
  hideClass: {
    popup: "swal2-hide-elegant",
    backdrop: "swal2-backdrop-hide",
  },
  
  // Button defaults
  confirmButtonText: "Confirm",
  cancelButtonText: "Cancel",
  confirmButtonColor: "#1976d2",
  cancelButtonColor: "#757575",
  
  // Typography
  fontFamily: '"Poppins", sans-serif',
  
  // Animation
  animation: true,
  timer: null,
  timerProgressBar: false,
};

// Apply global configuration
Swal.mixin(sweetAlertConfig);

// Export configured Swal instance
export default Swal;

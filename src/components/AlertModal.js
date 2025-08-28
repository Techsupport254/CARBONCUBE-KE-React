// AlertModal.js
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './AlertModal.css';

const AlertModal = ({
  isVisible,
  message,
  onClose = () => {},
  loading = false,
  icon = 'warning',
  title = 'Alert',
  confirmText = 'OK',
  cancelText = 'Close',
  onConfirm = null,
  showCancel = true
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      Swal.fire({
        icon,
        title,
        html: loading
          ? '<div class="text-center"><div class="swal2-spinner"></div><p>Loading...</p></div>'
          : `<h5 class="mb-0">${message}</h5>`,
        confirmButtonText: confirmText,
        showCancelButton: showCancel,
        cancelButtonText: cancelText,
        customClass: {
          popup: 'futuristic-swal rounded-4 glass-bg',
          title: 'fw-semibold text-white',
          htmlContainer: 'text-light',
          actions: 'futuristic-actions',
          confirmButton: 'btn rounded-pill futuristic-confirm',
          cancelButton: 'btn rounded-pill futuristic-cancel',
        },
        backdrop: 'rgba(0, 0, 0, 0.6)',
        buttonsStyling: false,
        allowOutsideClick: true,
      }).then((result) => {
        Swal.close();
        document.querySelectorAll('.swal2-container, .swal2-backdrop, .futuristic-swal')
          .forEach(el => el.remove());

        document.body.classList.remove('swal2-shown', 'swal2-height-auto');
        document.body.style.paddingRight = '';
        document.body.style.overflow = '';

        if (result.isConfirmed) {
          if (onConfirm) {
            onConfirm();
          }
        }

        onClose(); // Always reset isVisible to false
      });
    }
  }, [
    isVisible,
    message,
    onClose,
    loading,
    icon,
    title,
    confirmText,
    cancelText,
    showCancel,
    onConfirm,
    navigate,
  ]);

  return null;
};

export default AlertModal;

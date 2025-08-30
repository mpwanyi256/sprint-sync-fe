import { toast } from 'react-toastify';

export const showToast = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning'
) => {
  toast[type](message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const apiSuccess = (message: string) => {
  showToast(message, 'success');
};

export const apiError = (message: string) => {
  showToast(message, 'error');
};

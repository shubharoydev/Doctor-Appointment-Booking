import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

function ToastNotification({ isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = 'OK', showCancel = false }) {
  useEffect(() => {
    if (!isOpen) return;

    const toastOptions = {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      theme: "light",
      toastId: title, // Prevent duplicate toasts
    };

    const renderContent = () => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${getColor()}`}>
            {getIcon()}
          </span>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-gray-700">{message}</p>
        <div className="flex gap-2 mt-2 justify-end">
          {showCancel && (
            <button
              onClick={() => {
                toast.dismiss(title);
                onClose();
              }}
              className="bg-gray-500 text-white py-1 px-3 rounded hover:bg-gray-600 text-sm"
            >
              Cancel
            </button>
          )}
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              toast.dismiss(title);
              onClose();
            }}
            className={`py-1 px-3 rounded text-white text-sm ${
              type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    );

    toast(renderContent, toastOptions);

    return () => {
      toast.dismiss(title);
    };
  }, [isOpen, title, message, type, onConfirm, confirmText, showCancel, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '❌';
      default:
        return 'ℹ';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return <ToastContainer />;
}

export default ToastNotification;
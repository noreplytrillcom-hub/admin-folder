import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = "info", title, message, duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message, title = "Success") => {
    addToast({ type: "success", title, message });
  }, [addToast]);

  const error = useCallback((message, title = "Error Occurred") => {
    addToast({ type: "error", title, message });
  }, [addToast]);

  const info = useCallback((message, title = "Notice") => {
    addToast({ type: "info", title, message });
  }, [addToast]);

  const warning = useCallback((message, title = "Warning") => {
    addToast({ type: "warning", title, message });
  }, [addToast]);

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={18} className={styles.iconSuccess} />;
      case "error":
        return <AlertCircle size={18} className={styles.iconError} />;
      case "warning":
        return <AlertTriangle size={18} className={styles.iconWarning} />;
      default:
        return <Info size={18} className={styles.iconInfo} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container */}
      <div className={styles.toastContainer} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toastItem} ${styles[`toast_${t.type}`]}`}>
            <div className={styles.toastIconWrapper}>{getIcon(t.type)}</div>
            <div className={styles.toastContent}>
              {t.title && <h4 className={styles.toastTitle}>{t.title}</h4>}
              <p className={styles.toastMessage}>{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className={styles.toastCloseBtn}
              title="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

import { useToast } from "../../../context/ToastContext";
import "./Toast.scss";

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="alert">
          <span>{toast.message}</span>
          <button className="toast__close" onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">×</button>
        </div>
      ))}
    </div>
  );
}

import {
  designClasses,
} from "../styles/designTokens";

const NotificationBanner = ({
  message,
  type = "success",
  onClose,
}) => {
  if (!message) {
    return null;
  }

  const statusClass =
    type === "error"
      ? designClasses.statusError
      : type === "warning"
      ? designClasses.statusWarning
      : designClasses.statusSuccess;

  return (
    <div
      className={`flex items-start justify-between gap-4 rounded-xl p-4 text-sm ${statusClass}`}
      role={
        type === "error"
          ? "alert"
          : "status"
      }
    >
      <span>
        {message}
      </span>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 font-semibold"
          aria-label="Dismiss notification"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
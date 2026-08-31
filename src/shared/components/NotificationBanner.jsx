import {
  designClasses,
} from "../styles/designTokens";

const NotificationBanner = ({
  message,
  type = "success",
  actionLabel = "",
  onAction,
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
      <div className="min-w-0 flex-1">
        <span>
          {message}
        </span>

        {actionLabel &&
          onAction && (
          <button
            type="button"
            onClick={onAction}
            className="ml-3 inline-flex font-semibold underline underline-offset-2"
          >
            {actionLabel}
          </button>
        )}
      </div>

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
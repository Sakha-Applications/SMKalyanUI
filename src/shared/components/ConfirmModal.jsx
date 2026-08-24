import {
  designClasses,
} from "../styles/designTokens";

const ConfirmModal = ({
  open,
  title,
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div
        className={`w-full max-w-md ${designClasses.card} p-5 sm:p-6`}
      >
        <h2
          id="confirm-modal-title"
          className={`text-lg font-semibold ${designClasses.textPrimary}`}
        >
          {title}
        </h2>

        {description && (
          <p
            className={`mt-2 text-sm ${designClasses.textSecondary}`}
          >
            {description}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.primaryButton}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
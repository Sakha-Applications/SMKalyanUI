import {
  useEffect,
  useState,
} from "react";

import {
  designClasses,
} from "../styles/designTokens";

const PromptModal = ({
  open,
  title,
  description = "",
  label = "Remarks",
  initialValue = "",
  placeholder = "",
  required = false,
  maxLength = 1000,
  confirmLabel = "Submit",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => {
  const [value, setValue] =
    useState(initialValue);

  useEffect(() => {
    if (open) {
      setValue(
        initialValue || ""
      );
    }
  }, [
    open,
    initialValue,
  ]);

  if (!open) {
    return null;
  }

  const normalizedValue =
    value.trim();

  const confirmDisabled =
    required &&
    !normalizedValue;

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    if (confirmDisabled) {
      return;
    }

    onConfirm?.(
      normalizedValue
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="prompt-modal-title"
    >
      <div
        className={`w-full max-w-lg ${designClasses.card} p-5 sm:p-6`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="prompt-modal-title"
              className={`text-lg font-semibold ${designClasses.textPrimary}`}
            >
              {title}
            </h2>

            {description && (
              <p
                className={`mt-1 text-sm ${designClasses.textSecondary}`}
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onCancel}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
          className="mt-5"
        >
          <label
            className={`block text-sm font-semibold ${designClasses.textPrimary}`}
          >
            {label}
            {required && (
              <span className="ml-1">
                *
              </span>
            )}
          </label>

          <textarea
            rows={5}
            autoFocus
            value={value}
            maxLength={
              maxLength
            }
            placeholder={
              placeholder
            }
            onChange={(
              event
            ) =>
              setValue(
                event.target
                  .value
              )
            }
            className={`mt-2 w-full rounded-lg border p-3 text-sm outline-none ${designClasses.border} ${designClasses.surface}`}
          />

          <div
            className={`mt-1 text-right text-xs ${designClasses.textSecondary}`}
          >
            {value.length}/
            {maxLength}
          </div>

          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={
                onCancel
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
            >
              {cancelLabel}
            </button>

            <button
              type="submit"
              disabled={
                confirmDisabled
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {confirmLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;
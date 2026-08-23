import React, {
  useEffect,
  useState,
} from "react";

import {
  designClasses,
} from "../styles/designTokens";


const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const ForwardProfileModal = ({
  open,
  profileName = "",
  profileId = "",
  submitting = false,
  onClose,
  onSubmit,
}) => {
  const [
    recipientEmail,
    setRecipientEmail,
  ] = useState("");

  const [
    senderMessage,
    setSenderMessage,
  ] = useState("");

  const [
    validationError,
    setValidationError,
  ] = useState("");


  useEffect(() => {
    if (!open) {
      return;
    }

    setRecipientEmail("");
    setSenderMessage("");
    setValidationError("");
  }, [open]);


  if (!open) {
    return null;
  }


  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    const normalizedEmail =
      String(
        recipientEmail || ""
      )
        .trim()
        .toLowerCase();

    if (!normalizedEmail) {
      setValidationError(
        "Recipient email is required."
      );

      return;
    }

    if (
      !EMAIL_PATTERN.test(
        normalizedEmail
      )
    ) {
      setValidationError(
        "Please enter a valid email address."
      );

      return;
    }

    setValidationError("");

    onSubmit({
      recipientEmail:
        normalizedEmail,

      senderMessage:
        String(
          senderMessage || ""
        ).trim(),
    });
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !submitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-5 shadow-xl sm:p-6 ${designClasses.border} ${designClasses.surface}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="forward-profile-title"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="forward-profile-title"
              className={`text-xl font-bold ${designClasses.textPrimary}`}
            >
              Forward Profile
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Securely share this matrimonial
              profile by email.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className={`rounded-lg px-3 py-2 text-lg leading-none ${designClasses.secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div
          className={`mt-5 rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
        >
          <div
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Sharing
          </div>

          <div
            className={`mt-1 font-semibold ${designClasses.textPrimary}`}
          >
            {profileName ||
              "Matrimonial Profile"}
          </div>

          <div
            className={`mt-1 text-xs ${designClasses.textSecondary}`}
          >
            Profile ID:{" "}
            {profileId || "-"}
          </div>
        </div>

        <form
          className="mt-5 space-y-4"
          onSubmit={
            handleSubmit
          }
        >
          <div>
            <label
              htmlFor="forward-recipient-email"
              className={`mb-1.5 block text-sm font-semibold ${designClasses.textPrimary}`}
            >
              Recipient Email
            </label>

            <input
              id="forward-recipient-email"
              type="email"
              value={
                recipientEmail
              }
              onChange={(event) => {
                setRecipientEmail(
                  event.target.value
                );

                if (
                  validationError
                ) {
                  setValidationError(
                    ""
                  );
                }
              }}
              placeholder="name@example.com"
              autoComplete="email"
              disabled={submitting}
              className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none ${designClasses.border} ${designClasses.surface} ${designClasses.textPrimary} disabled:cursor-not-allowed disabled:opacity-60`}
            />
          </div>

          <div>
            <label
              htmlFor="forward-sender-message"
              className={`mb-1.5 block text-sm font-semibold ${designClasses.textPrimary}`}
            >
              Message{" "}
              <span
                className={`font-normal ${designClasses.textSecondary}`}
              >
                (optional)
              </span>
            </label>

            <textarea
              id="forward-sender-message"
              rows={4}
              maxLength={1000}
              value={
                senderMessage
              }
              onChange={(event) =>
                setSenderMessage(
                  event.target.value
                )
              }
              placeholder="Add a short personal message..."
              disabled={submitting}
              className={`w-full resize-y rounded-lg border px-3 py-2.5 text-sm outline-none ${designClasses.border} ${designClasses.surface} ${designClasses.textPrimary} disabled:cursor-not-allowed disabled:opacity-60`}
            />

            <div
              className={`mt-1 text-right text-xs ${designClasses.textSecondary}`}
            >
              {
                senderMessage
                  .length
              }
              /1000
            </div>
          </div>

          {validationError && (
            <div
              className={`rounded-lg p-3 text-sm ${designClasses.statusError}`}
              role="alert"
            >
              {validationError}
            </div>
          )}

          <div
            className={`rounded-lg p-3 text-xs ${designClasses.statusReview}`}
          >
            Only a safe profile summary and
            secure Kalyana Sakha link will be
            emailed. Protected phone numbers,
            email addresses and residential
            addresses are not forwarded.
          </div>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {submitting
                ? "Forwarding..."
                : "Forward Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


export default ForwardProfileModal;
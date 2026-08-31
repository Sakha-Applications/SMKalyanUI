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

  creditSummary = null,
  actionCost = null,
  showCreditSummary = false,
  onRecharge,

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
  const numericActionCost =
    Number(
      actionCost || 0
    );

  const availableBalance =
    Number(
      creditSummary?.balance ||
      0
    );

  const balanceAfterAction =
    Math.max(
      0,
      availableBalance -
        numericActionCost
    );

  const lowCreditThreshold =
    Number(
      creditSummary
        ?.lowCreditThreshold ||
      0
    );

  const insufficientCredits =
    showCreditSummary &&
    numericActionCost >
      availableBalance;

  const willBeLowCredit =
    showCreditSummary &&
    balanceAfterAction <=
      lowCreditThreshold;

  const confirmDisabled =
    (
      required &&
      !normalizedValue
    ) ||
    insufficientCredits;

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
            {showCreditSummary &&
              creditSummary && (
              <div
                className={`mt-4 rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
              >
                {numericActionCost > 0 ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={
                          designClasses.textSecondary
                        }
                      >
                        Action Cost
                      </span>

                      <span
                        className={`font-semibold ${designClasses.textPrimary}`}
                      >
                        {numericActionCost} credits
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={
                          designClasses.textSecondary
                        }
                      >
                        Available Credits
                      </span>

                      <span
                        className={`font-semibold ${designClasses.textPrimary}`}
                      >
                        {availableBalance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span
                        className={
                          designClasses.textSecondary
                        }
                      >
                        Balance After Action
                      </span>

                      <span
                        className={`font-semibold ${designClasses.textPrimary}`}
                      >
                        {balanceAfterAction}
                      </span>
                    </div>

                    {insufficientCredits && (
                      <div
                        className={`mt-3 rounded-lg p-3 ${designClasses.statusWarning}`}
                      >
                        <div className="font-semibold">
                          Insufficient Credits
                        </div>

                        <div className="mt-1">
                          You need{" "}
                          {numericActionCost} credits
                          for this action, but only{" "}
                          {availableBalance} credits
                          are available.
                        </div>

                        {onRecharge && (
                          <button
                            type="button"
                            onClick={
                              onRecharge
                            }
                            className="mt-2 font-semibold underline underline-offset-2"
                          >
                            Recharge Credits
                          </button>
                        )}
                      </div>
                    )}

                    {!insufficientCredits &&
                      willBeLowCredit && (
                        <div
                          className={`mt-3 rounded-lg p-3 ${designClasses.statusWarning}`}
                        >
                          Your balance will be{" "}
                          {balanceAfterAction}{" "}
                          credits after this action.
                          The current low-credit
                          reminder level is{" "}
                          {lowCreditThreshold}.
                        </div>
                      )}
                  </div>
                ) : (
                  <div
                    className={`text-sm font-semibold ${designClasses.textPrimary}`}
                  >
                    No credits will be charged
                    for this action.
                  </div>
                )}
              </div>
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
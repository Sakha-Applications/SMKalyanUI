import {
  useEffect,
  useState,
} from "react";

import {
  MenuItem,
  TextField,
} from "@mui/material";

import MemberLayout from "../../shared/layouts/MemberLayout";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import profileService from "../../services/profileService";
import offlinePaymentService from "../../services/offlinePaymentService";
import creditService from "../../services/creditService";

import LowCreditNotice from "../../shared/components/LowCreditNotice";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const RechargeContactViewsPage = () => {
  const [
    memberLoading,
    setMemberLoading,
  ] = useState(true);

  const [
    memberError,
    setMemberError,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitError,
    setSubmitError,
  ] = useState("");

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  const [
    rechargeHistory,
    setRechargeHistory,
  ] = useState([]);

  const [
    creditSummary,
    setCreditSummary,
  ] = useState(null);

  const [
    creditLoading,
    setCreditLoading,
  ] = useState(true);

  const [
    creditError,
    setCreditError,
  ] = useState("");

  const [
    formData,
    setFormData,
  ] = useState({
    profileId: "",
    memberName: "",
    email: "",
    phoneNumber: "",
    amount: "",
    paymentMethod: "UPI",
    paymentReference: "",
    transactionDetails: "",
  });
  const loadCreditSummary =
    async () => {
      setCreditLoading(true);
      setCreditError("");

      try {
        const summary =
          await creditService
            .getMyCreditSummary();

        setCreditSummary(
          summary
        );
      } catch (error) {
        console.error(
          "Unable to load credit summary:",
          error
        );

        setCreditError(
          error?.response
            ?.data?.message ||
          "We could not load your credit balance."
        );
      } finally {
        setCreditLoading(false);
      }
    };
  const loadRechargeHistory =
    async () => {
      setHistoryLoading(true);

      try {
        const history =
          await offlinePaymentService.getPaymentHistoryByType(
            "ProfileRenewal"
          );

        setRechargeHistory(
          Array.isArray(history)
            ? history
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load recharge history:",
          error
        );

        setRechargeHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    };

  useEffect(() => {
    let active = true;

    const loadMember = async () => {
      setMemberLoading(true);
      setMemberError("");

      try {
        const profile =
          await profileService.getMyProfile();

        if (!active) {
          return;
        }

        setFormData(
          (previous) => ({
            ...previous,

            profileId:
              profile?.profile_id ||
              profile?.profileId ||
              sessionStorage.getItem(
                "profileId"
              ) ||
              "",

            memberName:
              profile?.name || "",

            email:
              profile?.email ||
              profile?.email_id ||
              sessionStorage.getItem(
                "userEmail"
              ) ||
              "",

            phoneNumber:
              profile?.phone ||
              profile?.phoneNumber ||
              profile?.phone_number ||
              "",
          })
        );
      } catch (error) {
        console.error(
          "Unable to load member for recharge:",
          error
        );

        if (
          error?.response?.status ===
          401
        ) {
          setMemberError(
            "Your session has expired. Please log in again."
          );

          return;
        }

        setMemberError(
          "We could not load your member information."
        );
      } finally {
        if (active) {
          setMemberLoading(false);
        }
      }
    };

    loadMember();
    loadRechargeHistory();
    loadCreditSummary();

    return () => {
      active = false;
    };
  }, []);
  const expectedCredits =
    creditService
      .calculateCreditsForAmount(
        formData.amount,
        creditSummary
      );

  const currentCreditBalance =
    Number(
      creditSummary
        ?.balance ||
      0
    );

  const projectedCreditBalance =
    currentCreditBalance +
    expectedCredits;
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous) => ({
        ...previous,
        [name]: value,
      })
    );

    setSubmitError("");
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    setSubmitError("");
    setSubmitted(false);

    if (
      !formData.profileId ||
      !formData.memberName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.paymentReference
    ) {
      setSubmitError(
        "Please complete all required fields."
      );

      return;
    }

    const rechargeAmount =
      Number(
        formData.amount
      );

    if (
      !Number.isFinite(
        rechargeAmount
      ) ||
      rechargeAmount <= 0
    ) {
      setSubmitError(
        "Please enter a valid recharge amount."
      );

      return;
    }

    if (
      expectedCredits <= 0
    ) {
      setSubmitError(
        "The entered amount does not generate any credit points under the current recharge configuration."
      );

      return;
    }

    setSubmitting(true);

    try {
      await offlinePaymentService.submitPayment(
        {
          paymentType: "ProfileRenewal",

          profile_id:
            formData.profileId,

          amount:
            formData.amount,

          payment_method:
            "Offline",

          payment_mode:
            formData.paymentMethod,

          payment_reference:
            formData.paymentReference,

          payment_date:
            new Date()
              .toISOString()
              .split("T")[0],

          payment_time:
            new Date()
              .toTimeString()
              .split(" ")[0],

          phone_number:
            formData.phoneNumber,

          email:
            formData.email,

          transactionDetails:
            formData.transactionDetails,
        }
      );

      setSubmitted(true);

      setFormData(
        (previous) => ({
          ...previous,
          amount: "",
          paymentReference: "",
          transactionDetails: "",
        })
      );

      await Promise.all([
        loadRechargeHistory(),
        loadCreditSummary(),
      ]);
    } catch (error) {
      console.error(
        "Unable to submit recharge:",
        error
      );

      setSubmitError(
        error?.response?.data?.message ||
          "Unable to submit your recharge request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (memberLoading) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading recharge details...
          </p>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-4">
        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h1
            className={`text-xl font-semibold ${designClasses.textPrimary}`}
          >
            Recharge Credits
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Recharge your credit
            balance for matrimonial
            interactions. Credits are
            added only after your
            payment is verified.
          </p>
        </section>
        {!creditLoading &&
          creditSummary && (
          <LowCreditNotice
            creditSummary={
              creditSummary
            }
          />
        )}

        {creditError && (
          <section
            className={`rounded-xl p-4 text-sm ${designClasses.statusError}`}
            role="alert"
          >
            {creditError}
          </section>
        )}
        {memberError && (
          <section
            className={`rounded-xl p-4 text-sm ${designClasses.statusError}`}
            role="alert"
          >
            {memberError}
          </section>
        )}

        {submitted && (
          <section
            className={`${designClasses.statusSuccess} p-5`}
          >
            <h2
              className={designClasses.statusTitle}
            >
              Recharge request submitted
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.statusText}`}
            >
              Your payment details
              have been recorded and
              are pending verification.
              Credit points will be
              added to your balance
              after the payment is
              approved.
            </p>
          </section>
        )}

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
              >
                Available Credits
              </p>

              <p
                className={`mt-1 text-2xl font-bold ${designClasses.textPrimary}`}
              >
                {creditLoading
                  ? "..."
                  : currentCreditBalance}
              </p>
            </div>

            <div
              className={`hidden h-10 border-l sm:block ${designClasses.border}`}
            />

            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
              >
                Recharge Conversion
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${designClasses.textPrimary}`}
              >
                ₹
                {creditSummary
                  ?.recharge
                  ?.baseAmount ||
                  0}{" "}
                ={" "}
                {creditSummary
                  ?.recharge
                  ?.baseCredits ||
                  0}{" "}
                credits
              </p>
            </div>

            <div
              className={`hidden h-10 border-l sm:block ${designClasses.border}`}
            />

            <div>
              <p
                className={`text-xs font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
              >
                Low Credit Reminder
              </p>

              <p
                className={`mt-1 text-sm font-semibold ${designClasses.textPrimary}`}
              >
                {creditSummary
                  ?.lowCreditThreshold ||
                  0}{" "}
                credits
              </p>
            </div>
          </div>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-5">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Recharge Details
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Enter the payment
              reference after making
              the recharge payment
              through the approved
              payment channel.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                fullWidth
                size="small"
                label="Profile ID"
                value={
                  formData.profileId
                }
                disabled
              />

              <TextField
                fullWidth
                size="small"
                label="Member Name"
                name="memberName"
                value={
                  formData.memberName
                }
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Email"
                name="email"
                type="email"
                value={
                  formData.email
                }
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Phone Number"
                name="phoneNumber"
                value={
                  formData.phoneNumber
                }
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Recharge Amount"
                name="amount"
                type="number"
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                inputProps={{
                  min: 1,
                  step: 1,
                }}
                helperText={
                  formData.amount
                    ? `₹${formData.amount} will add approximately ${expectedCredits} credit points after payment verification.`
                    : `Enter the amount paid. Current conversion: ₹${creditSummary?.recharge?.baseAmount || 0} = ${creditSummary?.recharge?.baseCredits || 0} credits.`
                }
                required
              />

              <TextField
                select
                fullWidth
                size="small"
                label="Payment Mode"
                name="paymentMethod"
                value={
                  formData.paymentMethod
                }
                onChange={handleChange}
                required
              >
                <MenuItem value="UPI">
                  UPI
                </MenuItem>

                <MenuItem value="bank_transfer">
                  Bank Transfer
                </MenuItem>

                <MenuItem value="check">
                  Cheque / DD
                </MenuItem>
              </TextField>

              <TextField
                fullWidth
                size="small"
                label="Payment Reference"
                name="paymentReference"
                value={
                  formData.paymentReference
                }
                onChange={handleChange}
                placeholder="Transaction ID / reference"
                required
              />

              <TextField
                fullWidth
                size="small"
                label="Additional Details"
                name="transactionDetails"
                value={
                  formData.transactionDetails
                }
                onChange={handleChange}
                placeholder="Optional payment details"
              />
            </div>

            <div
              className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p
                    className={`text-sm font-semibold ${designClasses.textPrimary}`}
                  >
                    Expected Credit Addition
                  </p>

                  <p
                    className={`mt-1 text-sm ${designClasses.textSecondary}`}
                  >
                    {formData.amount
                      ? `₹${formData.amount} will add approximately ${expectedCredits} credits after payment verification.`
                      : "Enter the payment amount to see the expected credit addition."}
                  </p>
                </div>

                {formData.amount &&
                  expectedCredits >
                    0 && (
                  <div className="text-right">
                    <p
                      className={`text-xs ${designClasses.textSecondary}`}
                    >
                      Current balance
                    </p>

                    <p
                      className={`font-semibold ${designClasses.textPrimary}`}
                    >
                      {currentCreditBalance}
                      {" → "}
                      {projectedCreditBalance}
                    </p>
                  </div>
                )}
              </div>

              <p
                className={`mt-3 text-xs ${designClasses.textSecondary}`}
              >
                Credits are added only after
                the payment is verified.
              </p>
            </div>

            {submitError && (
              <div
                className={`rounded-xl p-3 text-sm ${designClasses.statusError}`}
                role="alert"
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                Boolean(memberError) ||
                creditLoading ||
                Boolean(creditError) ||
                !creditSummary
              }
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
            >
              {submitting
                ? "Submitting..."
                : "Submit Recharge Request"}
            </button>
          </form>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Recent Recharge Requests
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Review the status of your
              previously submitted
              recharge requests.
            </p>
          </div>

          {historyLoading ? (
            <p
              className={`text-sm ${designClasses.textSecondary}`}
            >
              Loading recharge history...
            </p>
          ) : rechargeHistory.length ===
            0 ? (
            <div
              className={`rounded-xl p-5 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
            >
              No recharge requests
              found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr
                    className={`border-b ${designClasses.border}`}
                  >
                    <th className="px-3 py-3 font-semibold">
                      Reference
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Amount
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Payment Mode
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Submitted
                    </th>

                    <th className="px-3 py-3 font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rechargeHistory.map(
                    (
                      payment,
                      index
                    ) => (
                      <tr
                        key={
                          payment.payment_id ||
                          payment.id ||
                          `${payment.payment_reference}-${index}`
                        }
                        className={`border-b ${designClasses.border}`}
                      >
                        <td className="px-3 py-3">
                          {payment.payment_reference ||
                            "-"}
                        </td>

                        <td className="px-3 py-3">
                          ₹
                          {payment.amount ||
                            "-"}
                        </td>

                        <td className="px-3 py-3">
                          {payment.payment_mode ||
                            payment.payment_method ||
                            "-"}
                        </td>

                        <td className="px-3 py-3">
                          {formatDate(
                            payment.created_at ||
                              payment.payment_date
                          )}
                        </td>

                        <td className="px-3 py-3 font-semibold">
                          {payment.status ||
                            "PENDING"}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </MemberLayout>
  );
};

export default RechargeContactViewsPage;
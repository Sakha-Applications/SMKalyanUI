import {
  useEffect,
  useState,
} from "react";

import {
  TextField,
} from "@mui/material";

import MemberLayout from "../../shared/layouts/MemberLayout";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import profileService from "../../services/profileService";
import offlinePaymentService from "../../services/offlinePaymentService";

const REGISTRATION_FEE_AMOUNT = "1000";

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

const RegistrationFeePaymentPage = () => {
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
    paymentHistory,
    setPaymentHistory,
  ] = useState([]);

  const [
    formData,
    setFormData,
  ] = useState({
    profileId: "",
    memberName: "",
    email: "",
    phoneNumber: "",
    amount: REGISTRATION_FEE_AMOUNT,
    paymentMethod: "UPI",
    paymentReference: "",
    transactionDetails: "",
  });

  const loadPaymentHistory =
    async () => {
      setHistoryLoading(true);

      try {
        const history =
          await offlinePaymentService.getPaymentHistoryByType(
            "Donation"
          );

        setPaymentHistory(
          Array.isArray(history)
            ? history
            : []
        );
      } catch (error) {
        console.error(
          "Unable to load registration payment history:",
          error
        );

        setPaymentHistory([]);
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
          "Unable to load member for registration payment:",
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
    loadPaymentHistory();

    return () => {
      active = false;
    };
  }, []);

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

    setSubmitting(true);

    try {
      await offlinePaymentService.submitPayment(
        {
          paymentType: "Donation",

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
          paymentReference: "",
          transactionDetails: "",
        })
      );

      await loadPaymentHistory();
    } catch (error) {
      console.error(
        "Unable to submit registration fee payment:",
        error
      );

      setSubmitError(
        error?.response?.data?.message ||
          "Unable to submit your payment details. Please try again."
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
            Loading payment details...
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
            Registration Fee Payment
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Submit your registration
            fee payment details for
            verification. Your profile
            listing will proceed after
            the payment is verified.
          </p>
        </section>

        {memberError && (
          <section
            className={`${designClasses.card} p-5`}
          >
            <p className="text-sm text-red-700">
              {memberError}
            </p>
          </section>
        )}

        {submitted && (
          <section
            className={`${designClasses.statusSuccess} p-5`}
          >
            <h2
              className={designClasses.statusTitle}
            >
              Payment details submitted
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.statusText}`}
            >
              Your registration fee
              payment has been recorded
              and is pending verification.
              Profile listing will proceed
              after approval.
            </p>
          </section>
        )}

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-5">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Payment Details
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Enter the payment
              reference after completing
              the payment through the
              approved payment channel.
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
                label="Registration Fee"
                value={`₹${formData.amount}`}
                disabled
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
              <p
                className={`text-sm ${designClasses.textSecondary}`}
              >
                Payment submission is
                subject to verification.
                Submitting this form does
                not immediately approve
                or list the profile.
              </p>
            </div>

            {submitError && (
              <p className="text-sm text-red-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={
                submitting ||
                Boolean(memberError)
              }
              className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
            >
              {submitting
                ? "Submitting..."
                : "Submit Payment Details"}
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
              Recent Registration Fee Payments
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Review your previously
              submitted registration
              payment requests.
            </p>
          </div>

          {historyLoading ? (
            <p
              className={`text-sm ${designClasses.textSecondary}`}
            >
              Loading payment history...
            </p>
          ) : paymentHistory.length ===
            0 ? (
            <div
              className={`rounded-xl p-5 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
            >
              No registration fee
              payments found.
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
                  {paymentHistory.map(
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

export default RegistrationFeePaymentPage;
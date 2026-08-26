import {
  useEffect,
  useState,
} from "react";

import {
  MenuItem,
  TextField,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import MemberLayout from "../../shared/layouts/MemberLayout";
import AdvertisementPreview from "../../shared/components/AdvertisementPreview";
import NotificationBanner from "../../shared/components/NotificationBanner";


import {
  designClasses,
} from "../../shared/styles/designTokens";

import profileService from "../../services/profileService";
import offlinePaymentService from "../../services/offlinePaymentService";
import apiClient from "../../services/apiClient";

const AdvertisementPaymentPage = () => {
  const navigate =
    useNavigate();
  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    notification,
    setNotification
  ] = useState({
    message: "",
    type: "success"
  });

  const showNotification = (
    message,
    type = "success"
  ) => {
    setNotification({
      message: String(message || ""),
      type
    });
  };
  const [
  contributionError,
  setContributionError
] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  const [
    advertisementDraft,
    setAdvertisementDraft
  ] = useState(null);

  const [
    minimumContribution,
    setMinimumContribution
  ] = useState(null);

  const [formData, setFormData] =
    useState({
      profileId: "",
      memberName: "",
      email: "",
      phoneNumber: "",
      amount: "",
      paymentMethod: "UPI",
      paymentReference: "",
      transactionDetails: "",
    });

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setLoading(true);
      setError("");

      try {
        const storedDraft =
          sessionStorage.getItem(
            "advertisementDraft"
          );

        if (!storedDraft) {
          setError(
            "Advertisement draft was not found. Please create your advertisement first."
          );

          return;
        }

        const draft =
          JSON.parse(storedDraft);

        const [
          profile,
          contributionResponse
        ] = await Promise.all([
          profileService.getMyProfile(),

          apiClient.get(
            "/preferred-profiles/minimum-contribution"
          )
        ]);

        if (!active) {
          return;
        }

        const configuredMinimum =
          Number(
            contributionResponse?.data
              ?.minimumContribution
          );

        if (
          !Number.isFinite(
            configuredMinimum
          ) ||
          configuredMinimum < 0
        ) {
          throw new Error(
            "Advertisement contribution has not been configured."
          );
        }

        setMinimumContribution(
          configuredMinimum
        );

        setContributionError("");

        setAdvertisementDraft(draft);

        setFormData((previous) => ({
          ...previous,

          profileId:
            draft?.profileId ||
            profile?.profile_id ||
            profile?.profileId ||
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

          amount:
            String(
              configuredMinimum
            ),
        }));
      } catch (err) {
        console.error(
          "Unable to prepare advertisement payment:",
          err
        );

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Unable to prepare advertisement payment.";

        setError(message);

        showNotification(
          message,
          "error"
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      active = false;
    };
  }, []);

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

    if (name === "amount") {
      const enteredAmount =
        Number(value);

      if (
        String(value).trim() === ""
      ) {
        setContributionError(
          "Please enter your advertisement contribution."
        );

        return;
      }

      if (
        !Number.isFinite(
          enteredAmount
        )
      ) {
        setContributionError(
          "Please enter a valid contribution amount."
        );

        return;
      }

      if (
        minimumContribution !== null &&
        enteredAmount <
          minimumContribution
      ) {
        setContributionError(
          `Minimum contribution is ₹${minimumContribution}. You may contribute ₹${minimumContribution} or any higher amount.`
        );

        return;
      }

      setContributionError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSubmitted(false);

    if (
      !advertisementDraft?.advertisementText?.trim()
    ) {
      setError(
        "Advertisement text is missing."
      );
      return;
    }

    if (
      !formData.profileId ||
      !formData.memberName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.paymentReference
    ) {
      setError(
        "Please complete all required fields."
      );

      return;
    }
    const contribution =
      Number(formData.amount);

    if (
      minimumContribution === null
    ) {
      setError(
        "Advertisement contribution configuration could not be loaded."
      );
      return;
    }

    if (
      !Number.isFinite(
        contribution
      ) ||
      contribution <
        minimumContribution
    ) {
      const message =
        `Minimum advertisement contribution is ₹${minimumContribution}. You may contribute ₹${minimumContribution} or any higher amount.`;

      setContributionError(
        message
      );

      setError(
        message
      );

      return;
    }
    setSubmitting(true);

    try {
      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const time =
        new Date()
          .toTimeString()
          .split(" ")[0];

      /*
       * Create the advertisement record FIRST.
       *
       * This prevents an orphan offline-payment
       * record when advertisement creation fails.
       */
      await apiClient.post(
        "/preferred-profiles",
        {
          profile_id:
            formData.profileId,

          email:
            formData.email,

          phone_number:
            formData.phoneNumber,

          member_name:
            formData.memberName,

          payment_amount:
            Number(
              formData.amount
            ),

          payment_method:
            formData.paymentMethod,

          payment_reference:
            formData.paymentReference,

          payment_date:
            today,

          payment_time:
            time,

          member_narrative:
            advertisementDraft.advertisementText,

          looking_for:
            advertisementDraft?.lookingFor ||
            null
        }
      );

      /*
       * Create the offline payment only after
       * the advertisement record exists.
       */
      await offlinePaymentService.submitPayment(
        {
          paymentType:
            "PreferredProfile",

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
            today,

          payment_time:
            time,

          phone_number:
            formData.phoneNumber,

          email:
            formData.email,

          transactionDetails:
            formData.transactionDetails,
        }
      );

      setSubmitted(true);

      showNotification(
        "Advertisement and payment details submitted successfully.",
        "success"
      );

      sessionStorage.removeItem(
        "advertisementDraft"
      );
    } catch (err) {
      console.error(
        "Unable to submit advertisement:",
        err
      );

      const message =
        err?.response?.data?.message ||
        "Unable to submit advertisement and payment details.";

      setError(message);

      showNotification(
        message,
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MemberLayout>
        <div
          className={`${designClasses.card} p-6`}
        >
          <p
            className={`text-sm ${designClasses.textSecondary}`}
          >
            Loading advertisement payment...
          </p>
        </div>
      </MemberLayout>
    );
  }

  if (submitted) {
    return (
      <MemberLayout>
        <div className="space-y-4">
          {notification.message && (
            <NotificationBanner
              message={
                notification.message
              }
              type={
                notification.type
              }
              onClose={() =>
                setNotification({
                  message: "",
                  type: "success"
                })
              }
            />
          )}

          <section
            className={`${designClasses.statusSuccess} p-5`}
          >
            <h1
              className={
                designClasses.statusTitle
              }
            >
              Advertisement submitted
            </h1>

            <p
              className={`mt-1 text-sm ${designClasses.statusText}`}
            >
              Your advertisement and
              payment details have been
              submitted successfully.
              They are pending payment
              and advertisement approval.
            </p>
          </section>

          <section
            className={`${designClasses.card} p-5`}
          >
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              What happens next?
            </h2>

            <p
              className={`mt-2 text-sm ${designClasses.textSecondary}`}
            >
              The payment and
              advertisement text will be
              reviewed before publication.
              The advertisement may be
              edited during review before
              final approval.
            </p>
          </section>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-4">
        {notification.message && (
          <NotificationBanner
            message={
              notification.message
            }
            type={
              notification.type
            }
            onClose={() =>
              setNotification({
                message: "",
                type: "success"
              })
            }
          />
        )}

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h1
            className={`text-xl font-semibold ${designClasses.textPrimary}`}
          >
            Advertisement Payment
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Review your advertisement
            and submit the payment
            reference for approval.
          </p>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h2
            className={`text-base font-semibold ${designClasses.textDark}`}
          >
            Advertisement Preview
          </h2>

          <div className="mt-3">
            <AdvertisementPreview
              heading={
                advertisementDraft?.advertisementHeading
              }
              text={
                advertisementDraft?.advertisementText
              }
              muted
            />
          </div>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <form
            onSubmit={handleSubmit}
            noValidate
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
                type="number"
                name="amount"
                label="Your Advertisement Contribution"
                value={
                  formData.amount
                }
                onChange={
                  handleChange
                }
                required
                error={
                  Boolean(
                    contributionError
                  )
                }
                inputProps={{
                  step: "1"
                }}
                helperText={
                  contributionError ||
                  (
                    minimumContribution !==
                    null
                      ? `Minimum contribution is ₹${minimumContribution}. You may contribute this amount or more.`
                      : "Loading minimum contribution..."
                  )
                }
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
                label="Payment Remarks"
                name="transactionDetails"
                value={
                  formData.transactionDetails
                }
                onChange={handleChange}
                placeholder="Optional remarks about the payment"
              />
            </div>

            <div
              className={`rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
            >
              <div className="space-y-2">
                <p
                  className={`text-sm font-semibold ${designClasses.textDark}`}
                >
                  Advertisement Contribution
                </p>

                <p
                  className={`text-sm ${designClasses.textSecondary}`}
                >
                  The minimum contribution is{" "}
                  <strong>
                    ₹
                    {minimumContribution ??
                      "-"}
                  </strong>
                  . You may contribute this
                  amount or any higher amount.
                </p>

                <p
                  className={`text-sm ${designClasses.textSecondary}`}
                >
                  Contributions are used to
                  support the operation,
                  maintenance and continued
                  improvement of the Kalyana
                  Sakha matrimonial portal and
                  member services.
                </p>

                <p
                  className={`text-xs ${designClasses.textSecondary}`}
                >
                  The advertisement will be
                  published only after payment
                  verification and advertisement
                  review.
                </p>
              </div>
            </div>

            {error && (
              <div
                className={`rounded-xl p-3 text-sm ${designClasses.statusError}`}
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/make-preferred")
                }
                disabled={submitting}
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.secondaryButton}`}
              >
                Back to Advertisement
              </button>

              <button
                type="submit"
                disabled={
                  submitting ||
                  minimumContribution ===
                    null ||
                  Boolean(
                    contributionError
                  )
                }
                className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit for Approval"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </MemberLayout>
  );
};

export default AdvertisementPaymentPage;
import { useState } from "react";

import registrationService from "../../../services/registrationService";

const initialAvailability = {
  email: null,
  phone: null,
};

const initialChecking = {
  email: false,
  phone: false,
};

const parseAvailability = (response) => ({
  email: {
    exists: Boolean(
      response?.email?.exists
    ),
  },
  phone: {
    exists: Boolean(
      response?.phone?.exists
    ),
  },
});

const useRegistrationAvailability = () => {
  const [
    availability,
    setAvailability,
  ] = useState(
    initialAvailability
  );

  const [
    checking,
    setChecking,
  ] = useState(
    initialChecking
  );

  const clearEmailAvailability = () => {
    setAvailability((current) => ({
      ...current,
      email: null,
    }));
  };

  const clearPhoneAvailability = () => {
    setAvailability((current) => ({
      ...current,
      phone: null,
    }));
  };

  const checkEmailAvailability =
    async (email) => {
      const value = String(
        email || ""
      ).trim();

      if (
        !value ||
        !value.includes("@") ||
        !value.includes(".")
      ) {
        clearEmailAvailability();
        return null;
      }

      setChecking((current) => ({
        ...current,
        email: true,
      }));

      try {
        const response =
          await registrationService.checkAccountAvailability(
            {
              email: value,
            }
          );

        const result =
          parseAvailability(
            response
          );

        setAvailability(
          (current) => ({
            ...current,
            email:
              result.email.exists
                ? "taken"
                : "free",
          })
        );

        return result;
      } catch (error) {
        console.warn(
          "Email availability check failed:",
          error?.response
            ?.status ||
            error?.message
        );

        clearEmailAvailability();

        // Existing production behaviour:
        // availability precheck soft-fails.
        return null;
      } finally {
        setChecking(
          (current) => ({
            ...current,
            email: false,
          })
        );
      }
    };

  const checkPhoneAvailability =
    async (
      phoneCountryCode,
      phoneNumber
    ) => {
      const countryCode =
        phoneCountryCode ||
        "+91";

      const number = String(
        phoneNumber || ""
      ).trim();

      if (
        !/^\d{10}$/.test(
          number
        )
      ) {
        clearPhoneAvailability();
        return null;
      }

      setChecking((current) => ({
        ...current,
        phone: true,
      }));

      try {
        const response =
          await registrationService.checkAccountAvailability(
            {
              phoneCountryCode:
                countryCode,
              phoneNumber:
                number,
            }
          );

        const result =
          parseAvailability(
            response
          );

        setAvailability(
          (current) => ({
            ...current,
            phone:
              result.phone.exists
                ? "taken"
                : "free",
          })
        );

        return result;
      } catch (error) {
        console.warn(
          "Phone availability check failed:",
          error?.response
            ?.status ||
            error?.message
        );

        clearPhoneAvailability();

        return null;
      } finally {
        setChecking(
          (current) => ({
            ...current,
            phone: false,
          })
        );
      }
    };

  const checkAccountAvailability =
    async ({
      email,
      phoneCountryCode,
      phoneNumber,
    }) => {
      try {
        const response =
          await registrationService.checkAccountAvailability(
            {
              email:
                String(
                  email || ""
                ).trim(),

              phoneCountryCode:
                phoneCountryCode ||
                "+91",

              phoneNumber:
                String(
                  phoneNumber || ""
                ).trim(),
            }
          );

        const result =
          parseAvailability(
            response
          );

        setAvailability({
          email:
            result.email.exists
              ? "taken"
              : "free",

          phone:
            result.phone.exists
              ? "taken"
              : "free",
        });

        return result;
      } catch (error) {
        console.warn(
          "Account availability preflight failed:",
          error?.response
            ?.status ||
            error?.message
        );

        return null;
      }
    };

  return {
    availability,
    checking,

    clearEmailAvailability,
    clearPhoneAvailability,

    checkEmailAvailability,
    checkPhoneAvailability,
    checkAccountAvailability,
  };
};

export default useRegistrationAvailability; 
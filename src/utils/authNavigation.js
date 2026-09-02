const DEFAULT_RETURN_TO =
  "/dashboard";

const normalizeReturnTo = (
  value
) => {
  const candidate =
    String(value || "")
      .trim();

  if (
    !candidate ||
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate === "/login"
  ) {
    return DEFAULT_RETURN_TO;
  }

  return candidate;
};

const getCurrentAppPath = () => {
  if (
    typeof window ===
    "undefined"
  ) {
    return DEFAULT_RETURN_TO;
  }

  return normalizeReturnTo(
    `${window.location.pathname || ""}${window.location.search || ""}`
  );
};

export const isAuthenticatedSession =
  () => {
    if (
      typeof sessionStorage ===
      "undefined"
    ) {
      return false;
    }

    const token =
      sessionStorage.getItem(
        "token"
      );

    const isLoggedIn =
      sessionStorage.getItem(
        "isLoggedIn"
      );

    return Boolean(
      token &&
      isLoggedIn === "true"
    );
  };

export const ensureAuthenticatedAction =
  ({
    navigate,
    returnTo,
    actionLabel =
      "continue",
  }) => {
    if (
      isAuthenticatedSession()
    ) {
      return true;
    }

    const safeReturnTo =
      normalizeReturnTo(
        returnTo ||
        getCurrentAppPath()
      );

    sessionStorage.setItem(
      "postLoginReturnTo",
      safeReturnTo
    );

    navigate(
      "/login",
      {
        state: {
          returnTo:
            safeReturnTo,
          loginMessage:
            `Please sign in to ${actionLabel}.`,
        },
      }
    );

    return false;
  };

export const consumePostLoginReturnTo =
  (
    stateReturnTo
  ) => {
    const storedReturnTo =
      typeof sessionStorage !==
      "undefined"
        ? sessionStorage.getItem(
            "postLoginReturnTo"
          )
        : "";

    if (
      typeof sessionStorage !==
      "undefined"
    ) {
      sessionStorage.removeItem(
        "postLoginReturnTo"
      );
    }

    return normalizeReturnTo(
      stateReturnTo ||
      storedReturnTo
    );
  };

export const clearPostLoginReturnTo =
  () => {
    if (
      typeof sessionStorage ===
      "undefined"
    ) {
      return;
    }

    sessionStorage.removeItem(
      "postLoginReturnTo"
    );
  };

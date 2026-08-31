import apiClient from "./apiClient";


const normalizeCreditSummary = (
  value
) => {
  const source =
    value || {};

  const recharge =
    source.recharge ||
    {};

  const actionCosts =
    source.actionCosts ||
    {};

  return {
    balance:
      Number(
        source.balance ||
        0
      ),

    lowCreditThreshold:
      Number(
        source
          .lowCreditThreshold ||
        0
      ),

    lowCredit:
      Boolean(
        source.lowCredit
      ),

    recharge: {
      baseAmount:
        Number(
          recharge.baseAmount ||
          0
        ),

      baseCredits:
        Number(
          recharge.baseCredits ||
          0
        )
    },

    actionCosts: {
      showInterest:
        Number(
          actionCosts
            .showInterest ||
          0
        ),

      shortlist:
        Number(
          actionCosts
            .shortlist ||
          0
        ),

      directApply:
        Number(
          actionCosts
            .directApply ||
          0
        ),

      mutualInterest:
        Number(
          actionCosts
            .mutualInterest ||
          0
        ),

      contactView:
        Number(
          actionCosts
            .contactView ||
          0
        )
    }
  };
};


const creditService = {
  getMyCreditSummary:
    async () => {
      const response =
        await apiClient.get(
          "/credits/me"
        );

      return normalizeCreditSummary(
        response?.data?.data
      );
    },

  calculateCreditsForAmount: (
    amount,
    creditSummary
  ) => {
    const numericAmount =
      Number(amount);

    const baseAmount =
      Number(
        creditSummary
          ?.recharge
          ?.baseAmount ||
        0
      );

    const baseCredits =
      Number(
        creditSummary
          ?.recharge
          ?.baseCredits ||
        0
      );

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0 ||
      !Number.isFinite(
        baseAmount
      ) ||
      baseAmount <= 0 ||
      !Number.isFinite(
        baseCredits
      ) ||
      baseCredits <= 0
    ) {
      return 0;
    }

    return Math.floor(
      numericAmount *
        (
          baseCredits /
          baseAmount
        )
    );
  },

  calculateBalanceAfterAction: (
    balance,
    actionCost
  ) =>
    Math.max(
      0,
      Number(balance || 0) -
        Number(
          actionCost || 0
        )
    )
};


export default creditService;
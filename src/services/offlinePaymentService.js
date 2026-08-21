import apiClient from "./apiClient";

const offlinePaymentService = {
  submitPayment: async ({
    paymentType,
    ...payload
  }) => {
    const response = await apiClient.post(
      "/offline-payment/submit",
      {
        ...payload,
        payment_type: paymentType,
      }
    );

    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await apiClient.get(
      "/offline-payment/history"
    );

    const data = response.data;

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.payments)
        ? data.payments
        : [];
  },

  getPaymentHistoryByType: async (
    paymentType
  ) => {
    const payments =
      await offlinePaymentService.getPaymentHistory();

    return payments.filter(
      (payment) =>
        payment?.payment_type ===
        paymentType
    );
  },
};

export default offlinePaymentService;
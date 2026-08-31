import NotificationBanner from "./NotificationBanner";


const LowCreditNotice = ({
  creditSummary,
  onRecharge,
  onClose,
}) => {
  if (
    !creditSummary ||
    !creditSummary.lowCredit
  ) {
    return null;
  }

  const balance =
    Number(
      creditSummary.balance ||
      0
    );

  const threshold =
    Number(
      creditSummary
        .lowCreditThreshold ||
      0
    );

  return (
    <NotificationBanner
      type="warning"
      message={
        `Your credit balance is running low. ` +
        `You have ${balance} credit points remaining. ` +
        `The current recharge reminder level is ${threshold} credit points. ` +
        `Please recharge to avoid interruption while interacting with suitable profiles.`
      }
      actionLabel="Recharge Credits"
      onAction={onRecharge}
      onClose={onClose}
    />
  );
};


export default LowCreditNotice;
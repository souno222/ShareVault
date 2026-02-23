import { CreditCard } from "lucide-react";

const CreditsDisplay = ({ credits }) => {
  console.log("Credits from context:", credits);

  const formatCredits = (creditsInBytes) => {
    if (!creditsInBytes || creditsInBytes === 0) return { value: 0, unit: "Bytes" };

    const bytes = creditsInBytes;
    const kb = bytes / 1000;
    const mb = kb / 1000;
    const gb = mb / 1000;

    if (gb >= 1) {
      return { value: gb.toFixed(2), unit: "GB" };
    } else if (mb >= 1) {
      return { value: mb.toFixed(2), unit: "MB" };
    } else if (kb >= 1) {
      return { value: kb.toFixed(2), unit: "KB" };
    } else {
      return { value: bytes.toFixed(0), unit: "Bytes" };
    }
  };

  const { value, unit } = formatCredits(credits);

  return (
    <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full text-blue-700">
      <CreditCard size={16} />
      <span className="font-medium">{value}</span>
      <span className="text-xs">{unit}</span>
    </div>
  );
};

export default CreditsDisplay;
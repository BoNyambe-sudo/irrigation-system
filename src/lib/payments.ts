type PayResult = {
  success: boolean;
  reference: string;
  provider?: string;
  message?: string;
};

type PayOptions = {
  amount: number;
  phone?: string;
  method: string;
};

// Mock payment gateway. Swap the bodies of the per-provider branches for real
// SDK calls (MTN MoMo, Airtel Money, Flutterwave) using the env vars below.
export async function pay(method: string, amount: number, phone?: string): Promise<PayResult> {
  const reference = `REF-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  switch (method) {
    case "MOMO": {
      const apiKey = process.env.MTN_MOMO_API_KEY;
      if (!apiKey) {
        return { success: true, reference, provider: "MTN MoMo (mock)", message: "Mock payment approved." };
      }
      // Real integration placeholder:
      // const res = await fetch("https://sandbox.mtnzambia.com/collection/v1_0/requesttopay", {...});
      return { success: true, reference, provider: "MTN MoMo" };
    }
    case "AIRTEL": {
      const apiKey = process.env.AIRTEL_MONEY_API_KEY;
      if (!apiKey) {
        return { success: true, reference, provider: "Airtel Money (mock)", message: "Mock payment approved." };
      }
      return { success: true, reference, provider: "Airtel Money" };
    }
    case "CARD": {
      const secret = process.env.FLUTTERWAVE_SECRET_KEY;
      if (!secret) {
        return { success: true, reference, provider: "Card (mock)", message: "Mock payment approved." };
      }
      return { success: true, reference, provider: "Flutterwave Card" };
    }
    case "CASH": {
      return { success: true, reference, provider: "Cash on delivery", message: "Pay on installation." };
    }
    default:
      return { success: false, reference, message: "Unknown payment method." };
  }
}
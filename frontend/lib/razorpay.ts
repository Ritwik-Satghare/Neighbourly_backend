/**
 * Razorpay Checkout SDK integration.
 *
 * Dynamically loads the Razorpay script and provides a typed wrapper
 * for opening the checkout modal.
 */

// Extend Window type for Razorpay global
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

export interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let scriptLoadPromise: Promise<void> | null = null;

/**
 * Inject the Razorpay checkout script into the page (idempotent).
 */
export function loadRazorpayScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise<void>((resolve, reject) => {
    // Already loaded
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Razorpay SDK"));
    };
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

/**
 * Open the Razorpay checkout modal.
 *
 * @param orderId   - Razorpay order ID from your backend
 * @param amount    - Amount in paise (₹100 = 10000)
 * @param currency  - e.g. "INR"
 * @param userName  - Prefill name
 * @param userEmail - Prefill email
 * @param onSuccess - Called with the payment verification payload
 * @param onDismiss - Called if the user closes the modal
 */
export async function openRazorpayCheckout({
  orderId,
  amount,
  currency,
  userName,
  userEmail,
  onSuccess,
  onDismiss,
}: {
  orderId: string;
  amount: number;
  currency: string;
  userName?: string;
  userEmail?: string;
  onSuccess: (response: RazorpaySuccessResponse) => void;
  onDismiss?: () => void;
}): Promise<void> {
  await loadRazorpayScript();

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) {
    throw new Error("NEXT_PUBLIC_RAZORPAY_KEY_ID is not configured");
  }

  const options: RazorpayOptions = {
    key: keyId,
    amount,
    currency,
    name: "Neighbourly",
    description: "Booking Payment",
    order_id: orderId,
    prefill: {
      name: userName,
      email: userEmail,
    },
    theme: {
      color: "#006953",
    },
    handler: onSuccess,
    modal: {
      ondismiss: onDismiss,
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}

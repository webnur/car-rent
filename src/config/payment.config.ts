import * as paypal from "@paypal/checkout-server-sdk";
import Stripe from "stripe";

// PayPal Client
function paypalClient() {
  return new paypal.core.PayPalHttpClient(
    new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_SECRET!
    )
  );
}

// Stripe Client
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

export const paymentGateway = {
  paypal: paypalClient(),
  stripe: stripeClient,
};

// @ts-ignore
const paypal = require('@paypal/checkout-server-sdk');
import 'dotenv/config';

// Cliente PayPal
function getClient() {
  const environment = new paypal.core.SandboxEnvironment(
    process.env['PAYPAL_CLIENT_ID']!,
    process.env['PAYPAL_CLIENT_SECRET']!
  );
  return new paypal.core.PayPalHttpClient(environment);
}

export async function createOrder(amount: string) {
  const client = getClient();
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount,
        },
      },
    ],
  });

  const response = await client.execute(request);
  return response.result;
}

export async function captureOrder(orderId: string) {
  const client = getClient();
  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  const response = await client.execute(request);
  return response.result;
}

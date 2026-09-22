import Razorpay from 'razorpay';

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    const err = new Error('Razorpay configuration is missing.');
    err.statusCode = 503;
    err.expose = true;
    throw err;
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

export default getRazorpayClient;

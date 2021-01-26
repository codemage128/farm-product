/* eslint-disable new-cap, import/no-mutable-exports */
/* global Stripe */
export default (callback) => {
  if (typeof window !== 'undefined') {
    const existingScript = document.getElementById('stripejs');

    if (existingScript && callback) {
      callback(window.stripe);
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.id = 'stripejs';
      document.body.appendChild(script);
  
      script.onload = () => {
        window.stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
        if (callback) callback(window.stripe);
      };
    }
  }
};

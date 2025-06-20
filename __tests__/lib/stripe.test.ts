import stripe from '../../lib/stripe';

describe('stripe', () => {
  it('exports stripe instance', () => {
    expect(stripe).toBeDefined();
  });

  it('has expected stripe properties', () => {
    expect(stripe).toHaveProperty('customers');
    expect(stripe).toHaveProperty('paymentIntents');
    expect(stripe).toHaveProperty('subscriptions');
  });
});

# PayPal Business Integration Setup

This document explains how to configure PayPal Business for the credit packs and subscription system.

## Environment Variables Required

Add these environment variables to your Vercel project or `.env.local` file:

```env
# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_ENVIRONMENT=sandbox # or 'production' for live
PAYPAL_PREMIUM_PLAN_ID=your_premium_plan_id
PAYPAL_PRO_PLAN_ID=your_pro_plan_id
```

## Setup Steps

### 1. Create PayPal Developer Account
- Go to https://developer.paypal.com
- Sign up for a developer account
- Create a REST API app to get your Client ID and Secret

### 2. Create Subscription Plans
You need to create two subscription plans in PayPal:

**Premium Plan:**
- Price: €6.04/month (€4.99 + 21% VAT)
- Credits: 100 AI credits/month
- Billing cycle: Monthly

**Pro Plan:**
- Price: €12.09/month (€9.99 + 21% VAT)
- Credits: 500 AI credits/month
- Billing cycle: Monthly

Save the Plan IDs from PayPal and add them to your environment variables.

### 3. Database Migration
Run the SQL script to add PayPal-specific columns:

```bash
# Execute the script: scripts/add-paypal-credit-system.sql
```

This adds:
- `ai_credits_monthly` - Credits that reset each month
- `ai_credits_purchased` - Credits that never expire
- `paypal_subscription_id` - PayPal subscription reference
- `last_credit_reset` - Timestamp for monthly resets

### 4. Configure Webhooks
Set up webhooks in PayPal Dashboard to receive payment notifications:

**Webhook URL:** `https://your-domain.com/api/paypal/webhook`

**Events to subscribe to:**
- `PAYMENT.CAPTURE.COMPLETED` - One-time payments for credit packs
- `BILLING.SUBSCRIPTION.ACTIVATED` - Subscription started
- `BILLING.SUBSCRIPTION.UPDATED` - Subscription modified
- `BILLING.SUBSCRIPTION.CANCELLED` - Subscription cancelled
- `BILLING.SUBSCRIPTION.EXPIRED` - Subscription expired

### 5. Enable Payments in the App
Once configured, update the code to enable payments:

1. In `components/credit-packs-modal.tsx`, remove the `return` statement at the beginning of `handlePurchase`
2. In `app/app/subscription/page.tsx`, remove the `return` statement at the beginning of `handleUpgrade`
3. Remove or update the yellow warning banner about payment configuration

## Credit System

### Credit Packs (One-time purchases)
- **50 Credits:** €6.04 (€4.99 + VAT) - Never expire
- **100 Credits:** €10.88 (€8.99 + VAT) - 10% discount, most popular
- **250 Credits:** €24.19 (€19.99 + VAT) - 20% discount
- **500 Credits:** €42.34 (€34.99 + VAT) - 30% discount

### Monthly Credits (Subscription)
- **Free:** 0 credits/month
- **Premium:** 100 credits/month
- **Pro:** 500 credits/month

### Credit Consumption Logic
1. System uses monthly credits first
2. When monthly credits run out, uses purchased credits
3. Monthly credits reset on the 1st of each month
4. Purchased credits never expire

## Testing

Use PayPal Sandbox for testing:
1. Create test buyer and seller accounts in PayPal Developer Dashboard
2. Use sandbox credentials in development
3. Test full purchase flow with sandbox accounts
4. Verify webhooks are received correctly

## Going Live

1. Create a live PayPal Business account
2. Create production REST API app
3. Set up production subscription plans
4. Update environment variables to production values
5. Change `PAYPAL_ENVIRONMENT` to `production`
6. Test with small real transactions first

## Security Notes

- Never expose `PAYPAL_CLIENT_SECRET` to the client
- Always verify webhook signatures in production
- Use HTTPS for all PayPal communications
- Store sensitive data encrypted in database
- Implement proper error handling and logging

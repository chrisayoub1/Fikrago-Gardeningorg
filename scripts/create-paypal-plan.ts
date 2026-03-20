/**
 * PayPal Subscription Plan Creation Script
 * 
 * This script creates the PayPal Product and Billing Plan for the 
 * "Seed-to-Soil Box" $29/month subscription.
 * 
 * Run with: bun run scripts/create-paypal-plan.ts
 * 
 * Environment variables required:
 * - PAYPAL_CLIENT_ID
 * - PAYPAL_CLIENT_SECRET
 * - PAYPAL_MODE (sandbox or live)
 */

import 'dotenv/config';

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;
const PAYPAL_MODE = process.env.PAYPAL_MODE || 'sandbox';

const IS_LIVE = PAYPAL_MODE === 'live';
const BASE_URL = IS_LIVE ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

// Product and Plan IDs
const PRODUCT_ID = 'SEED-TO-SOIL-BOX';
const PLAN_ID = `SEED-SOIL-MONTHLY-${IS_LIVE ? 'LIVE' : 'SANDBOX'}`;

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const data = await response.json();
  return data.access_token;
}

async function createProduct(accessToken: string): Promise<string> {
  console.log('📦 Creating PayPal Product...');
  
  // Check if product exists
  const checkResponse = await fetch(`${BASE_URL}/v1/catalogs/products/${PRODUCT_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (checkResponse.ok) {
    console.log('✅ Product already exists:', PRODUCT_ID);
    return PRODUCT_ID;
  }

  // Create new product
  const productData = {
    id: PRODUCT_ID,
    name: 'Seed-to-Soil Monthly Box',
    description: 'A curated box of 5-7 regenerative gardening products delivered monthly. Includes seasonal seeds, premium soil amendments, and expert growing guides.',
    type: 'SERVICE',
    category: 'GARDENING_SUBSCRIPTION',
    image_url: 'https://www.fikrago.com/subscription-box.jpg',
    home_url: 'https://www.fikrago.com',
  };

  const response = await fetch(`${BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `product-create-${Date.now()}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Product creation response:', JSON.stringify(error, null, 2));
    
    // Check if error is because product already exists
    if (error.name === 'RESOURCE_ALREADY_EXISTS' || error.message?.includes('already exists')) {
      console.log('✅ Product already exists (detected in error):', PRODUCT_ID);
      return PRODUCT_ID;
    }
    
    throw new Error(`Failed to create product: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  console.log('✅ Product created:', result.id);
  return result.id;
}

async function createPlan(accessToken: string, productId: string): Promise<string> {
  console.log('📋 Creating PayPal Billing Plan...');
  
  // Check if plan exists
  const checkResponse = await fetch(`${BASE_URL}/v1/billing/plans/${PLAN_ID}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (checkResponse.ok) {
    console.log('✅ Plan already exists:', PLAN_ID);
    return PLAN_ID;
  }

  // Create new plan
  const planData = {
    id: PLAN_ID,
    product_id: productId,
    name: 'Seed-to-Soil Monthly Subscription',
    description: '$29/month - Monthly gardening subscription box with curated products',
    status: 'ACTIVE',
    billing_cycles: [
      {
        frequency: {
          interval_unit: 'MONTH',
          interval_count: 1,
        },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0, // Infinite subscription
        pricing_scheme: {
          fixed_price: {
            value: '29.00',
            currency_code: 'USD',
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: '0',
        currency_code: 'USD',
      },
      setup_fee_failure_action: 'CONTINUE',
      payment_failure_threshold: 3,
    },
    taxes: {
      percentage: '0',
      inclusive: false,
    },
  };

  const response = await fetch(`${BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `plan-create-${Date.now()}`,
    },
    body: JSON.stringify(planData),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Plan creation response:', JSON.stringify(error, null, 2));
    
    // Check if error is because plan already exists
    if (error.name === 'RESOURCE_ALREADY_EXISTS' || error.message?.includes('already exists')) {
      console.log('✅ Plan already exists (detected in error):', PLAN_ID);
      return PLAN_ID;
    }
    
    throw new Error(`Failed to create plan: ${JSON.stringify(error)}`);
  }

  const result = await response.json();
  console.log('✅ Plan created:', result.id);
  return result.id;
}

async function main() {
  console.log('🚀 PayPal Subscription Plan Setup');
  console.log('=================================');
  console.log(`Mode: ${IS_LIVE ? 'LIVE (Real Payments)' : 'SANDBOX (Test)'}`);
  console.log(`API URL: ${BASE_URL}`);
  console.log('');
  
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    console.error('❌ Error: PayPal credentials not found in environment variables');
    console.error('Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET');
    process.exit(1);
  }
  
  try {
    // Get access token
    console.log('🔑 Getting PayPal access token...');
    const accessToken = await getAccessToken();
    console.log('✅ Access token obtained');
    console.log('');
    
    // Create product
    const productId = await createProduct(accessToken);
    console.log('');
    
    // Create plan
    const planId = await createPlan(accessToken, productId);
    console.log('');
    
    console.log('🎉 Setup Complete!');
    console.log('==================');
    console.log(`Product ID: ${PRODUCT_ID}`);
    console.log(`Plan ID: ${planId}`);
    console.log(`Price: $29.00/month`);
    console.log(`Billing Cycle: Monthly (infinite)`);
    console.log('');
    console.log('📌 Add this to your .env file:');
    console.log(`PAYPAL_PLAN_ID=${planId}`);
    console.log('');
    console.log('💡 Use this Plan ID when creating subscriptions on your checkout page.');
    
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();

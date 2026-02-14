# 🔐 API Key Acquisition Checklist

Open your `.env` file and fill in these values one by one.

## 1. Supabase (Database)
**Goal:** specific database URLs for storage.
*   [ ] **Go to:** [https://supabase.com/dashboard/project/_/settings/database](https://supabase.com/dashboard/project/_/settings/database)
*   [ ] Scroll to **Connection parameters**.
*   [ ] `DATABASE_URL`: Copy the **Transaction** connection string. Replace `[YOUR-PASSWORD]` with your actual db password.
*   [ ] `DIRECT_URL`: Copy the **Session** connection string. Replace `[YOUR-PASSWORD]`.
*   [ ] **Go to:** [https://supabase.com/dashboard/project/_/settings/api](https://supabase.com/dashboard/project/_/settings/api)
*   [ ] `NEXT_PUBLIC_SUPABASE_URL`: Copy **Project URL**.
*   [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Copy **anon public** key.

## 2. Upstash (Rate Limiting)
**Goal:** Free redis database to prevent API spam.
*   [ ] **Go to:** [https://console.upstash.com/redis](https://console.upstash.com/redis) -> Create Database.
*   [ ] Scroll to **REST API**.
*   [ ] `UPSTASH_REDIS_URL`: Copy the `UPSTASH_REDIS_REST_URL`.
*   [ ] `UPSTASH_REDIS_TOKEN`: Copy the `UPSTASH_REDIS_REST_TOKEN`.

## 3. Security (NextAuth)
**Goal:** Encrypt user sessions.
*   [ ] `NEXTAUTH_URL`: Keep as `http://localhost:3000` for local dev.
*   [ ] `NEXTAUTH_SECRET`: Run this in your terminal: `openssl rand -base64 32`. Copy the result.

## 4. Google (SEO Data)
**Goal:** Get search rankings and business data.
*   [ ] **Step 1: Enable the APIs**
    *   Go to **[Custom Search API Page](https://console.cloud.google.com/marketplace/product/google/customsearch.googleapis.com)** -> Click **ENABLE**.
    *   Go to **[PageSpeed Insights API Page](https://console.cloud.google.com/marketplace/product/google/pagespeedonline.googleapis.com)** -> Click **ENABLE**.
    *   Go to **[Google Business Profile API Page](https://console.cloud.google.com/marketplace/product/google/mybusinessbusinessinformation.googleapis.com)** -> Click **ENABLE**.
*   [ ] **Step 2: Get the Key**
    *   Go to **[Credentials Page](https://console.cloud.google.com/apis/credentials)**.
    *   Click **+ CREATE CREDENTIALS** at the top -> Select **API Key**.
    *   Copy that key.
*   [ ] **Step 3: Paste in .env**
    *   `GOOGLE_SEARCH_API_KEY`: Paste the key.
    *   `GOOGLE_PAGESPEED_API_KEY`: Paste the **SAME** key.
    *   `GOOGLE_BUSINESS_PROFILE_API_KEY`: Paste the **SAME** key.
*   [ ] **Step 4: Search Engine ID**
    *   Go to [https://programmablesearchengine.google.com/](https://programmablesearchengine.google.com/).
    *   Create a scanner for "Search the entire web".
    *   `GOOGLE_SEARCH_CX`: Copy the **Search engine ID** (cx).

## 5. AI (Groq)
**Goal:** The intelligence engine for auto-fixes.
*   [ ] **Go to:** [https://console.groq.com/keys](https://console.groq.com/keys)
*   [ ] Click **Create API Key**.
*   [ ] `GROQ_API_KEY`: Paste the key (starts with `gsk_`).
*   [ ] `OPENAI_API_KEY`: (Optional) Leave blank if you are using Groq.

## 6. Stripe (Payments)
**Goal:** Testing payments (Test Mode).
*   [ ] **Go to:** [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
*   [ ] `STRIPE_SECRET_KEY`: Copy **Secret key** (starts with `sk_test_`).
*   [ ] `STRIPE_WEBHOOK_SECRET`: Leave blank for now (needed only for live deployment).
*   [ ] **Go to:** [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)
*   [ ] Create "Pro Plan" -> Price $29.
*   [ ] `STRIPE_SEO_PRO_PRICE_ID`: Copy the Price ID (starts with `price_`).

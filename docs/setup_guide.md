# RankBoost Setup Registry & Market Strategy

## Part 1: Strategic Pricing Model
**Goal:** Undercut "Enterprise" tools (Semrush/Ahrefs @ $129/mo) and capture the "Prosumer" market (Freelancers/Small Biz).

### 1. "The Hobbyist" (Free Tier)
*   **Price:** $0/mo
*   **Target:** New Fiverr sellers testing the waters.
*   **Limits:** 1 Project, 10 AI Fixes/mo, Basic Audit.
*   **Goal:** User acquisition & "Hook".

### 2. "The Professional" (Target Tier)
*   **Price:** **$29/mo** (vs Semrush $129)
*   **Target:** Active Fiverr Sellers & Solo Service Biz.
*   **Features:** 
    *   3 Projects
    *   **Unlimited Auto-Fixes** (The Killer Feature)
    *   Daily Rank Tracking (50 Keywords)
    *   Fiverr Gig Optimizer
*   **Why it wins:** It costs less than one Fiverr gig order. It pays for itself immediately.

### 3. "The Agency" (Scale Tier)
*   **Price:** **$79/mo**
*   **Target:** Small SEO Agencies / Power Sellers.
*   **Features:** 
    *   15 Projects
    *   White-label Reports (PDF)
    *   Priority Crawling
    *   API Access

---

## Part 2: Environment Variables Guide (API Keys)

### 1. Database (Supabase)
*   **Why:** Stores user data, projects, and scan results.
*   **Cost:** Free tier is generous.
*   **Steps:**
    1.  Go to [supabase.com](https://supabase.com) -> "New Project".
    2.  Go to **Project Settings** -> **Database** -> **Connection String**.
    3.  Copy the "Direct" and "Transaction" URLs.
    4.  Go to **Project Settings** -> **API** to get `NEXT_PUBLIC_SUPABASE_URL` and `ANON_KEY`.

### 2. AI Intelligence (Groq)
*   **Why:** Powers the "Auto-Fix" engine. Groq is **insanely fast** and cheap.
*   **Cost:** Extremely low (often free in beta/preview).
*   **Steps:**
    1.  Go to [console.groq.com](https://console.groq.com).
    2.  Login -> Create API Key.
    3.  Copy to `GROQ_API_KEY`.
    4.  *(Optional)* Get OpenAI key as backup from [platform.openai.com](https://platform.openai.com).

### 3. SEO Data (Google)
*   **Why:** To get search volume and rankings.
*   **Cost:** Free for low volume.
*   **Steps:**
    1.  **Search API:** Go to [Google Programmable Search Engine](https://programmablesearchengine.google.com/). Create a search engine for "All Web". Copy `CX` ID.
    2.  **API Key:** Go to [Google Cloud Console](https://console.cloud.google.com/). Enable "Custom Search API". Create Credentials -> API Key. Copy to `GOOGLE_SEARCH_API_KEY`.
    3.  **PageSpeed:** Enable "PageSpeed Insights API" in Google Cloud. Use same key.

### 4. Payments (Paddle)
*   **Why:** Global payments & tax handling.
*   **Cost:** Transaction fees only.
*   **Steps:**
    1.  Go to [paddle.com](https://paddle.com) -> Login to Dashboard (Sandbox for testing).
    2.  Go to **Developer Tools** -> **Authentication**.
    3.  Copy `PADDLE_API_KEY`.
    4.  Go to **Catalog** -> **Products**. Use same Price IDs as code variables.

### 5. Rate Limiting (Upstash Redis)
*   **Why:** Prevents abuse of your AI/Search APIs.
*   **Cost:** Free tier.
*   **Steps:**
    1.  Go to [upstash.com](https://upstash.com).
    2.  Create Redis Database.
    3.  Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.

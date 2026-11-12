# PayAgent: Autonomous Multi-Modal AI Commerce & Merchant Intelligence Platform

> **Submission for PayPal AI Hackathon 2026**  
> *Track targets: Best Use of Agentic Commerce, Best Use of AG Grid, Best Use of PayPal + AI*

---

## 🌟 Overview

**PayAgent** bridges generative AI with payment systems. It provides:
1. **Shopper Experience (Agentic Commerce):** An autonomous shopping assistant that parses user preferences, finds products, negotiates bundle discounts, conducts safety checks, and dynamically initiates PayPal Checkout.
2. **Merchant Experience (AG Grid & AI Copilot):** An interactive telemetry dashboard built with AG Grid displaying transactions, AI risk auditing, and automated dispute defense generation.

---

## 🚀 Key Features

### 1. Autonomous Agentic Commerce
- **Dynamic Reasoning Chain:** Every request steps through intent analysis, catalog filtering, budget optimization, and PayPal order staging.
- **In-Chat PayPal Checkout:** Directly triggers PayPal Orders v2 Sandbox transactions from within conversational flow.
- **Real-Time Settlement:** Instant transaction receipts and live synchronization with merchant records.

### 2. AG Grid Enterprise Merchant Intelligence
- **Powered by AG Grid Community (`ag-grid-react`):** Interactive data grid featuring sorting, filtering, column pinning, and CSV export.
- **AI Fraud Risk Scoring:** Flags potential anomalies (disposable domains, velocity spikes) with explanatory diagnostics.
- **1-Click Dispute Defense:** Generates ready-to-file dispute evidence dossiers for contested charges.

---

## 🛠️ Tech Stack

- **Frontend & Backend:** Next.js (App Router), React 19, TypeScript, Tailwind CSS
- **Payments:** PayPal Orders v2 API & PayPal JavaScript SDK
- **Data Grid:** AG Grid Community
- **Icons & Styling:** Lucide React, Canvas Confetti

---

## 🏁 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/payagent.git
cd payagent

# Install dependencies
pnpm install

# Run the development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Sandbox Configuration (Optional)
To connect live PayPal Sandbox credentials, add them to `.env.local` or through the in-app settings modal:

```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
```

*Note: PayAgent includes an autonomous sandbox simulator by default so judges can evaluate the entire flow immediately without requiring API keys.*

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).

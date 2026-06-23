# NoParkPro Frontend

NoParkPro is a next-generation Smart City Parking Violation Forecasting and Spatial Dispatch Optimization platform. This frontend application provides interactive, data-driven dashboards to help municipalities predict parking violations, analyze risk patterns, run policy simulations, and optimize enforcement officer and tow truck deployment. 

> Note: Prototype Server is deployed on render free tier so it may take upto 1 minute to spin.
Live at: https://no-park-pro.vercel.app/

---

## ⚡ Quick Start: How to Run

Follow these instructions to set up and run the frontend development server.

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   `npm` or `yarn`/`pnpm`/`bun`

### 2. Environment Setup
Create a `.env.local` file in the root directory and configure the environment variables:
```bash
# URL of the NoParkPro Backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Mapping service API key
NEXT_PUBLIC_MAPPLS_API_KEY=your_api_key_here
```

### 3. Install Dependencies
Run the following command to install the required node modules:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

NOTE: Make sure server is running at http://localhost:8000
Server Setup Guide: [Server Setup Guide](https://github.com/monoMonu/noparkpro-monorepo/blob/main/server/README.md)

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (v16.2.9) with App Router
*   **Library**: [React](https://react.dev/) (v19.2.4)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4) & [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) for theme tokens
*   **Charting**: [Recharts](https://recharts.org/) for predictive trends, hourly distributions, and confidence analytics
*   **Mapping**: [MapLibre GL](https://maplibre.org/maplibre-gl-js/docs/) for high-performance vector tiles and risk maps

---

## 🖥️ Core Dashboard Modules

The frontend is divided into four main workspaces:

1.  **City Risk Map (`/dashboard/city-risk-map`)**:
    *   Features an interactive vector map of city sectors.
    *   Visualizes real-time density of parking violations and zones classified by municipal risk levels (Nominal to Critical).

2.  **Analytics (`/dashboard/analytics`)**:
    *   Aggregates historic enforcement data to compute overall city risk index metrics.
    *   Renders temporal distributions (hourly curves and daily trends) and ranking lists of top-violating stations.

3.  **Algorithmic Prediction Center (`/dashboard/prediction-center`)**:
    *   Compares predictions of the forecasting engines (Alpha vs. Beta models) using confidence interval trends.
    *   Includes the **AI Scenario Engine (Scenario Policy Engine)** to run mock "what-if" simulations on policy interventions (e.g., maximum patrols, dynamic pricing offsets, transit subsidies) and observe projected violation reductions.

4.  **Resource Allocation (`/dashboard/resource-allocation`)**:
    *   Generates optimized field dispatcher schedules showing recommended officer and tow truck allocations by priority zones.
    *   Contains the **AI Dispatcher Simulator** allowing dispatchers to scale field resources up/down and run dynamic calculations on response times and coverage rates.

---

## 📂 Project Structure

```
noparkpro-frontend/
├── app/                  # Next.js App Router (Layouts & Pages)
│   ├── dashboard/        # Main dashboard container views
│   └── globals.css       # Core styling & system colors
├── components/           # Reusable React components
│   ├── dashboards/       # Specific modules (Analytics, Map, Predictions, Resources)
│   └── ui/               # Standardized Design System UI components
├── lib/                  # Application utilities and hooks
│   ├── api.ts            # Strongly typed backend API client
│   └── utils.ts          # Styling and class merge helpers
```

---

## 🐳 Building for Production

To build the production-ready package:
```bash
npm run build
npm start
```


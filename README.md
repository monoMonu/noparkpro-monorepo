# NoParkPro Monorepo
NoParkPro is a Next-Generation Smart City Parking Violation Forecasting and Spatial Dispatch Optimization platform.
> Note: Prototype Server is deployed on render free tier so it may take upto 1 minute to spin.  
> Live at: https://no-park-pro.vercel.app/
---
## 📂 Project Structure
This monorepo contains the following components:
### 🖥️ [Client / Frontend](client/README.md)
The interactive web application providing dashboards for city risk maps, analytics, policy simulation, and resource allocation.
* **Tech Stack**: Next.js, React, Tailwind CSS, MapLibre GL, Recharts.
* **Documentation**: See [client/README.md](client/README.md) for local installation and running instructions.
### 🧠 [Server / AI Backend](server/README.md)
The AI pipeline and REST API that processes raw parking violation records, clusters them into hotspots, forecasts daily risk indices, and generates resource optimization schedules.
* **Tech Stack**: Python (scikit-learn DBSCAN, XGBoost, pandas), Flask.
* **Documentation**: See [server/README.md](server/README.md) for ML pipeline execution and API setup guide.

# Flight Operations Module (React + Vite)

A modern, production-grade Flight Operations Control Center frontend module for real-time flight monitoring, AI-assisted risk diagnostics, What-If delay impact simulation, multi-agent pipeline orchestration, and Human-in-the-Loop decision execution.

---

## Architecture & Directory Structure

All module source code is organized within the `src/` directory to facilitate straightforward handoff to the backend and core application teams.

```
src/
├── components/
│   ├── OperationalPulse.jsx       # Executive network health, hub status & active disruptions
│   ├── FlightCard.jsx             # Individual flight card with route, delay & status tags
│   ├── FlightPriorityBoard.jsx    # Triage queue categorized by priority (Critical, High, Nominal)
│   ├── FlightRiskPanel.jsx        # Command deck cockpit orchestrating flight diagnostic tabs
│   ├── RiskScore.jsx              # Normalized risk score gauge, badge, and trend indicator
│   ├── RiskFactors.jsx            # Granular risk breakdown (Weather, Crew, Curfew, Turnaround)
│   ├── ImpactSimulator.jsx        # Interactive What-If slider simulating downstream impact
│   ├── FlightDependency.jsx       # Inbound airframe rotation & downstream passenger transfer map
│   ├── AIRecommendation.jsx      # Mitigation decision cards with Approve and Review actions
│   ├── AgentWorkflow.jsx          # Multi-agent execution stepper showing real-time pipeline status
│   ├── RiskChart.jsx              # SVG visual trajectory for risk score and delay timeline
│   └── SearchFilter.jsx           # Multi-dimensional search, filter, and sort controls
│
├── pages/
│   └── FlightOperations.jsx       # Main module page integrating all operational components
│
├── services/
│   └── flightApi.js               # Central Axios service layer configured for FastAPI endpoints
│
├── data/
│   └── demoFlights.js             # Standalone realistic operational dataset for preview mode
│
├── App.jsx                        # Root React Router setup (/flight-operations route)
├── main.jsx                       # Application entry point
└── index.css                      # Tailwind CSS and high-contrast aviation dark mode styles
```

---

## Quickstart

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### Installation
```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will run at:
```
http://localhost:5173/flight-operations
```

### Production Build
```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Environment Configuration

Create a `.env` file in the project root:

```env
# URL for the FastAPI backend service
VITE_API_BASE_URL=http://localhost:8000/api

# Set to false to connect directly to the live FastAPI backend
# Set to true (default) to run in standalone demo mode with local mock data
VITE_USE_DEMO_DATA=true
```

---

## Frontend Integration Handoff

This section outlines how the backend team can ingest and integrate this module into the main project.

### 1. Which Files the Backend Team Needs

The backend team can copy the entire `src/` folder into their repository, or selectively import the following:

- **Main Page Entry**: `src/pages/FlightOperations.jsx`
- **Axios Service Layer**: `src/services/flightApi.js`
- **UI Components**: `src/components/*` (all 12 components are fully modular)
- **Demo Fallback Dataset**: `src/data/demoFlights.js` (used for fallback or offline testing)
- **Styles**: `src/index.css` (or merge Tailwind classes into your global CSS)

### 2. Which API Functions Need Backend Endpoints

The `src/services/flightApi.js` service exposes 6 primary API functions plus 2 roster queries that require FastAPI backend routes:

| API Function | HTTP Method | Target FastAPI Route | Request Payload | Description |
|---|---|---|---|---|
| `getAllFlights()` | `GET` | `/api/flights` | None | Returns array of all monitored flights |
| `getOperationalPulse()` | `GET` | `/api/operations/pulse` | None | Returns network-wide KPI summary |
| `getFlightRisk(flightNumber)` | `GET` | `/api/flights/{flightNumber}/risk` | None | Returns risk score and factor breakdown |
| `getFlightDelay(flightNumber)` | `GET` | `/api/flights/{flightNumber}/delay` | None | Returns delay minutes and root cause |
| `simulateFlightImpact(flightNumber, additionalDelay)` | `POST` | `/api/flights/{flightNumber}/simulate-impact` | `{"additionalDelay": 30}` | Calculates projected risk, missed connections, curfew violations |
| `getFlightRecommendation(flightNumber)` | `GET` | `/api/flights/{flightNumber}/recommendation` | None | Returns AI mitigation recommendation |
| `approveDecision(flightNumber, approvedBy)` | `POST` | `/api/flights/{flightNumber}/approve` | `{"approvedBy": "Dispatcher"}` | Enacts mitigation action with audit stamp |
| `reviewDecision(flightNumber, reviewedBy)` | `POST` | `/api/flights/{flightNumber}/review` | `{"reviewedBy": "Supervisor"}` | Flags decision for supervisory review |

### 3. Expected JSON Structure

#### A. Flight Object Structure (`GET /api/flights` and item responses)
```json
{
  "id": "fl-1042",
  "flightNumber": "AA-1042",
  "airline": "American Airlines",
  "origin": {
    "code": "JFK",
    "name": "New York John F. Kennedy",
    "terminal": "T8",
    "gate": "14B",
    "scheduledTime": "14:30",
    "estimatedTime": "16:15",
    "runway": "31L"
  },
  "destination": {
    "code": "LHR",
    "name": "London Heathrow",
    "terminal": "T3",
    "gate": "Gate 18",
    "scheduledTime": "22:45",
    "estimatedTime": "00:30",
    "runway": "27R"
  },
  "aircraft": {
    "model": "Boeing 777-300ER",
    "tailNumber": "N780AA",
    "capacity": 304,
    "passengerLoad": 286,
    "cargoWeightKg": 14200
  },
  "status": "Critical Risk",
  "priority": "CRITICAL",
  "delayMinutes": 105,
  "delayReason": "Severe convective cell over departure corridor; crew duty limit approaching.",
  "riskScore": 88,
  "riskLevel": "CRITICAL",
  "riskFactors": [
    {
      "category": "Crew Legality",
      "severity": "CRITICAL",
      "score": 94,
      "weight": "35%",
      "description": "Cockpit crew duty ceiling expires in 62 minutes."
    }
  ],
  "dependencies": {
    "inboundFlight": "AA-930 (MIA -> JFK)",
    "turnaroundMinutes": 80,
    "turnaroundStatus": "Tight Buffer (8m remaining)",
    "connectingPassengers": 64,
    "connectingFlights": [
      {
        "flight": "BA-1440 (LHR -> EDI)",
        "passengers": 18,
        "scheduledConnectWindow": "50m",
        "status": "CRITICAL_RISK"
      }
    ],
    "crewHandoff": "Reserve Crew Team Bravo available at JFK T8"
  },
  "recommendation": {
    "id": "rec-1042-01",
    "action": "AIRCRAFT_SWAP_AND_CREW_REASSIGNMENT",
    "title": "Immediate Standby Aircraft Swap & Reserve Crew Bravo Deployment",
    "confidenceScore": 94,
    "reasoning": "Swapping to standby Boeing 777-300ER clears departure before weather closes.",
    "estimatedSavings": "$44,000 & 85 mins delay reduction",
    "alternativeActions": ["Maintain current airframe (89% cancellation probability)"],
    "status": "PENDING_APPROVAL",
    "approvedBy": null,
    "reviewedBy": null,
    "timestamp": "2026-10-31T09:22:15Z"
  },
  "agentWorkflow": [
    {
      "stage": "Telemetry & Weather Ingestion",
      "agent": "AeroPulse Weather Watcher",
      "status": "COMPLETED",
      "timestamp": "09:12:04",
      "detail": "Radar detected cell over Runway 31L."
    }
  ],
  "historicalTrend": [
    { "time": "T-120m", "score": 22, "delay": 0 },
    { "time": "Now", "score": 88, "delay": 105 }
  ]
}
```

#### B. Simulation Response (`POST /api/flights/{flightNumber}/simulate-impact`)
```json
{
  "flightNumber": "AA-1042",
  "baselineDelayMinutes": 105,
  "additionalDelayMinutes": 30,
  "projectedTotalDelayMinutes": 135,
  "baselineRiskScore": 88,
  "simulatedRiskScore": 96,
  "riskDelta": 8,
  "baselineMissedConnections": 34,
  "simulatedMissedConnections": 44,
  "additionalMissedConnections": 10,
  "curfewRisk": true,
  "curfewAirport": "London Heathrow (LHR)",
  "baselineFinancialImpact": 64000,
  "simulatedFinancialImpact": 84000,
  "additionalFinancialCost": 20000,
  "severityCategory": "CRITICAL"
}
```

#### C. Approval Response (`POST /api/flights/{flightNumber}/approve`)
```json
{
  "success": true,
  "message": "Recommendation for AA-1042 successfully approved.",
  "flightNumber": "AA-1042",
  "approvedBy": "Ops Dispatcher #402",
  "status": "APPROVED",
  "timestamp": "2026-10-31T09:30:00Z"
}
```

### 4. How the Axios Service Will Receive Backend Data

In `src/services/flightApi.js`, the service client is configured as:

```javascript
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});
```

To switch from demo mode to live FastAPI mode:
1. Set `VITE_USE_DEMO_DATA=false` in `.env`.
2. Configure `VITE_API_BASE_URL` to point to your FastAPI server (e.g. `http://localhost:8000/api`).
3. The UI will automatically route calls through Axios to your endpoints. If an endpoint is temporarily unavailable, the service logs a clean warning and falls back to demo data to prevent UI crashes.

### 5. How to Import FlightOperations.jsx Into the Main Project

If your main project already has a React Router setup:

```jsx
import React from 'react';
import { Route } from 'react-router-dom';
import FlightOperations from './pages/FlightOperations';

// Inside your main application router:
<Route path="/flight-operations" element={<FlightOperations />} />
```

Or render it directly inside any parent layout:

```jsx
import FlightOperations from './pages/FlightOperations';

function OperationsDashboard() {
  return <FlightOperations />;
}
```

### 6. Which Components Are Reusable

Every component in `src/components/` is decoupled from parent state and can be embedded anywhere:

- **`RiskScore`**: Standalone risk badge or circular SVG gauge. Accepts `score`, `level`, `size` ('sm', 'md', 'gauge'), and `trend`.
- **`OperationalPulse`**: High-level KPI bar for dashboards or executive views. Accepts `pulseData`.
- **`FlightCard`**: Individual interactive flight card. Accepts `flight`, `isSelected`, and `onSelect`.
- **`FlightPriorityBoard`**: Priority list with triage filtering tabs. Accepts `flights`, `selectedFlightId`, `onSelectFlight`.
- **`ImpactSimulator`**: What-If scenario slider. Accepts `flight` and `onSimulationChange`.
- **`AIRecommendation`**: Recommendation card with action triggers. Accepts `flight` and `onActionComplete`.
- **`RiskFactors`**: Breakdown list with visual progress bars. Accepts `factors` array.
- **`RiskChart`**: Pure SVG line chart with timeline and score thresholds. Accepts `data` array.
- **`FlightDependency`**: Turnaround and connecting passenger display. Accepts `dependencies` object.
- **`AgentWorkflow`**: Multi-agent status stepper. Accepts `workflow` array.
- **`SearchFilter`**: Search bar with dropdown filters. Accepts callbacks and filter values.

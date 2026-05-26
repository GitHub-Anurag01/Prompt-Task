# Deployed Link: https://lively-scone-d3b5dc.netlify.app/

# DisasterAI — Prediction & Emergency Response System

An intelligent AI-powered Disaster Prediction & Emergency Response System built with pure HTML, CSS, and JavaScript. No frameworks, no installations — just open `index.html` in any browser and it runs instantly.

---

## Folder Structure

```
disaster-system/
├── index.html            ← Main entry point (open this to run)
├── css/
│   └── style.css         ← All styles (dark cyberpunk theme)
├── js/
│   └── app.js            ← All JavaScript logic & simulations
└── README.md             ← This file
```

---

## How to Run

1. Download and unzip the project
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari)
3. No server, no npm, no installation needed

> Works completely offline after loading Google Fonts (optional)

---

## Technology Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox, Animations) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Orbitron, Share Tech Mono, Exo 2 |
| Charts | HTML5 Canvas API |
| Vision | Canvas-based YOLO simulation |

---

##  Features & Sections

###  Home Page
- Animated rotating globe (Canvas)
- Live monitoring status badge
- Animated statistics counter (Accuracy, Sensors, Regions)
- Floating disaster alert badges
- Quick navigation to Predict and Dashboard

###  Disaster Prediction (3 Models)

####  Earthquake Prediction
- **Algorithm:** Random Forest Regressor (simulated)
- **Inputs:** Latitude, Longitude, Depth (km), Tectonic Zone
- **Output:** Predicted magnitude, risk level (LOW / MEDIUM / HIGH / CRITICAL), risk score %, and safety recommendations

####  Flood Prediction
- **Algorithm:** Random Forest Classifier (simulated)
- **Inputs:** Rainfall (mm/day), River Level (m), Soil Saturation (%), Elevation (m), Duration (hours)
- **Output:** Flood occurrence probability, risk classification, and action steps

####  Hurricane Prediction
- **Algorithm:** Random Forest Model (simulated)
- **Inputs:** Max Wind Speed (mph), Central Pressure (mb), Sea Surface Temperature (°C), Location
- **Output:** Saffir-Simpson category (1–5), intensity score, and evacuation guidance

All prediction results include:
- Animated risk meter bar
- Color-coded risk level (green → red)
- Parameter breakdown table
- Tailored recommendations list

###  Victim Detection (YOLO Simulation)
- Upload any image (JPG, PNG)
- Simulated YOLO v8 object detection runs on the image
- Draws bounding boxes — red for injured, green for safe persons
- Displays detection stats: total persons, injured estimate, safe count, confidence score
- Generates rescue priority guidance based on detections

###  Alerts & Recommendations
- **Live Global Alerts Feed** — real-time styled alert cards (Critical / High / Medium / Low)
- **Location Alert Checker** — enter any city or coordinates to get a risk assessment
- **Safety Recommendations** — tabbed tips for Earthquake, Flood, and Hurricane preparedness

###  Monitoring Dashboard
- **Global Risk Map** — Canvas-drawn map with hotspot overlays for active events
- **Seismic Activity Chart** — 24-hour waveform graph with spike visualization
- **Rainfall Index Chart** — 7-day bar chart with flood threshold highlighting
- **Wind Speed Gauge** — Semi-circular gauge with color zones (safe / warning / danger)
- **Active Events List** — Color-coded live event tracker
- **Response Teams Status** — Field team deployment status (Active / Deployed / Standby)

###  AI Chatbot (ARIA)
- ARIA = AI Response Intelligence Assistant
- Responds to natural language queries about disaster preparedness
- Covers: earthquake safety, flood preparation, hurricane evacuation, model accuracy, YOLO detection, emergency kit checklist
- Quick-question buttons for common queries
- Typing indicator animation
- Timestamped message history

---

##  Design System

| Token | Value |
|---|---|
| Primary Background | `#050a0e` |
| Card Background | `#0f2030` |
| Accent (Cyan) | `#00d4ff` |
| Danger (Red) | `#ff4a4a` |
| Safe (Green) | `#00ff8c` |
| Warning (Orange) | `#ffa500` |
| Display Font | Orbitron |
| Mono Font | Share Tech Mono |
| Body Font | Exo 2 |

---

##  AI Model Logic (Simulated)

Since this is a frontend-only build, the ML models are simulated in JavaScript using weighted factor formulas that mirror how actual Random Forest models prioritize features.

### Earthquake Score Formula
```
risk = (zone_weight × 0.5) + (depth_factor × 0.3) + (lat_factor × 0.2) + noise
```

### Flood Score Formula
```
risk = (rainfall × 0.35) + (river_level × 0.25) + (soil × 0.20) + (elevation_inv × 0.10) + (duration × 0.10) + noise
```

### Hurricane Score Formula
```
risk = (wind_speed × 0.45) + (pressure_drop × 0.35) + (sst × 0.20) + location_bonus + noise
```

Risk thresholds:
- `0.00 – 0.35` → LOW
- `0.35 – 0.55` → MEDIUM
- `0.55 – 0.75` → HIGH
- `0.75 – 1.00` → CRITICAL

---

##  Backend Integration (For Production)

To connect real ML models, replace the `predict*()` functions in `js/app.js` with Axios/Fetch calls to a Flask backend:

```javascript
// Example: Replace predictEarthquake() simulation with real API call
async function predictEarthquake() {
  const payload = { lat, lon, depth, zone };
  const response = await fetch('http://localhost:5000/api/predict/earthquake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  showPredictionResult('eq-result', data);
}
```

Suggested Flask API endpoints:

| Endpoint | Method | Description |
|---|---|---|
| `/api/predict/earthquake` | POST | Earthquake risk prediction |
| `/api/predict/flood` | POST | Flood occurrence prediction |
| `/api/predict/hurricane` | POST | Hurricane intensity prediction |
| `/api/detect/yolo` | POST | YOLO image detection |
| `/api/alerts/live` | GET | Live alert feed |

---

##  Dependencies

All external resources are loaded via CDN (internet required for fonts only):

```html
<!-- Google Fonts -->
https://fonts.googleapis.com/css2?family=Orbitron&family=Share+Tech+Mono&family=Exo+2
```

No npm packages. No build tools. No bundlers.

---

##  Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `> 1024px` | Full multi-column layouts |
| `768px – 1024px` | 2-column grids, stacked forms |
| `< 768px` | Single column, hidden sidebar, hamburger nav |

---

##  Error Handling

- All prediction forms validate required inputs before processing
- Empty fields trigger a toast notification warning
- Graceful loading states shown during all async operations
- Toast notification system for user feedback on all actions

---

##  System Workflow

```
User Input
    ↓
Prediction Form (HTML)
    ↓
JavaScript Model Simulation (app.js)
    ↓
Risk Score Calculation
    ↓
Result Display + Recommendations
    ↓
(Optional) YOLO Image Detection
    ↓
Rescue Guidance Output
```

---

##  Future Enhancements

- Connect real Python/Flask backend with trained ML models
- Integrate live weather APIs (OpenWeather, NOAA)
- Real USGS earthquake data feed
- Actual YOLOv8 model via ONNX.js in browser
- User authentication and alert subscriptions
- Push notifications for real-time warnings
- Map integration (Leaflet.js or Google Maps)
- Multi-language support

---

##  Author Notes

This project is a complete frontend prototype of an AI-based disaster management platform. It demonstrates the full UI/UX, data flow, and user experience of the system. All AI predictions are simulated client-side using weighted algorithms that replicate the behavior of trained Random Forest models.

For a production system, replace the JavaScript simulation functions with real API calls to a Python backend running actual Scikit-learn models trained on historical disaster datasets.

---

> **DisasterAI** — Predicting disasters before they predict us. 

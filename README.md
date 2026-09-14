# 🌍 LANDSLIDEGUARD NER

### Predict. Monitor. Warn. Protect.

> **A Living Digital Earth That Warns Before Disaster.**

**LANDSLIDEGUARD NER** is an interactive, cinematic, frontend-only AI-based landslide early-warning and risk-monitoring platform specifically designed for North-East India (Sikkim, Darjeeling, Meghalaya, Assam, Nagaland, Manipur, Mizoram, Tripura, Arunachal Pradesh).

---

## 🚀 Key Features

1. **2.5D Living Earth Canvas Hero**:
   - Atmospheric glow & vector continent rotation.
   - Highlighted North-East India monitoring zone.
   - Orbiting telemetry data streams (`🌧 Rainfall`, `💧 Soil`, `⛰ Terrain`, `📍 Location`, `📊 History`, `🤖 AI`, `🔮 Forecast`).
   - Rain particle overlay reacting to rainfall intensity.

2. **Earth Intelligence Command Dashboard**:
   - Real-time animated KPI counters (Current Risk %, Rainfall mm, Soil Saturation %, Active Alerts).
   - Central SVG Circular Risk Gauge with dynamic pulse rate (Low, Moderate, High, Critical).
   - 24-Hour Risk Forecast Timeline with glowing particle trajectory.

3. **Full-Screen GIS Risk Map**:
   - Leaflet.js + OpenStreetMap integration with dark cartographic styling.
   - Pulsing risk markers for Gangtok, Darjeeling, Shillong, Guwahati, Kohima, Imphal, etc.
   - Custom popups with [ANALYZE LOCATION] and [ASK AI] triggers.
   - Layer toggles for Heatmap, Analysis Zones, Evacuation Centers, Rivers.

4. **AI Environmental Risk Prediction Engine**:
   - Form inputs for Rainfall (1h to 7d), Soil Saturation, Slope, Elevation, Aspect.
   - Animated multi-step AI execution sequence simulation.

5. **Multilingual Context-Aware Voice Chatbot ("LandslideGuard AI")**:
   - Context integration from active map selections & prediction results.
   - **Voice Input** (Web Speech `SpeechRecognition`) & **Voice Output** (Web Speech `speechSynthesis`) in **English, Tamil (தமிழ்), Hindi (हिन्दी), Telugu (తెలుగు), Malayalam (മലയാളം)**.
   - Offline fallback Q&A knowledge base (`chatbot_knowledge.json`).
   - Full Voice Mode visualizer overlay (`🎙️`).

6. **Alert Center & Emergency Modal**:
   - Top slide-in critical warning banner.
   - Notification drawer panel with `localStorage` read/unread tracking.
   - Optional Web Audio API audio warning sound synthesizer.
   - Emergency Center FAB (`🆘`).

7. **Historical Replay Simulator & Analytics**:
   - Interactive time scrub slider (-24h to +24h around historical landslide events).
   - Chart.js graphs for Rainfall vs Risk, Soil Saturation Failure Curves, and Model Precision/Recall/ROC-AUC.

8. **PWA & Netlify Ready**:
   - Built strictly with HTML5, CSS3, Vanilla JS, Leaflet.js, and Chart.js.
   - Service worker offline cache controller (`service-worker.js`).

---

## 🛠️ Netlify Deployment Guide

1. **Direct Drag & Drop**:
   - Compress or drop the root project folder directly into [Netlify Drop](https://app.netlify.com/drop).
2. **Git Repository Deployment**:
   - Push to GitHub/GitLab.
   - Set Build Command: *(Leave Blank)*
   - Set Publish Directory: `.` (Root)

---

## 📁 Project Structure

```text
landguard/
├── index.html
├── dashboard.html
├── risk-map.html
├── prediction.html
├── forecast.html
├── alerts.html
├── analytics.html
├── historical-replay.html
├── safety.html
├── chatbot.html
├── login.html
├── manifest.json
├── service-worker.js
├── README.md
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── map.css
│   ├── animations.css
│   ├── chatbot.css
│   ├── alerts.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── api.js
│   ├── earth.js
│   ├── dashboard.js
│   ├── prediction.js
│   ├── map.js
│   ├── forecast.js
│   ├── alerts.js
│   ├── analytics.js
│   ├── historical-replay.js
│   ├── safety.js
│   ├── chatbot.js
│   ├── voice.js
│   ├── language.js
│   └── offline.js
├── locales/
│   ├── en.json
│   ├── ta.json
│   ├── hi.json
│   ├── te.json
│   └── ml.json
└── data/
    └── chatbot_knowledge.json
```

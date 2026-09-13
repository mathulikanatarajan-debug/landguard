/* ==========================================================================
   LANDSLIDEGUARD NER - PREDICTION ENGINE MODULE
   ========================================================================== */

class PredictionManager {
  constructor() {
    this.form = null;
    this.statusBox = null;
    this.resultsCard = null;
  }

  init() {
    this.form = document.getElementById("prediction-form");
    this.statusBox = document.getElementById("ai-status-box");
    this.resultsCard = document.getElementById("prediction-results-card");

    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.runAiAnalysis();
      });
    }
  }

  async runAiAnalysis() {
    if (!this.statusBox) return;

    this.statusBox.style.display = "block";
    this.resultsCard.style.display = "none";
    this.statusBox.innerHTML = `
      <div class="ai-progress-sequence">
        <p class="ai-step active">◉ Receiving environmental telemetry data...</p>
      </div>
    `;

    const steps = [
      "◉ Processing rainfall telemetry (1h, 3h, 6h, 12h, 24h, 7d)...",
      "◉ Checking soil moisture & saturation indices...",
      "◉ Evaluating terrain slope, elevation, aspect & river proximity...",
      "◉ Running LandslideGuard Deep Neural Risk Model...",
      "◉ Generating 24-hour predictive risk timeline..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      const p = document.createElement("p");
      p.className = "ai-step active";
      p.textContent = steps[i];
      this.statusBox.appendChild(p);
    }

    await new Promise(r => setTimeout(r, 600));

    // Calculate result
    const formData = new FormData(this.form);
    const dataObj = Object.fromEntries(formData.entries());
    const result = await window.apiService.runPrediction(dataObj);

    this.statusBox.style.display = "none";
    this.resultsCard.style.display = "block";

    document.getElementById("res-prob").textContent = `${result.probability}%`;
    document.getElementById("res-level").textContent = `${result.riskLevel} RISK`;
    document.getElementById("res-peak").textContent = result.peakWindow;
    document.getElementById("res-conf").textContent = result.confidence;

    // Save prediction context to AI assistant
    if (window.chatbotManager) {
      window.chatbotManager.setPredictionContext({
        location: dataObj.location || "Custom Analysis Location",
        riskLevel: result.riskLevel,
        probability: result.probability,
        peakWindow: result.peakWindow,
        rainfall6h: dataObj.rainfall6h,
        soilSaturation: dataObj.soilSaturation
      });
    }
  }
}

window.predictionManager = new PredictionManager();

/* ==========================================================================
   LANDSLIDEGUARD NER - HISTORICAL REPLAY MODULE
   ========================================================================== */

class HistoricalReplayManager {
  constructor() {
    this.currentHour = 0; // -24 to +24
  }

  init() {
    const slider = document.getElementById("replay-slider");
    const label = document.getElementById("replay-hour-label");

    if (slider) {
      slider.addEventListener("input", (e) => {
        const val = parseInt(e.target.value);
        this.currentHour = val;
        const formatted = val === 0 ? "EVENT TRIGGER (0H)" : val < 0 ? `${val} HOURS BEFORE` : `+${val} HOURS AFTER`;
        if (label) label.textContent = formatted;
        this.updateReplayState(val);
      });
    }
  }

  updateReplayState(hour) {
    // Calculate synthetic parameters based on hour curve
    let rain = Math.max(5, Math.round(75 - Math.abs(hour) * 2.8));
    let soil = Math.max(30, Math.round(92 - Math.abs(hour) * 2.1));
    let prob = Math.max(10, Math.round(94 - Math.abs(hour) * 3.2));

    let level = "LOW";
    if (prob > 75) level = "HIGH";
    if (prob > 85) level = "CRITICAL";
    else if (prob > 50) level = "MODERATE";

    document.getElementById("replay-rain").textContent = `${rain} mm`;
    document.getElementById("replay-soil").textContent = `${soil}%`;
    document.getElementById("replay-risk").textContent = `${prob}% (${level})`;
  }
}

window.historicalReplayManager = new HistoricalReplayManager();

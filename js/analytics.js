/* ==========================================================================
   LANDSLIDEGUARD NER - ANALYTICS MODULE
   ========================================================================== */

class AnalyticsManager {
  constructor() {
    this.charts = {};
  }

  init() {
    this.renderRainfallVsRiskChart();
    this.renderSoilVsRiskChart();
  }

  renderRainfallVsRiskChart() {
    const canvas = document.getElementById("rainVsRiskChart");
    if (!canvas || this.charts.rain) return;

    const ctx = canvas.getContext("2d");
    this.charts.rain = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [{
          label: "Monitoring Station Samples",
          data: [
            { x: 10, y: 15 }, { x: 25, y: 35 }, { x: 42, y: 76 },
            { x: 58, y: 82 }, { x: 74, y: 89 }, { x: 30, y: 48 }, { x: 15, y: 22 }
          ],
          backgroundColor: "#00f3ff",
          pointRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Rainfall (mm / 6h)", color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#9ca3af" } },
          y: { title: { display: true, text: "Landslide Risk (%)", color: "#9ca3af" }, min: 0, max: 100, grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#9ca3af" } }
        }
      }
    });
  }

  renderSoilVsRiskChart() {
    const canvas = document.getElementById("soilVsRiskChart");
    if (!canvas || this.charts.soil) return;

    const ctx = canvas.getContext("2d");
    this.charts.soil = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["40%", "50%", "60%", "70%", "80%", "90%", "100%"],
        datasets: [{
          label: "Slope Shear Failure Risk",
          data: [10, 18, 28, 45, 75, 92, 98],
          borderColor: "#ff3366",
          borderWidth: 3,
          tension: 0.3,
          pointBackgroundColor: "#ff3366"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Soil Saturation Level", color: "#9ca3af" }, grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#9ca3af" } },
          y: { title: { display: true, text: "Failure Probability (%)", color: "#9ca3af" }, min: 0, max: 100, grid: { color: "rgba(255,255,255,0.08)" }, ticks: { color: "#9ca3af" } }
        }
      }
    });
  }
}

window.analyticsManager = new AnalyticsManager();

/* ==========================================================================
   LANDSLIDEGUARD NER - CHART.JS FORECAST MODULE
   ========================================================================== */

class ForecastManager {
  constructor() {
    this.chart = null;
  }

  init() {
    const canvas = document.getElementById("forecastChart");
    if (!canvas || this.chart) return;

    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(255, 153, 0, 0.5)");
    gradient.addColorStop(1, "rgba(0, 243, 255, 0.0)");

    this.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["NOW", "+3 HOURS", "+6 HOURS", "+12 HOURS", "+24 HOURS"],
        datasets: [{
          label: "Risk Probability (%)",
          data: [35, 58, 76, 84, 45],
          borderColor: "#ff9900",
          borderWidth: 3,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: "#00f3ff",
          pointBorderColor: "#fff",
          pointRadius: 6,
          pointHoverRadius: 9
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: { color: "#f3f4f6", font: { family: "Inter" } }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            ticks: { color: "#9ca3af" }
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: "rgba(255, 255, 255, 0.08)" },
            ticks: { color: "#9ca3af" }
          }
        }
      }
    });
  }
}

window.forecastManager = new ForecastManager();

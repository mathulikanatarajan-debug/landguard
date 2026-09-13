/* ==========================================================================
   LANDSLIDEGUARD NER - DASHBOARD MODULE
   ========================================================================== */

class DashboardManager {
  constructor() {
    this.currentRiskVal = 76;
    this.currentRiskLevel = "HIGH";
  }

  init() {
    this.animateGauge(this.currentRiskVal, this.currentRiskLevel);
    this.animateNumbers();
    this.bindTimelineNodes();
  }

  animateGauge(value, level) {
    const gaugeFill = document.getElementById("gauge-fill");
    const gaugeText = document.getElementById("gauge-text");
    const gaugeLevel = document.getElementById("gauge-level");
    const pulseRing = document.getElementById("gauge-pulse-ring");

    if (!gaugeFill || !gaugeText) return;

    // Circumference = 2 * PI * 110 ≈ 691
    const totalCircumference = 691;
    const offset = totalCircumference - (value / 100) * totalCircumference;

    gaugeFill.style.strokeDashoffset = offset;
    gaugeText.textContent = `${value}%`;

    if (gaugeLevel) {
      gaugeLevel.textContent = `${level} RISK`;
    }

    if (pulseRing) {
      pulseRing.className = `gauge-pulse-ring pulse-${level.toLowerCase()}`;
    }
  }

  animateNumbers() {
    document.querySelectorAll(".kpi-value[data-target]").forEach(el => {
      const target = parseInt(el.getAttribute("data-target"));
      let current = 0;
      const step = Math.ceil(target / 30);

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = el.hasAttribute("data-suffix") ? `${current}${el.getAttribute("data-suffix")}` : current;
      }, 30);
    });
  }

  bindTimelineNodes() {
    document.querySelectorAll(".timeline-node").forEach(node => {
      node.addEventListener("click", () => {
        document.querySelectorAll(".timeline-node").forEach(n => n.classList.remove("active"));
        node.classList.add("active");

        const prob = node.getAttribute("data-prob");
        const level = node.getAttribute("data-level");
        this.animateGauge(parseInt(prob), level);
      });
    });
  }
}

window.dashboardManager = new DashboardManager();

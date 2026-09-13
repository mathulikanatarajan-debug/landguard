/* ==========================================================================
   LANDSLIDEGUARD NER - MAIN APP ENTRY POINT & ROUTER
   ========================================================================== */

class AppRouter {
  constructor() {
    this.currentView = "home";
    this.views = [
      "home", "dashboard", "risk-map", "prediction",
      "forecast", "alerts", "analytics", "historical", "safety", "login"
    ];
  }

  init() {
    this.bindNavigation();
    this.handleHashChange();
    window.addEventListener("hashchange", () => this.handleHashChange());
    this.initStarfield();
  }

  bindNavigation() {
    document.querySelectorAll("[data-target-view]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const target = btn.getAttribute("data-target-view");
        this.navigate(target);
      });
    });
  }

  handleHashChange() {
    const hash = window.location.hash.replace("#", "");
    if (this.views.includes(hash)) {
      this.navigate(hash, false);
    } else {
      this.navigate("home", false);
    }
  }

  navigate(viewId, updateHash = true) {
    if (!this.views.includes(viewId)) viewId = "home";
    this.currentView = viewId;

    if (updateHash) {
      window.location.hash = viewId;
    }

    // Toggle active section
    document.querySelectorAll(".view-section").forEach(sec => {
      sec.classList.remove("active");
    });

    const targetSec = document.getElementById(`view-${viewId}`);
    if (targetSec) {
      targetSec.classList.add("active");
    }

    // Toggle nav link active state
    document.querySelectorAll(".nav-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("data-target-view") === viewId) {
        link.classList.add("active");
      }
    });

    // Lazy load specific view controllers
    if (viewId === "home" && !window.livingEarthInstance) {
      window.livingEarthInstance = new window.LivingEarth("earth-canvas");
    } else if (viewId === "dashboard" && window.dashboardManager) {
      window.dashboardManager.init();
    } else if (viewId === "risk-map" && window.gisMapManager) {
      window.gisMapManager.init();
    } else if (viewId === "prediction" && window.predictionManager) {
      window.predictionManager.init();
    } else if (viewId === "forecast" && window.forecastManager) {
      window.forecastManager.init();
    } else if (viewId === "alerts" && window.alertManager) {
      window.alertManager.init();
    } else if (viewId === "analytics" && window.analyticsManager) {
      window.analyticsManager.init();
    } else if (viewId === "historical" && window.historicalReplayManager) {
      window.historicalReplayManager.init();
    } else if (viewId === "safety" && window.safetyManager) {
      window.safetyManager.init();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  initStarfield() {
    const canvas = document.getElementById("starfield-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = [];
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        alpha: Math.random()
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.alpha += (Math.random() - 0.5) * 0.02;
        if (s.alpha < 0.1) s.alpha = 0.1;
        if (s.alpha > 0.9) s.alpha = 0.9;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };
    draw();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.langManager) await window.langManager.init();
  window.appRouter = new AppRouter();
  window.appRouter.init();
  if (window.chatbotManager) await window.chatbotManager.init();
  if (window.alertManager) {
    window.alertManager.init();
    // Simulate initial critical warning banner after 3 seconds for WOW factor
    setTimeout(() => {
      window.alertManager.showCriticalBanner({
        title: "🔴 CRITICAL LANDSLIDE RISK — Sikkim Sector",
        desc: "Heavy rainfall detected (74mm/6h). Soil saturation 89%. Peak window: 6–12 Hours."
      });
    }, 2500);
  }
});

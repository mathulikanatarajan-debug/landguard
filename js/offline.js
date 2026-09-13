/* ==========================================================================
   LANDSLIDEGUARD NER - PWA OFFLINE CONTROLLER
   ========================================================================== */

class OfflineController {
  constructor() {
    this.initServiceWorker();
    this.bindNetworkListeners();
  }

  initServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
          .then(reg => console.log("Service Worker registered successfully:", reg.scope))
          .catch(err => console.warn("Service Worker registration failed:", err));
      });
    }
  }

  bindNetworkListeners() {
    window.addEventListener("online", () => this.updateStatus(true));
    window.addEventListener("offline", () => this.updateStatus(false));
    this.updateStatus(navigator.onLine);
  }

  updateStatus(isOnline) {
    const pill = document.getElementById("system-status-pill");
    const text = document.getElementById("status-pill-text");

    if (pill && text) {
      if (isOnline) {
        pill.className = "status-pill online";
        text.textContent = window.langManager ? window.langManager.getText("system_status_online", "SYSTEM ONLINE") : "SYSTEM ONLINE";
      } else {
        pill.className = "status-pill offline";
        text.textContent = window.langManager ? window.langManager.getText("system_status_offline", "OFFLINE MODE") : "OFFLINE MODE";
      }
    }
  }
}

window.offlineController = new OfflineController();

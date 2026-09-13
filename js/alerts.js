/* ==========================================================================
   LANDSLIDEGUARD NER - ALERTS & EMERGENCY MODULE
   ========================================================================== */

class AlertManager {
  constructor() {
    this.soundEnabled = true;
    this.audioCtx = null;
    this.alerts = [
      { id: "a1", severity: "CRITICAL", title: "Nagaland — Kohima Mudflow Warning", desc: "Heavy rainfall detected (74mm/6h). Soil saturation 93%. Critical slope instability imminent.", time: "10 mins ago", read: false },
      { id: "a2", severity: "HIGH", title: "Sikkim — Gangtok Risk Zone", desc: "Landslide probability at 76%. Peak risk window estimated in next 6–12 hours.", time: "25 mins ago", read: false },
      { id: "a3", severity: "HIGH", title: "Darjeeling — Hill Sector Warning", desc: "Continuous heavy rain over steep highway slopes.", time: "1 hour ago", time: "1h ago", read: true },
      { id: "a4", severity: "MODERATE", title: "Meghalaya — East Khasi Hills", desc: "Soil saturation increasing to 68%. Stay vigilant.", time: "3 hours ago", read: true }
    ];
  }

  init() {
    this.renderAlertDrawer();
    this.bindEvents();
  }

  bindEvents() {
    const bellBtn = document.getElementById("alert-bell-btn");
    const drawer = document.getElementById("alert-drawer");
    const closeDrawer = document.getElementById("close-alert-drawer");
    const audioToggle = document.getElementById("audio-sound-toggle");

    if (bellBtn && drawer) {
      bellBtn.addEventListener("click", () => {
        drawer.classList.toggle("open");
      });
    }

    if (closeDrawer && drawer) {
      closeDrawer.addEventListener("click", () => {
        drawer.classList.remove("open");
      });
    }

    if (audioToggle) {
      audioToggle.addEventListener("change", (e) => {
        this.soundEnabled = e.target.checked;
      });
    }
  }

  playWarningTone() {
    if (!this.soundEnabled) return;
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime); // A5 tone
      osc.frequency.exponentialRampToValueAtTime(440, this.audioCtx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio warning playback restricted by browser policy.", e);
    }
  }

  showCriticalBanner(alertObj) {
    const banner = document.getElementById("critical-alert-banner");
    if (banner) {
      document.getElementById("banner-title").textContent = alertObj.title;
      document.getElementById("banner-desc").textContent = alertObj.desc;
      banner.classList.add("show");
      this.playWarningTone();
    }
  }

  dismissCriticalBanner() {
    const banner = document.getElementById("critical-alert-banner");
    if (banner) banner.classList.remove("show");
  }

  renderAlertDrawer() {
    const listContainer = document.getElementById("alert-drawer-items");
    const badge = document.getElementById("alert-badge");
    if (!listContainer) return;

    const unreadCount = this.alerts.filter(a => !a.read).length;
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? "inline-block" : "none";
    }

    listContainer.innerHTML = this.alerts.map(a => `
      <div class="alert-item-card ${a.severity.toLowerCase()} ${a.read ? 'read' : 'unread'}">
        <div class="alert-item-top">
          <span class="alert-severity-tag ${a.severity.toLowerCase()}">${a.severity}</span>
          <span class="alert-item-time">${a.time}</span>
        </div>
        <div class="alert-item-title">${a.title}</div>
        <div class="alert-item-desc">${a.desc}</div>
        <div class="alert-item-actions">
          <button class="btn-secondary" onclick="window.alertManager.askAiAboutAlert('${a.id}')">ASK AI</button>
          <button class="btn-secondary" onclick="window.alertManager.markRead('${a.id}')">MARK READ</button>
        </div>
      </div>
    `).join("");
  }

  markRead(id) {
    const item = this.alerts.find(a => a.id === id);
    if (item) {
      item.read = true;
      this.renderAlertDrawer();
    }
  }

  askAiAboutAlert(id) {
    const item = this.alerts.find(a => a.id === id);
    if (item && window.chatbotManager) {
      window.chatbotManager.openChat();
      window.chatbotManager.sendMessage(`What should I do regarding this critical alert: ${item.title}?`);
    }
  }

  openEmergencyModal() {
    const modal = document.getElementById("emergency-modal");
    if (modal) {
      modal.style.display = "flex";
    }
  }

  closeEmergencyModal() {
    const modal = document.getElementById("emergency-modal");
    if (modal) {
      modal.style.display = "none";
    }
  }
}

window.alertManager = new AlertManager();

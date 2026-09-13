/* ==========================================================================
   LANDSLIDEGUARD NER - SAFETY CENTER MODULE
   ========================================================================== */

class SafetyManager {
  init() {
    document.querySelectorAll(".safety-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        document.querySelectorAll(".safety-tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".safety-tab-pane").forEach(p => p.classList.remove("active"));

        btn.classList.add("active");
        const pane = document.getElementById(`safety-pane-${target}`);
        if (pane) pane.classList.add("active");
      });
    });
  }
}

window.safetyManager = new SafetyManager();

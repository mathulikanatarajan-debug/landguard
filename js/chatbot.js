/* ==========================================================================
   LANDSLIDEGUARD NER - AI CHATBOT MODULE ("LandslideGuard AI")
   ========================================================================== */

class ChatbotManager {
  constructor() {
    this.history = JSON.parse(localStorage.getItem("landguard_chat_history")) || [];
    this.offlineKnowledge = null;
    this.predictionContext = {
      location: "Sikkim — Gangtok Risk Zone",
      riskLevel: "HIGH",
      probability: 76,
      peakWindow: "6–12 Hours",
      rainfall6h: 42,
      soilSaturation: 81
    };
    this.alertContext = {
      severity: "CRITICAL",
      location: "Nagaland",
      probability: 89,
      peakWindow: "3–6 Hours"
    };
  }

  async init() {
    await this.loadOfflineKnowledge();
    this.bindEvents();
    this.renderHistory();
  }

  async loadOfflineKnowledge() {
    try {
      const res = await fetch("data/chatbot_knowledge.json");
      if (res.ok) {
        this.offlineKnowledge = await res.json();
      }
    } catch (e) {
      console.warn("Offline chatbot knowledge file not loaded.", e);
    }
  }

  setPredictionContext(ctx) {
    this.predictionContext = { ...this.predictionContext, ...ctx };
    this.updateContextStrip();
  }

  updateContextStrip() {
    const strip = document.getElementById("chat-context-strip");
    if (strip) {
      strip.textContent = `CONTEXT: ${this.predictionContext.location || 'General'} | Risk: ${this.predictionContext.riskLevel} (${this.predictionContext.probability}%)`;
    }
  }

  bindEvents() {
    const fab = document.getElementById("chatbot-fab");
    const panel = document.getElementById("chatbot-panel");
    const closeBtn = document.getElementById("close-chat");
    const clearBtn = document.getElementById("clear-chat");
    const sendBtn = document.getElementById("send-chat-msg");
    const input = document.getElementById("chat-input");

    if (fab && panel) {
      fab.addEventListener("click", () => this.toggleChat());
    }

    if (closeBtn && panel) {
      closeBtn.addEventListener("click", () => this.closeChat());
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", () => this.clearHistory());
    }

    if (sendBtn && input) {
      sendBtn.addEventListener("click", () => {
        const text = input.value.trim();
        if (text) {
          this.sendMessage(text);
          input.value = "";
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const text = input.value.trim();
          if (text) {
            this.sendMessage(text);
            input.value = "";
          }
        }
      });
    }

    // Quick Chips
    document.querySelectorAll(".quick-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt") || chip.textContent;
        this.sendMessage(prompt);
      });
    });
  }

  toggleChat() {
    const panel = document.getElementById("chatbot-panel");
    if (panel) {
      panel.classList.toggle("open");
    }
  }

  openChat() {
    const panel = document.getElementById("chatbot-panel");
    if (panel) {
      panel.classList.add("open");
    }
  }

  closeChat() {
    const panel = document.getElementById("chatbot-panel");
    if (panel) {
      panel.classList.remove("open");
    }
  }

  sendMessage(userText) {
    this.addBubble(userText, "user");
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      const botResponse = this.generateResponse(userText);
      this.addBubble(botResponse, "bot");
    }, 700);
  }

  generateResponse(query) {
    const q = query.toLowerCase();
    const lang = window.langManager ? window.langManager.currentLang : "en";
    const dict = (this.offlineKnowledge && this.offlineKnowledge[lang]) ? this.offlineKnowledge[lang] : (this.offlineKnowledge ? this.offlineKnowledge["en"] : {});

    if (q.includes("why") && q.includes("high")) {
      return `Selected Location: ${this.predictionContext.location}.\nRisk Level: ${this.predictionContext.riskLevel} (${this.predictionContext.probability}%).\n\nRisk is elevated primarily due to intense 6-hour rainfall (${this.predictionContext.rainfall6h || 42} mm) and high soil moisture saturation (${this.predictionContext.soilSaturation || 81}%), which significantly lowers slope shear strength.`;
    }

    if (q.includes("next 6") || q.includes("peak") || q.includes("when")) {
      return `Based on real-time radar and hydrological data, the peak landslide risk window for ${this.predictionContext.location} is projected during the next ${this.predictionContext.peakWindow || "6–12 Hours"}.`;
    }

    if (q.includes("rainfall") || q.includes("rain")) {
      return dict.rainfall || `Current rainfall stands at ${this.predictionContext.rainfall6h || 42} mm / 6h. Sustained precipitation increases pore water pressure on steep terrain.`;
    }

    if (q.includes("soil")) {
      return dict.soil || `Soil saturation is currently at ${this.predictionContext.soilSaturation || 81}%. Saturation above 75% dramatically accelerates slope failure risks.`;
    }

    if (q.includes("evacuat") || q.includes("safety") || q.includes("do now")) {
      return dict.safety || `SAFETY INSTRUCTION: Avoid slope edges and stream channels. Move perpendicular to debris flow towards pre-designated high ground evacuation shelters immediately if warning sounds.`;
    }

    if (q.includes("landslide") || q.includes("what is")) {
      return dict.what_is_landslide || `A landslide is the movement of rock, earth, or debris down a sloped section of land, triggered by rain, saturation, or seismic activity.`;
    }

    return dict.default || `LandslideGuard AI Context Analysis:\nFor location: ${this.predictionContext.location}, risk is rated ${this.predictionContext.riskLevel} (${this.predictionContext.probability}%). Follow official local authority guidance.`;
  }

  addBubble(text, sender) {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}`;

    if (sender === "bot") {
      msgDiv.innerHTML = `
        <div class="msg-bubble">${text.replace(/\n/g, '<br/>')}</div>
        <div class="msg-tools">
          <button class="btn-tts" onclick="window.voiceManager.speakText(\`${text.replace(/`/g, "'")}\`)">
            🔊 Listen
          </button>
        </div>
      `;
    } else {
      msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;

    this.history.push({ sender, text });
    localStorage.setItem("landguard_chat_history", JSON.stringify(this.history.slice(-20)));
  }

  showTypingIndicator() {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    const ind = document.createElement("div");
    ind.id = "chat-typing-indicator";
    ind.className = "chat-msg bot";
    ind.innerHTML = `<div class="msg-bubble"><em>AI is thinking... ● ● ●</em></div>`;
    container.appendChild(ind);
    container.scrollTop = container.scrollHeight;
  }

  hideTypingIndicator() {
    const ind = document.getElementById("chat-typing-indicator");
    if (ind) ind.remove();
  }

  renderHistory() {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;
    container.innerHTML = "";

    if (this.history.length === 0) {
      this.addBubble("Hello! I am LandslideGuard AI. I can assist you with real-time landslide risk analysis, weather forecasts, and safety instructions for North-East India.", "bot");
    } else {
      this.history.forEach(m => this.addBubble(m.text, m.sender));
    }
  }

  clearHistory() {
    this.history = [];
    localStorage.removeItem("landguard_chat_history");
    this.renderHistory();
  }
}

window.chatbotManager = new ChatbotManager();

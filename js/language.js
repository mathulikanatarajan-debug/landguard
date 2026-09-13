/* ==========================================================================
   LANDSLIDEGUARD NER - MULTILINGUAL (i18n) ENGINE
   ========================================================================== */

class LanguageManager {
  constructor() {
    this.currentLang = localStorage.getItem("landguard_lang") || "en";
    this.translations = {};
    this.supportedLangs = ["en", "ta", "hi", "te", "ml"];
  }

  async init() {
    await this.loadLanguage(this.currentLang);
    this.setupSelector();
  }

  async loadLanguage(lang) {
    if (!this.supportedLangs.includes(lang)) lang = "en";
    this.currentLang = lang;
    localStorage.setItem("landguard_lang", lang);

    try {
      const response = await fetch(`locales/${lang}.json`);
      if (response.ok) {
        this.translations = await response.json();
        this.applyTranslations();
      }
    } catch (e) {
      console.warn("Could not fetch locale file, using fallback.", e);
    }
  }

  setupSelector() {
    const selector = document.getElementById("lang-select");
    if (selector) {
      selector.value = this.currentLang;
      selector.addEventListener("change", (e) => {
        this.loadLanguage(e.target.value);
        if (window.voiceManager) {
          window.voiceManager.setLanguage(e.target.value);
        }
      });
    }
  }

  getText(key, fallback = "") {
    return this.translations[key] || fallback || key;
  }

  applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (this.translations[key]) {
        if (el.tagName === "INPUT" && el.type === "placeholder") {
          el.placeholder = this.translations[key];
        } else {
          el.textContent = this.translations[key];
        }
      }
    });

    if (this.translations["app_title"]) {
      document.title = `${this.translations["app_title"]} — North-East India Disaster Command`;
    }
  }
}

window.langManager = new LanguageManager();

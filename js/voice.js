/* ==========================================================================
   LANDSLIDEGUARD NER - WEB SPEECH VOICE MODULE
   ========================================================================== */

class VoiceManager {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.speechSynth = window.speechSynthesis;
    this.currentLangCode = "en-IN";

    this.langMap = {
      en: "en-IN",
      ta: "ta-IN",
      hi: "hi-IN",
      te: "te-IN",
      ml: "ml-IN"
    };

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateMicUi(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const input = document.getElementById("chat-input");
        if (input) {
          input.value = transcript;
        }

        if (window.chatbotManager) {
          window.chatbotManager.sendMessage(transcript);
        }

        this.closeFullVoiceMode();
      };

      this.recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        this.stopListening();
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    }
  }

  setLanguage(langKey) {
    this.currentLangCode = this.langMap[langKey] || "en-IN";
    if (this.recognition) {
      this.recognition.lang = this.currentLangCode;
    }
  }

  toggleListening() {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening() {
    if (this.recognition) {
      try {
        this.setLanguage(window.langManager ? window.langManager.currentLang : "en");
        this.recognition.start();
      } catch (e) {
        console.warn("Speech recognition start failed:", e);
      }
    } else {
      alert("Voice input is not supported in this browser. Please type your question.");
    }
  }

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {}
    }
    this.updateMicUi(false);
  }

  updateMicUi(listening) {
    const micBtn = document.getElementById("btn-mic-input");
    if (micBtn) {
      if (listening) {
        micBtn.classList.add("listening");
        micBtn.innerHTML = "🔴";
      } else {
        micBtn.classList.remove("listening");
        micBtn.innerHTML = "🎤";
      }
    }
  }

  speakText(text) {
    if (!this.speechSynth) return;

    this.speechSynth.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLangCode;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    this.speechSynth.speak(utterance);
  }

  stopSpeech() {
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  openFullVoiceMode() {
    const modal = document.getElementById("voice-mode-modal");
    if (modal) {
      modal.classList.add("active");
      this.startListening();
    }
  }

  closeFullVoiceMode() {
    const modal = document.getElementById("voice-mode-modal");
    if (modal) {
      modal.classList.remove("active");
      this.stopListening();
    }
  }
}

window.voiceManager = new VoiceManager();

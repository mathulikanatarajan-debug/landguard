/* ==========================================================================
   LANDSLIDEGUARD NER - CENTRAL API SERVICE & MOCK DATA ENGINE
   ========================================================================== */

const API_BASE_URL = "YOUR_BACKEND_URL"; // Configurable for future REST API integration

class ApiService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.mockLocations = [
      {
        id: "sikkim-gangtok",
        name: "Sikkim — Gangtok Risk Zone",
        lat: 27.3389,
        lng: 88.6065,
        riskLevel: "HIGH",
        probability: 76,
        peakWindow: "6–12 Hours",
        rainfall6h: 42,
        soilSaturation: 81,
        slope: 37,
        elevation: 842,
        riskFactors: ["Heavy rainfall", "High soil saturation", "Steep terrain"]
      },
      {
        id: "wb-darjeeling",
        name: "Darjeeling — Hill Sector",
        lat: 27.0410,
        lng: 88.2663,
        riskLevel: "HIGH",
        probability: 82,
        peakWindow: "3–6 Hours",
        rainfall6h: 58,
        soilSaturation: 89,
        slope: 41,
        elevation: 2045,
        riskFactors: ["Continuous rain", "Unstable slope geology"]
      },
      {
        id: "meghalaya-shillong",
        name: "Meghalaya — East Khasi Hills",
        lat: 25.5788,
        lng: 91.8933,
        riskLevel: "MODERATE",
        probability: 54,
        peakWindow: "12–24 Hours",
        rainfall6h: 28,
        soilSaturation: 68,
        slope: 29,
        elevation: 1525,
        riskFactors: ["Increasing soil saturation"]
      },
      {
        id: "assam-guwahati",
        name: "Assam — Kamrup Ridge",
        lat: 26.1445,
        lng: 91.7362,
        riskLevel: "LOW",
        probability: 22,
        peakWindow: "24+ Hours",
        rainfall6h: 12,
        soilSaturation: 45,
        slope: 18,
        elevation: 120,
        riskFactors: ["Mild precipitation"]
      },
      {
        id: "nagaland-kohima",
        name: "Nagaland — Kohima Highway Zone",
        lat: 25.6751,
        lng: 94.1086,
        riskLevel: "CRITICAL",
        probability: 89,
        peakWindow: "3–6 Hours",
        rainfall6h: 74,
        soilSaturation: 93,
        slope: 44,
        elevation: 1444,
        riskFactors: ["Critical rainfall", "Saturated mudflow zone"]
      }
    ];
  }

  async getHealth() {
    return { status: "ONLINE", timestamp: new Date().toISOString() };
  }

  async getRiskMapLocations() {
    return this.mockLocations;
  }

  async getLocationRisk(lat, lon) {
    const match = this.mockLocations.find(loc => Math.abs(loc.lat - lat) < 0.5 && Math.abs(loc.lng - lon) < 0.5);
    if (match) return match;

    return {
      name: `Custom Location (${lat.toFixed(2)}, ${lon.toFixed(2)})`,
      lat, lon,
      riskLevel: "MODERATE",
      probability: 48,
      peakWindow: "6–12 Hours",
      rainfall6h: 30,
      soilSaturation: 65,
      slope: 28,
      elevation: 650,
      riskFactors: ["Moderate rain", "Sloped topography"]
    };
  }

  async runPrediction(formData) {
    const rain = parseFloat(formData.rainfall6h || 40);
    const soil = parseFloat(formData.soilSaturation || 75);
    const slope = parseFloat(formData.slope || 35);

    let prob = Math.min(99, Math.round((rain * 0.4) + (soil * 0.4) + (slope * 0.5)));
    let level = "LOW";
    if (prob > 75) level = "HIGH";
    if (prob > 85) level = "CRITICAL";
    else if (prob > 50) level = "MODERATE";

    return {
      probability: prob,
      riskLevel: level,
      peakWindow: prob > 70 ? "6–12 Hours" : "12–24 Hours",
      confidence: "91.4%",
      processedTimestamp: new Date().toLocaleTimeString()
    };
  }

  async getHistoricalEvents() {
    return [
      { id: "hist-1", name: "2023 Sikkim Flash Flood & Slide", date: "Oct 2023", location: "Chungthang, Sikkim", riskPeak: "94%" },
      { id: "hist-2", name: "2024 Manipur Railway Noney Slide", date: "Jul 2024", location: "Noney, Manipur", riskPeak: "88%" },
      { id: "hist-3", name: "2020 Meghalaya Slope Collapse", date: "May 2020", location: "Jaintia Hills, Meghalaya", riskPeak: "79%" }
    ];
  }
}

window.apiService = new ApiService();

/* ==========================================================================
   LANDSLIDEGUARD NER - 2.5D LIVING EARTH CANVAS ENGINE
   ========================================================================== */

class LivingEarth {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.rotationAngle = 0;
    this.isHoveringNode = false;
    this.hoveredNode = null;
    this.rainIntensity = "HIGH"; // LOW, MODERATE, HIGH, CRITICAL

    // Orbiting Nodes Data
    this.orbitNodes = [
      { id: "rain", label: "🌧 Rainfall", angle: 0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Rainfall: 42 mm / 6h" },
      { id: "soil", label: "💧 Soil", angle: 1.0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Soil Saturation: 81%" },
      { id: "terrain", label: "⛰ Terrain", angle: 2.0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Slope: 37° | Elev: 842m" },
      { id: "location", label: "📍 Location", angle: 3.0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Sikkim, NE India" },
      { id: "history", label: "📊 History", angle: 4.0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Historical Events Logged" },
      { id: "ai", label: "🤖 AI", angle: 5.0, radiusX: 280, radiusY: 90, speed: 0.008, info: "Neural Risk Model: Active" },
      { id: "forecast", label: "🔮 Forecast", angle: 5.8, radiusX: 280, radiusY: 90, speed: 0.008, info: "Peak Window: 6–12 Hours" }
    ];

    // Rain Particles
    this.rainParticles = [];
    this.initRain();
    this.bindEvents();
    this.animate();
  }

  initRain() {
    this.rainParticles = [];
    const count = this.rainIntensity === "CRITICAL" ? 180 : this.rainIntensity === "HIGH" ? 120 : 60;
    for (let i = 0; i < count; i++) {
      this.rainParticles.push({
        x: Math.random() * 500,
        y: Math.random() * 500,
        length: Math.random() * 12 + 6,
        speed: Math.random() * 4 + 3,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  bindEvents() {
    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let found = null;
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;

      this.orbitNodes.forEach(node => {
        const nx = cx + Math.cos(node.angle) * node.radiusX;
        const ny = cy + Math.sin(node.angle) * node.radiusY;
        const dist = Math.hypot(mx - nx, my - ny);
        if (dist < 24) {
          found = { ...node, x: nx, y: ny };
        }
      });

      this.hoveredNode = found;
      this.canvas.style.cursor = found ? "pointer" : "grab";
      const tooltip = document.getElementById("orbit-tooltip");
      if (tooltip) {
        if (found) {
          tooltip.style.display = "block";
          tooltip.style.left = `${e.clientX + 12}px`;
          tooltip.style.top = `${e.clientY + 12}px`;
          tooltip.innerHTML = `<strong>${found.label}</strong><br/>${found.info}`;
        } else {
          tooltip.style.display = "none";
        }
      }
    });

    this.canvas.addEventListener("click", () => {
      if (this.hoveredNode) {
        if (window.appRouter) {
          window.appRouter.navigate("dashboard");
        }
      } else {
        // Zoom transition simulation
        if (window.appRouter) {
          window.appRouter.navigate("risk-map");
        }
      }
    });
  }

  drawGlobe(cx, cy, radius) {
    const ctx = this.ctx;

    // Outer Atmosphere Glow Ring
    const atmosphereGradient = ctx.createRadialGradient(cx, cy, radius * 0.85, cx, cy, radius * 1.25);
    atmosphereGradient.addColorStop(0, "rgba(0, 243, 255, 0.4)");
    atmosphereGradient.addColorStop(0.5, "rgba(0, 102, 255, 0.2)");
    atmosphereGradient.addColorStop(1, "rgba(0, 243, 255, 0)");

    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
    ctx.fillStyle = atmosphereGradient;
    ctx.fill();

    // Ocean Base Sphere
    const oceanGradient = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 10, cx, cy, radius);
    oceanGradient.addColorStop(0, "#0b2545");
    oceanGradient.addColorStop(0.6, "#07162c");
    oceanGradient.addColorStop(1, "#030814");

    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = oceanGradient;
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Latitude & Longitude Grid Lines
    ctx.strokeStyle = "rgba(0, 243, 255, 0.12)";
    ctx.lineWidth = 1;

    for (let lat = -60; lat <= 60; lat += 20) {
      const latRad = (lat * Math.PI) / 180;
      const rLat = radius * Math.cos(latRad);
      const yLat = cy + radius * Math.sin(latRad);

      ctx.beginPath();
      ctx.ellipse(cx, yLat, rLat, rLat * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let lon = 0; lon < 360; lon += 30) {
      const lonRad = ((lon + this.rotationAngle * 50) * Math.PI) / 180;
      const xLon = cx + radius * Math.sin(lonRad);

      ctx.beginPath();
      ctx.ellipse(xLon, cy, radius * 0.15, radius, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Stylized Rotating Landmass Vector Paths (Asia & India)
    ctx.fillStyle = "rgba(0, 255, 136, 0.25)";
    ctx.strokeStyle = "rgba(0, 255, 136, 0.5)";
    ctx.lineWidth = 1.5;

    const landOffsetX = Math.sin(this.rotationAngle) * (radius * 0.6);

    // North-East India Highlight Marker Point
    const neIndiaX = cx + landOffsetX + 45;
    const neIndiaY = cy - 25;

    // Draw stylized landmass curves
    ctx.beginPath();
    ctx.arc(cx + landOffsetX, cy - 10, radius * 0.45, 0, Math.PI * 1.5);
    ctx.stroke();

    // NE India Target Pulsing Signal
    if (neIndiaX > cx - radius * 0.8 && neIndiaX < cx + radius * 0.8) {
      ctx.beginPath();
      ctx.arc(neIndiaX, neIndiaY, 8 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 153, 0, 0.4)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(neIndiaX, neIndiaY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ff9900";
      ctx.fill();

      ctx.font = "11px JetBrains Mono";
      ctx.fillStyle = "#00f3ff";
      ctx.fillText("SIKKIM / NE INDIA", neIndiaX + 12, neIndiaY + 4);
    }
  }

  drawOrbits(cx, cy) {
    const ctx = this.ctx;

    // Orbit Ring Path
    ctx.beginPath();
    ctx.ellipse(cx, cy, 280, 90, 0, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0, 243, 255, 0.25)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Nodes and Animated Telemetry Stream Particles
    this.orbitNodes.forEach(node => {
      node.angle += node.speed;
      const nx = cx + Math.cos(node.angle) * node.radiusX;
      const ny = cy + Math.sin(node.angle) * node.radiusY;

      // Node Glow Point
      ctx.beginPath();
      ctx.arc(nx, ny, 6, 0, Math.PI * 2);
      ctx.fillStyle = node === this.hoveredNode ? "#ffffff" : "#00f3ff";
      ctx.shadowColor = "#00f3ff";
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Node Text Label
      ctx.font = "11px Inter";
      ctx.fillStyle = "#ffffff";
      ctx.fillText(node.label, nx + 10, ny + 4);
    });
  }

  drawRainParticles(cx, cy, radius) {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
    ctx.lineWidth = 1.2;

    this.rainParticles.forEach(p => {
      p.y += p.speed;
      if (p.y > 500) p.y = 0;

      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - 2, p.y + p.length);
      ctx.stroke();
    });
  }

  animate() {
    if (!this.canvas) return;
    this.ctx.clearRect(0, 0, 500, 500);

    const cx = 250;
    const cy = 250;
    const radius = 160;

    this.rotationAngle += 0.003;

    this.drawGlobe(cx, cy, radius);
    this.drawOrbits(cx, cy);
    this.drawRainParticles(cx, cy, radius);

    requestAnimationFrame(() => this.animate());
  }
}

window.LivingEarth = LivingEarth;

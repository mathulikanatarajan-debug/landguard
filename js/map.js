// ==========================================
// LANDSLIDEGUARD-NER
// AI LANDSLIDE RISK MONITORING MAP
// ==========================================

// ------------------------------------------
// 1. MAP INITIALIZATION
// ------------------------------------------

const map = L.map("map", {
    center: [25.5, 92.0],
    zoom: 6,
    minZoom: 4,
    maxZoom: 18,
    zoomControl: true
});


// ------------------------------------------
// 2. OPENSTREETMAP BASEMAP
// ------------------------------------------

const mapTileUrl =
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

L.tileLayer(mapTileUrl, {
    maxZoom: 19,

    attribution:
        "&copy; OpenStreetMap contributors"
}).addTo(map);


// ------------------------------------------
// 4. NORTH-EAST INDIA BOUNDS
// ------------------------------------------

const nerBounds = [
    [21.0, 88.0],
    [29.8, 97.5]
];

map.fitBounds(nerBounds);


// ==========================================
// 5. RISK DATA
// ==========================================

const riskLocations = [
    {
        name: "Gangtok",
        state: "Sikkim",
        lat: 27.3389,
        lng: 88.6065,
        risk: "CRITICAL",
        rainfall: 186,
        soilMoisture: 91,
        slope: 72
    },

    {
        name: "Shillong",
        state: "Meghalaya",
        lat: 25.5788,
        lng: 91.8933,
        risk: "HIGH",
        rainfall: 142,
        soilMoisture: 78,
        slope: 61
    },

    {
        name: "Aizawl",
        state: "Mizoram",
        lat: 23.7271,
        lng: 92.7176,
        risk: "HIGH",
        rainfall: 158,
        soilMoisture: 82,
        slope: 68
    },

    {
        name: "Itanagar",
        state: "Arunachal Pradesh",
        lat: 27.0844,
        lng: 93.6053,
        risk: "MODERATE",
        rainfall: 118,
        soilMoisture: 65,
        slope: 54
    },

    {
        name: "Kohima",
        state: "Nagaland",
        lat: 25.6751,
        lng: 94.1086,
        risk: "MODERATE",
        rainfall: 105,
        soilMoisture: 61,
        slope: 49
    },

    {
        name: "Imphal",
        state: "Manipur",
        lat: 24.8170,
        lng: 93.9368,
        risk: "LOW",
        rainfall: 72,
        soilMoisture: 42,
        slope: 35
    },

    {
        name: "Agartala",
        state: "Tripura",
        lat: 23.8315,
        lng: 91.2868,
        risk: "LOW",
        rainfall: 68,
        soilMoisture: 39,
        slope: 28
    },

    {
        name: "Guwahati",
        state: "Assam",
        lat: 26.1445,
        lng: 91.7362,
        risk: "MODERATE",
        rainfall: 96,
        soilMoisture: 57,
        slope: 42
    }
];


// ==========================================
// 6. RISK COLORS
// ==========================================

const riskColors = {
    LOW: "#22c55e",
    MODERATE: "#facc15",
    HIGH: "#f97316",
    CRITICAL: "#ef4444"
};


// ==========================================
// 7. RISK MARKERS
// ==========================================

const riskLayer = L.layerGroup().addTo(map);


riskLocations.forEach(location => {

    const color = riskColors[location.risk];

    // Outer warning zone
    const warningCircle = L.circle(
        [location.lat, location.lng],
        {
            radius:
                location.risk === "CRITICAL"
                    ? 30000
                    : location.risk === "HIGH"
                    ? 22000
                    : location.risk === "MODERATE"
                    ? 15000
                    : 9000,

            color: color,
            fillColor: color,
            fillOpacity: 0.10,
            weight: 2
        }
    ).addTo(riskLayer);


    // Main marker
    const marker = L.circleMarker(
        [location.lat, location.lng],
        {
            radius:
                location.risk === "CRITICAL"
                    ? 12
                    : location.risk === "HIGH"
                    ? 10
                    : 8,

            color: "#ffffff",
            weight: 2,
            fillColor: color,
            fillOpacity: 0.95
        }
    ).addTo(riskLayer);


    // Popup
    marker.bindPopup(`
        <div style="
            min-width:230px;
            font-family:Arial,sans-serif;
        ">

            <h3 style="
                margin:0 0 8px 0;
                color:${color};
            ">
                ${location.name}
            </h3>

            <p>
                <b>State:</b> ${location.state}
            </p>

            <p>
                <b>Risk Level:</b>
                <span style="
                    color:${color};
                    font-weight:bold;
                ">
                    ${location.risk}
                </span>
            </p>

            <hr>

            <p>
                🌧 Rainfall:
                <b>${location.rainfall} mm</b>
            </p>

            <p>
                💧 Soil Moisture:
                <b>${location.soilMoisture}%</b>
            </p>

            <p>
                ⛰ Slope Instability:
                <b>${location.slope}%</b>
            </p>

        </div>
    `);


    // --------------------------------------
    // CRITICAL ANIMATION
    // --------------------------------------

    if (location.risk === "CRITICAL") {

        let pulseRadius = 30000;

        setInterval(() => {

            warningCircle.setRadius(pulseRadius);

            pulseRadius += 1500;

            if (pulseRadius > 45000) {
                pulseRadius = 30000;
            }

        }, 1000);
    }

});


// ==========================================
// 8. MONITORING STATIONS
// ==========================================

const stations = [
    {
        name: "Station SG-01",
        location: "Gangtok",
        lat: 27.3389,
        lng: 88.6065,
        status: "ONLINE"
    },

    {
        name: "Station SH-02",
        location: "Shillong",
        lat: 25.5788,
        lng: 91.8933,
        status: "ONLINE"
    },

    {
        name: "Station AZ-03",
        location: "Aizawl",
        lat: 23.7271,
        lng: 92.7176,
        status: "ONLINE"
    },

    {
        name: "Station IT-04",
        location: "Itanagar",
        lat: 27.0844,
        lng: 93.6053,
        status: "ONLINE"
    }
];


const stationLayer = L.layerGroup().addTo(map);


stations.forEach(station => {

    const stationIcon = L.divIcon({
        className: "monitoring-station",
        html: `
            <div style="
                width:12px;
                height:12px;
                background:#38bdf8;
                border:2px solid white;
                border-radius:50%;
                box-shadow:0 0 12px #38bdf8;
            "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });


    L.marker(
        [station.lat, station.lng],
        {
            icon: stationIcon
        }
    )
    .bindPopup(`
        <b>${station.name}</b>
        <br>
        Location: ${station.location}
        <br>
        Status:
        <b style="color:green">
            ${station.status}
        </b>
    `)
    .addTo(stationLayer);

});


// ==========================================
// 9. HISTORICAL LANDSLIDE EVENTS
// ==========================================

const historicalEvents = [

    {
        name: "Sikkim Landslide Zone",
        lat: 27.45,
        lng: 88.55,
        year: 2024
    },

    {
        name: "Meghalaya Landslide Zone",
        lat: 25.65,
        lng: 91.85,
        year: 2023
    },

    {
        name: "Mizoram Landslide Zone",
        lat: 23.70,
        lng: 92.70,
        year: 2024
    }

];


const historicalLayer = L.layerGroup();


historicalEvents.forEach(event => {

    L.circleMarker(
        [event.lat, event.lng],
        {
            radius: 6,
            color: "#a78bfa",
            fillColor: "#a78bfa",
            fillOpacity: 0.7,
            weight: 1
        }
    )
    .bindPopup(`
        <b>${event.name}</b>
        <br>
        Historical Event: ${event.year}
    `)
    .addTo(historicalLayer);

});


// ==========================================
// 10. LAYER CONTROL
// ==========================================

const overlays = {

    "⚠️ Risk Zones": riskLayer,

    "📡 Monitoring Stations": stationLayer,

    "📜 Historical Events": historicalLayer

};


L.control.layers(
    null,
    overlays,
    {
        collapsed: false
    }
).addTo(map);


// ==========================================
// 11. DEMO MODE
// ==========================================

let demoRunning = false;

let demoInterval = null;

let demoStep = 0;


const demoStages = [

    {
        level: "LOW",
        rainfall: 60,
        moisture: 40,
        stability: 85
    },

    {
        level: "MODERATE",
        rainfall: 95,
        moisture: 58,
        stability: 68
    },

    {
        level: "HIGH",
        rainfall: 140,
        moisture: 76,
        stability: 45
    },

    {
        level: "CRITICAL",
        rainfall: 185,
        moisture: 91,
        stability: 22
    }

];


function startDemo() {

    if (demoRunning) {
        return;
    }

    demoRunning = true;

    demoStep = 0;


    demoInterval = setInterval(() => {

        const stage = demoStages[demoStep];

        console.log(
            "DEMO:",
            stage.level,
            stage.rainfall,
            stage.moisture,
            stage.stability
        );


        updateDashboard(stage);


        demoStep++;


        if (demoStep >= demoStages.length) {

            clearInterval(demoInterval);

            demoRunning = false;

            console.log(
                "🚨 LANDSLIDE EMERGENCY SIMULATION COMPLETE"
            );
        }

    }, 4000);

}


// ==========================================
// 12. DASHBOARD UPDATE
// ==========================================

function updateDashboard(stage) {

    const riskElement =
        document.getElementById("current-risk");

    const rainfallElement =
        document.getElementById("rainfall-value");

    const moistureElement =
        document.getElementById("soil-value");

    const stabilityElement =
        document.getElementById("stability-value");


    if (riskElement) {

        riskElement.innerText =
            stage.level;

        riskElement.style.color =
            riskColors[stage.level];
    }


    if (rainfallElement) {

        rainfallElement.innerText =
            `${stage.rainfall} mm`;
    }


    if (moistureElement) {

        moistureElement.innerText =
            `${stage.moisture}%`;
    }


    if (stabilityElement) {

        stabilityElement.innerText =
            `${stage.stability}%`;
    }

}


// ==========================================
// 13. DEMO BUTTON
// ==========================================

const demoButton =
    document.getElementById("start-demo");


if (demoButton) {

    demoButton.addEventListener(
        "click",
        startDemo
    );

}


// ==========================================
// 14. MAP CLICK
// ==========================================

map.on("click", event => {

    console.log(
        "Selected coordinates:",
        event.latlng.lat,
        event.latlng.lng
    );

});


// ==========================================
// 15. MAP READY
// ==========================================

console.log(
    "✅ LandslideGuard-NER Map Loaded"
);

console.log(
    "🗺 OpenStreetMap Basemap Active"
);

console.log(
    "📡 Monitoring Stations Active"
);

console.log(
    "⚠️ Risk Monitoring Active"
);
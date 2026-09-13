/* =====================================================
   LANDSLIDEGUARD NER
   RISK MAP JAVASCRIPT
===================================================== */


/* =====================================================
   INITIALIZE MAP
===================================================== */

const map = L.map("map", {

    center: [25.5, 92.0],

    zoom: 6,

    minZoom: 4,

    maxZoom: 18,

    zoomControl: true

});


/* =====================================================
   OPENSTREETMAP TILE LAYER

   NO API KEY REQUIRED
===================================================== */

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        maxZoom: 19,

        attribution:
            "&copy; OpenStreetMap contributors"

    }

).addTo(map);


/* =====================================================
   LAYER GROUPS
===================================================== */

const riskLayer = L.layerGroup().addTo(map);

const stationLayer = L.layerGroup().addTo(map);

const historicalLayer = L.layerGroup().addTo(map);

const evacuationLayer = L.layerGroup();


/* =====================================================
   NORTHEAST INDIA BOUNDS
===================================================== */

const nerBounds = [

    [21.0, 88.0],

    [29.8, 97.5]

];


map.fitBounds(nerBounds);


/* =====================================================
   SAMPLE RISK DATA

   IMPORTANT:
   These are DEMO values.

   Replace with FastAPI /api/risk-map
   after connecting your ML model.
===================================================== */

const riskLocations = [

    {
        name: "Gangtok, Sikkim",

        lat: 27.3389,

        lng: 88.6065,

        risk: 82,

        rainfall: 96,

        soil: 84,

        slope: 38,

        elevation: 1650,

        window: "6–12 hours"
    },


    {
        name: "Darjeeling, West Bengal",

        lat: 27.0410,

        lng: 88.2663,

        risk: 68,

        rainfall: 72,

        soil: 76,

        slope: 31,

        elevation: 2050,

        window: "12–24 hours"
    },


    {
        name: "Kalimpong, West Bengal",

        lat: 27.0667,

        lng: 88.4667,

        risk: 54,

        rainfall: 58,

        soil: 69,

        slope: 27,

        elevation: 1247,

        window: "6–12 hours"
    },


    {
        name: "Aizawl, Mizoram",

        lat: 23.7271,

        lng: 92.7176,

        risk: 38,

        rainfall: 44,

        soil: 61,

        slope: 24,

        elevation: 1132,

        window: "12–24 hours"
    },


    {
        name: "Shillong, Meghalaya",

        lat: 25.5788,

        lng: 91.8933,

        risk: 47,

        rainfall: 51,

        soil: 65,

        slope: 29,

        elevation: 1496,

        window: "12–24 hours"
    }

];


/* =====================================================
   RISK COLOR
===================================================== */

function getRiskColor(risk) {

    if (risk >= 75) {

        return "#ff1744";

    }

    if (risk >= 50) {

        return "#ff9800";

    }

    if (risk >= 25) {

        return "#ffd600";

    }

    return "#00e676";

}


/* =====================================================
   RISK LEVEL
===================================================== */

function getRiskLevel(risk) {

    if (risk >= 75) {

        return "CRITICAL";

    }

    if (risk >= 50) {

        return "HIGH";

    }

    if (risk >= 25) {

        return "MODERATE";

    }

    return "LOW";

}


/* =====================================================
   CREATE RISK MARKERS
===================================================== */

function createRiskMarkers() {

    riskLayer.clearLayers();


    riskLocations.forEach(location => {

        const color =
            getRiskColor(location.risk);

        const level =
            getRiskLevel(location.risk);


        /* -----------------------------------------
           RISK AREA
        ----------------------------------------- */

        const riskArea = L.circle(

            [location.lat, location.lng],

            {

                radius:
                    location.risk >= 75
                        ? 25000
                        : 18000,

                color: color,

                weight: 2,

                fillColor: color,

                fillOpacity: 0.13,

                opacity: 0.7

            }

        );


        riskArea.addTo(riskLayer);


        /* -----------------------------------------
           MARKER
        ----------------------------------------- */

        const marker = L.circleMarker(

            [location.lat, location.lng],

            {

                radius: 9,

                color: "#ffffff",

                weight: 2,

                fillColor: color,

                fillOpacity: 1

            }

        );


        /* -----------------------------------------
           POPUP
        ----------------------------------------- */

        marker.bindPopup(`

            <div class="risk-popup">

                <h3>
                    🏔️ ${location.name}
                </h3>

                <div
                    class="risk-score"
                    style="color:${color}"
                >
                    ${location.risk}%
                </div>

                <p>
                    <strong>Risk Level:</strong>
                    ${level}
                </p>

                <p>
                    🌧️ Rainfall:
                    ${location.rainfall} mm
                </p>

                <p>
                    💧 Soil Moisture:
                    ${location.soil}%
                </p>

                <p>
                    ⛰️ Slope:
                    ${location.slope}°
                </p>

                <p>
                    📐 Elevation:
                    ${location.elevation} m
                </p>

                <p>
                    ⏱️ Peak Risk:
                    ${location.window}
                </p>

                <button
                    class="analyze-btn"
                    onclick="
                        analyzeLocation(
                            ${location.lat},
                            ${location.lng}
                        )
                    "
                >
                    Analyze Location
                </button>

            </div>

        `);


        marker.addTo(riskLayer);

    });

}


/* =====================================================
   MONITORING STATIONS
===================================================== */

const stations = [

    {
        name: "Gangtok Monitoring Station",
        lat: 27.3389,
        lng: 88.6065
    },

    {
        name: "Darjeeling Monitoring Station",
        lat: 27.0410,
        lng: 88.2663
    },

    {
        name: "Shillong Monitoring Station",
        lat: 25.5788,
        lng: 91.8933
    }

];


function createStations() {

    stationLayer.clearLayers();


    stations.forEach(station => {

        const icon = L.divIcon({

            className: "station-marker",

            html: `
                <div style="
                    width:14px;
                    height:14px;
                    background:#00eaff;
                    border:2px solid white;
                    border-radius:50%;
                    box-shadow:0 0 12px #00eaff;
                "></div>
            `,

            iconSize: [14, 14],

            iconAnchor: [7, 7]

        });


        L.marker(

            [station.lat, station.lng],

            { icon: icon }

        )

        .bindPopup(`
            <b>📡 Monitoring Station</b>
            <br><br>
            ${station.name}
            <br>
            <br>
            Status: <b style="color:green">
                ONLINE
            </b>
        `)

        .addTo(stationLayer);

    });

}


/* =====================================================
   HISTORICAL LANDSLIDES
===================================================== */

const historicalEvents = [

    {
        name: "Historical Landslide Event",
        lat: 27.30,
        lng: 88.55,
        year: 2023
    },

    {
        name: "Historical Landslide Event",
        lat: 27.08,
        lng: 88.28,
        year: 2022
    },

    {
        name: "Historical Landslide Event",
        lat: 25.60,
        lng: 91.90,
        year: 2021
    }

];


function createHistoricalMarkers() {

    historicalLayer.clearLayers();


    historicalEvents.forEach(event => {

        L.marker(

            [event.lat, event.lng]

        )

        .bindPopup(`

            <b>⚠️ Historical Landslide</b>

            <br><br>

            Year:
            ${event.year}

            <br><br>

            This location can be used
            for historical event replay.

        `)

        .addTo(historicalLayer);

    });

}


/* =====================================================
   CREATE ALL LAYERS
===================================================== */

createRiskMarkers();

createStations();

createHistoricalMarkers();


/* =====================================================
   LAYER CHECKBOXES
===================================================== */

document
    .getElementById("riskLayerCheck")
    .addEventListener("change", function () {

        if (this.checked) {

            map.addLayer(riskLayer);

        } else {

            map.removeLayer(riskLayer);

        }

    });


document
    .getElementById("stationsCheck")
    .addEventListener("change", function () {

        if (this.checked) {

            map.addLayer(stationLayer);

        } else {

            map.removeLayer(stationLayer);

        }

    });


document
    .getElementById("historicalCheck")
    .addEventListener("change", function () {

        if (this.checked) {

            map.addLayer(historicalLayer);

        } else {

            map.removeLayer(historicalLayer);

        }

    });


document
    .getElementById("evacuationCheck")
    .addEventListener("change", function () {

        if (this.checked) {

            map.addLayer(evacuationLayer);

        } else {

            map.removeLayer(evacuationLayer);

        }

    });


/* =====================================================
   NER BUTTON
===================================================== */

document
    .getElementById("nerBtn")
    .addEventListener("click", function () {

        map.fitBounds(nerBounds);

    });


/* =====================================================
   SIKKIM BUTTON
===================================================== */

document
    .getElementById("sikkimBtn")
    .addEventListener("click", function () {

        map.setView(

            [27.3389, 88.6065],

            9

        );

    });


/* =====================================================
   MY LOCATION
===================================================== */

document
    .getElementById("myLocationBtn")
    .addEventListener("click", function () {

        if (!navigator.geolocation) {

            alert(
                "Geolocation is not supported."
            );

            return;

        }


        navigator.geolocation.getCurrentPosition(

            function (position) {

                const lat =
                    position.coords.latitude;

                const lng =
                    position.coords.longitude;


                map.setView(

                    [lat, lng],

                    13

                );


                L.marker([lat, lng])

                    .addTo(map)

                    .bindPopup(
                        "📍 Your current location"
                    )

                    .openPopup();

            },


            function () {

                alert(
                    "Unable to access your location."
                );

            }

        );

    });


/* =====================================================
   SEARCH
===================================================== */

function searchLocation() {

    const input =
        document
            .getElementById("locationSearch")
            .value
            .trim()
            .toLowerCase();


    if (!input) {

        return;

    }


    const found =
        riskLocations.find(location =>

            location.name
                .toLowerCase()
                .includes(input)

        );


    if (found) {

        map.setView(

            [found.lat, found.lng],

            10

        );


        const color =
            getRiskColor(found.risk);


        L.popup()

            .setLatLng(
                [found.lat, found.lng]
            )

            .setContent(`

                <div class="risk-popup">

                    <h3>
                        🏔️ ${found.name}
                    </h3>

                    <div
                        class="risk-score"
                        style="color:${color}"
                    >
                        ${found.risk}%
                    </div>

                    <p>
                        Risk:
                        <strong>
                            ${getRiskLevel(found.risk)}
                        </strong>
                    </p>

                    <button
                        class="analyze-btn"
                        onclick="
                            analyzeLocation(
                                ${found.lat},
                                ${found.lng}
                            )
                        "
                    >
                        Analyze Location
                    </button>

                </div>

            `)

            .openOn(map);


        return;

    }


    alert(
        "Location not found in the current risk dataset."
    );

}


document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchLocation
    );


document
    .getElementById("locationSearch")
    .addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                searchLocation();

            }

        }
    );


/* =====================================================
   ANALYZE LOCATION
===================================================== */

function analyzeLocation(lat, lng) {

    window.location.href =
        `prediction.html?lat=${lat}&lng=${lng}`;

}


/* =====================================================
   MAP CLICK
===================================================== */

map.on("click", function (event) {

    const lat =
        event.latlng.lat.toFixed(5);

    const lng =
        event.latlng.lng.toFixed(5);


    L.popup()

        .setLatLng(event.latlng)

        .setContent(`

            <div class="risk-popup">

                <h3>
                    📍 Selected Location
                </h3>

                <p>
                    <strong>Latitude:</strong>
                    ${lat}
                </p>

                <p>
                    <strong>Longitude:</strong>
                    ${lng}
                </p>

                <p>
                    Risk analysis can be
                    requested for this location.
                </p>

                <button
                    class="analyze-btn"
                    onclick="
                        analyzeLocation(
                            ${lat},
                            ${lng}
                        )
                    "
                >
                    Analyze Risk
                </button>

            </div>

        `)

        .openOn(map);

});


/* =====================================================
   REFRESH
===================================================== */

document
    .getElementById("refreshBtn")
    .addEventListener("click", function () {

        createRiskMarkers();

        document
            .getElementById("lastUpdated")
            .textContent =
            "Last updated: Just now";

    });


/* =====================================================
   SOS
===================================================== */

function openEmergency() {

    document
        .getElementById("emergencyModal")
        .classList
        .add("show");

}


function closeEmergency() {

    document
        .getElementById("emergencyModal")
        .classList
        .remove("show");

}


/* =====================================================
   ESC CLOSE MODAL
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeEmergency();

        }

    }
);
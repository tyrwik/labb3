import Chart from 'chart.js/auto';
import '../css/styles.scss'

const button = document.querySelector("#button");

if(button) {
    button.addEventListener("click", () => {
        document.body.classList.toggle("alt-background")
    })
}

/**
 * hämtar antagningsdata från JSON-fil
 * @async
 * @returns {Promise<Array>} Lista med antagningsdata
 */

async function fetchData() {
    const response = await fetch ("https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json")
    const data = await response.json();
    return data;
}

/**
 * Stapeldiagram för kurser
 * @param {Array} courses Lista med kurser
 */

function courseChart (courses){
    const ctx = document.querySelector("#courseChart")
    if(!ctx) return;
    new Chart(ctx, {
        type: "bar",

        data: {
            labels: courses.map(c => c.name),
        datasets: [{
            label: "Antal sökande",
            data: courses.map(c => Number(c.applicantsTotal))
        }]

        }
    })
}


/**
 * Cirkeldiagram för program.
 * @param {Array} programs lista med program
 */

function programChart (programs) {
    const ctx = document.querySelector("#programChart");
    if(!ctx) return;
    new Chart(ctx, {
        type: "pie",
        data: {
            labels: programs.map(p => p.name),
            
        datasets: [{
            data: programs.map(p => Number(p.applicantsTotal))
        }]
        }
    })
}

/**
 * startar diagrammen genom att hämta data och skickar till diagramfunktionerna
 * @async
 */

async function startCharts() {
    const data = await fetchData();
    
    courseChart(
        data
        .filter(item => item.type === "Kurs")
        .sort((a,b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0, 6)
    );

    programChart (
        data
        .filter(item => item.type === "Program")
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0, 5)
    )
}

startCharts()

const mapElement = document.querySelector("#map");
const searchButton = document.querySelector("#searchPlace");
const searchInput = document.querySelector("#searchInput");

let map;
let marker;

if(mapElement) {
    map = L.map('map').setView([59.3293, 18.0686], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    marker = L.marker([59.3293, 18.0686]).addTo(map);
}

/**
 * Söker efter en plats genom Nominatim API och flyttar kartan till vald plats
 * @async
 */

async function searchPlace() {
    if (!searchInput || !map || !marker) return;
    const query = searchInput.value.trim();

    if (!query) return;
    try{
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
        )
        const data = await response.json();

        if (data.length === 0) {
            alert("platsen kunde inte hittas.");
            return;
        }

        const lat = Number(data[0].lat);
        const lon = Number(data[0].lon);
        const name = data[0].display_name;

        map.setView([lat, lon], 13);
          marker.setLatLng([lat, lon])
            .bindPopup(name)
            .openPopup();
        

    } catch (error) {
        console.error("Fel vid sökning av plats", error);
    }
}

if (searchButton) {
    searchButton.addEventListener("click", searchPlace);
}

if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            searchPlace();
        }
    })
}






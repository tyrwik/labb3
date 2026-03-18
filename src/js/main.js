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
 * @returns
 */

async function fetchData() {
    const response = await fetch ("https://mallarmiun.github.io/Frontend-baserad-webbutveckling/Moment%205%20-%20Dynamiska%20webbplatser/statistik_sokande_ht25.json")
    const data = await response.json();
    return data;
}

/**
 * Stapeldiagram för kurser
 * @param {Array} courses
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
 * @param {Array} programs
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
 * startar diagrammen
 */

async function startCharts() {
    const data = await fetchData();
    
    courseChart(
        data
        .filter(item => item.type === "kurs")
        .sort((a,b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0.6)
    );

    programChart (
        data
        .filter(item => item.type === "Program")
        .sort((a, b) => b.applicantsTotal - a.applicantsTotal)
        .slice(0, 5)
    )
}

startCharts()


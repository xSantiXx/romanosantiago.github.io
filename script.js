const modemSelect = document.getElementById("modemSelect");
const modulationSelect = document.getElementById("modulationSelect");
const resultsContainer = document.getElementById("resultsContainer");
const showResultsButton = document.getElementById("showResultsButton");
const chartCanvas = document.getElementById("transmissionChart");

const modems = {
    modem1: { name: "Módem V.21", mode: "Full-Dúplex", baudRate: 300, compatibleModulations: ["ASK", "FSK"] },
    modem2: { name: "Módem V.22", mode: "Full-Dúplex", baudRate: 600, compatibleModulations: ["2-PSK", "4-PSK", "4-QAM"] },
    modem3: { name: "Módem V.22 bis", mode: "Full-Dúplex", baudRate: 600, compatibleModulations: ["8-PSK", "8-QAM", "16-QAM"] },
    modem4: { name: "Módem V.32", mode: "Full-Dúplex", baudRate: 2400, compatibleModulations: ["16-QAM", "32-QAM"] },
    modem5: { name: "Módem V.32 bis", mode: "Full-Dúplex", baudRate: 2400, compatibleModulations: ["64-QAM"] },
    modem6: { name: "Módem V.32 terbo", mode: "Full-Dúplex", baudRate: 2400, compatibleModulations: ["256-QAM"] },
    modem7: { name: "Módem V.33", mode: "Full-Dúplex", baudRate: 2400, compatibleModulations: ["128-QAM"] },
    modem8: { name: "Módem V.34", mode: "Full-Dúplex", baudRate: 2400, compatibleModulations: ["1024-QAM", "4096-QAM"] }
};

const modulations = {
    "ASK": { bandwidthFactor: 1, bitsPerSymbol: 1 },
    "FSK": { bandwidthFactor: 1, bitsPerSymbol: 1 },
    "2-PSK": { bandwidthFactor: 1, bitsPerSymbol: 1 },
    "4-PSK": { bandwidthFactor: 1, bitsPerSymbol: 2 },
    "8-PSK": { bandwidthFactor: 1, bitsPerSymbol: 3 },
    "4-QAM": { bandwidthFactor: 1, bitsPerSymbol: 2 },
    "8-QAM": { bandwidthFactor: 1, bitsPerSymbol: 3 },
    "16-QAM": { bandwidthFactor: 1, bitsPerSymbol: 4 },
    "32-QAM": { bandwidthFactor: 1, bitsPerSymbol: 5 },
    "64-QAM": { bandwidthFactor: 1, bitsPerSymbol: 6 },
    "128-QAM": { bandwidthFactor: 1, bitsPerSymbol: 7 },
    "256-QAM": { bandwidthFactor: 1, bitsPerSymbol: 8 },
    "1024-QAM": { bandwidthFactor: 1, bitsPerSymbol: 10 },
    "4096-QAM": { bandwidthFactor: 1, bitsPerSymbol: 12 }
};

let chart;

function initializeChart() {
    const ctx = chartCanvas.getContext("2d");
    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [
                {
                    label: "Frecuencia",
                    data: [],
                    backgroundColor: "#85D0FF",
                    borderRadius: 20,
                    borderWidth: 3,
                    borderColor: "#62C3FF"
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Frecuencia (Hz)" } },
                y: { beginAtZero: true, title: { display: true, text: "Amplitud (V)" } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

modemSelect.addEventListener("change", () => {
    const selectedModem = modemSelect.value;
    modulationSelect.innerHTML = '<option value="" disabled selected>Selecciona una modulación</option>';
    modulationSelect.disabled = false;

    if (selectedModem) {
        const modem = modems[selectedModem];
        modem.compatibleModulations.forEach(mod => {
            const option = document.createElement("option");
            option.value = mod;
            option.textContent = mod;
            modulationSelect.appendChild(option);
        });
    }

    showResultsButton.disabled = true;
    resultsContainer.innerHTML = ""; 
});

modulationSelect.addEventListener("change", () => {
    showResultsButton.disabled = false;
});

// Mostrar resultados
showResultsButton.addEventListener("click", () => {
    const selectedModem = modemSelect.value;
    const selectedModulation = modulationSelect.value;

    const modem = modems[selectedModem];
    const modulation = modulations[selectedModulation];

    let bandwidth = modulation.bandwidthFactor * modem.baudRate;
    const transmissionSpeed = modulation.bitsPerSymbol * modem.baudRate;

    let recommendation = "";
    if (selectedModulation === "ASK") { 
        recommendation = `<p><strong>Recomendación:</strong> ASK es inaplicable debido a sus problemas con el RUIDO.</p>`;
    }
    if(selectedModulation === "FSK"){
        recommendation = `<p><strong>Recomendacion:</strong> FSK tiene un menor ancho de banda que las demas, aun utilizando la misma tasa de señal`;
        bandwidth = `< ${bandwidth}`;
    }

    resultsContainer.innerHTML = `
        <h3>Resultados:</h3>
        <p><strong>Ancho de Banda Requerido:</strong> ${bandwidth} Hz</p>
        <p><strong>Velocidad de Transmisión:</strong> ${transmissionSpeed} bps</p>
        ${recommendation}
    `;

    updateChart(modem);
});

// Actualizar gráfico
function updateChart(modem) {
    chart.data.labels = modem.mode === "Full-Dúplex" ? ["(TX)", "(RX)"] : ["(TX/RX)"];
    chart.data.datasets[0].data = modem.mode === "Full-Dúplex" ? [1, 1] : [1];
    chart.update();
}

initializeChart();
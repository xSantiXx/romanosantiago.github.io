const baudRateInput = document.getElementById("baudRateInput");
const modeSelect = document.getElementById("modeSelect");
const modulationSelect = document.getElementById("modulationSelect");
const showResultsButton = document.getElementById("showResultsButton");
const resultsContainer = document.getElementById("resultsContainer");
const chartCanvas = document.getElementById("transmissionChart");

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

modeSelect.addEventListener("change", () => {
    const selectedMode = modeSelect.value;

    modulationSelect.disabled = false;
    
    
    baudRateInput.value = 1; // Iniciar en 1
    baudRateInput.disabled = false;

    if (selectedMode === "Full-Dúplex") {
        baudRateInput.min = 1;
        baudRateInput.max = 1200;
    } else {
        baudRateInput.min = 1;
        baudRateInput.max = 2400;
    }

    showResultsButton.disabled = false;

    resultsContainer.innerHTML = "";
});

baudRateInput.addEventListener("input", () => {
    const min = parseInt(baudRateInput.min);
    const max = parseInt(baudRateInput.max);
    const value = parseInt(baudRateInput.value);

    if (value < min) baudRateInput.value = min;
    if (value > max) baudRateInput.value = max;
});

modulationSelect.addEventListener("change", () => {
    showResultsButton.disabled = false;
});

// Mostrar resultados
showResultsButton.addEventListener("click", () => {
    const selectedMode = modeSelect.value;
    const selectedModulation = modulationSelect.value;

    const baudRate = parseInt(baudRateInput.value);
    const bandwidth = baudRate * (selectedMode === "Full-Dúplex" ? 2 : 1);
    const transmissionSpeed = baudRate * 1.5; // Arbitrario, ajusta según la modulación

    let recommendation = "";
    if (selectedModulation === "ASK") { 
        recommendation = `<p><strong>Recomendación:</strong> ASK es inaplicable debido a sus problemas con el RUIDO.</p>`;
    }
    if (selectedModulation === "FSK") {
        recommendation = `<p><strong>Recomendación:</strong> FSK tiene un menor ancho de banda que las demás, aún utilizando la misma tasa de señal.</p>`;
    }

    resultsContainer.innerHTML = `
        <h3>Resultados:</h3>
        <p><strong>Ancho de Banda Requerido:</strong> ${bandwidth} Hz</p>
        <p><strong>Velocidad de Transmisión:</strong> ${transmissionSpeed} bps</p>
        ${recommendation}
    `;

    updateChart(selectedMode);
});

// Actualizar gráfico
function updateChart(selectedMode) {
    chart.data.labels = selectedMode === "Full-Dúplex" ? ["TX", "RX"] : ["TX/RX"];
    chart.data.datasets[0].data = selectedMode === "Full-Dúplex" ? [1, 1] : [1];
    chart.update();
}

initializeChart();
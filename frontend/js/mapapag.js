// mapapag.js

// Recupera dados salvos
const destino = localStorage.getItem("roteiro_destino");
const inicio = localStorage.getItem("roteiro_inicio");
const fim = localStorage.getItem("roteiro_fim");
const clima = JSON.parse(localStorage.getItem("roteiro_clima"));

const destinoEl = document.getElementById("destino-info");
const climaEl = document.getElementById("clima-info");

// Exibir destino e datas
destinoEl.innerHTML = `
    <h2>${destino}</h2>
    <p><b>Início:</b> ${inicio}</p>
    <p><b>Fim:</b> ${fim}</p>
`;

// Exibir clima
climaEl.innerHTML = `
    <h3>Clima Atual</h3>
    <p>${clima.current.temp_c}°C - ${clima.current.condition.text}</p>
    <img src="https:${clima.current.condition.icon}" />

    <h3>Previsão - 3 dias</h3>
    ${clima.forecast.forecastday.map(d => `
        <div style="margin-bottom:10px">
            <b>${d.date}</b><br>
            ${d.day.avgtemp_c}°C - ${d.day.condition.text}<br>
            <img src="https:${d.day.condition.icon}">
        </div>
    `).join("")}
`;

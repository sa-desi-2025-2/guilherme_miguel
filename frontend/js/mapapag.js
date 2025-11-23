// =================== IMPORTS ===================
import { gerarRoteiroGemini } from "./apis/Gemini.js";
import { buscarLocaisCidade } from "./apis/OpenTripMap.js";

// =================== PEGAR ID DA URL ===================
const params = new URLSearchParams(window.location.search);
const roteiroId = params.get("id");

if (!roteiroId) {
    alert("Nenhum ID de roteiro encontrado na URL!");
    throw new Error("ID ausente na URL");
}

// =================== FUNÇÃO PARA CARREGAR ROTEIRO ===================
async function carregarRoteiroBackend() {
    const res = await fetch(`http://localhost:8081/roteiros/${roteiroId}`);

    if (!res.ok) {
        throw new Error("Erro ao buscar roteiro no backend");
    }

    return await res.json();
}

// =================== ELEMENTOS ===================
const clima = JSON.parse(localStorage.getItem("roteiro_clima"));

const destinoEl = document.getElementById("destino-info");
const climaEl = document.getElementById("clima-info");
const tituloMapaEl = document.getElementById("titulo-mapa");
const dataViagemEl = document.getElementById("data-viagem");
const paisLocalidadeEl = document.getElementById("pais-localidade");
const orcamentoEl = document.getElementById("orcamento-viagem");
const pontosListaEl = document.getElementById("pontos-interesse-lista");

// =================== INICIALIZAÇÃO ===================
document.addEventListener("DOMContentLoaded", async () => {
    try {
        // 1️⃣ Buscar o roteiro REAL no backend
        const roteiroBD = await carregarRoteiroBackend();
        console.log("Roteiro vindo do backend:", roteiroBD);

        // 2️⃣ Preencher informações fixas
        destinoEl.textContent = roteiroBD.destino;
        dataViagemEl.textContent = `${roteiroBD.dataInicio} / ${roteiroBD.dataFim}`;
        tituloMapaEl.textContent = `Roteiro ${roteiroBD.destino}`;
        orcamentoEl.textContent = `BRL ${roteiroBD.custoTotal}`;
        paisLocalidadeEl.innerHTML = `<i class="fas fa-map-marker-alt me-1"></i> ${roteiroBD.pais}`;

        // 3️⃣ Exibir clima salvo no localStorage
        if (clima) {
            climaEl.innerHTML = `
                <h3>Clima Atual em ${roteiroBD.destino}</h3>
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
        }

        // 4️⃣ Buscar locais reais no OpenTripMap
        const locais = await buscarLocaisCidade(roteiroBD.destino, roteiroBD.pais, 40);
        console.log("Locais reais encontrados:", locais);

        // 5️⃣ Gerar roteiro usando IA
        const roteiroIA = await gerarRoteiroGemini(roteiroBD, locais);
        console.log("ROTEIRO FINAL GERADO:", roteiroIA);

        // 6️⃣ Renderizar resultado
        renderizarRoteiro(roteiroIA);

    } catch (erro) {
        console.error("Erro ao gerar o roteiro:", erro);
        alert("Erro ao carregar ou gerar o roteiro.");
    }
});

// =================== RENDERIZAÇÃO ===================
function renderizarRoteiro(roteiro) {
    const container = document.getElementById("roteiro-container");

    container.innerHTML = `
        <h3>Roteiro Gerado</h3>
        ${roteiro.dias.map(d => `
            <div class="dia">
                <h4>Dia ${d.dia} - ${d.data}</h4>
                ${d.atividades.map(a => `
                    <div class="atividade">
                        <b>${a.periodo.toUpperCase()} - ${a.titulo}</b><br>
                        ${a.descricao}<br>
                        <small>(${a.coordenadas.lat || "?"}, ${a.coordenadas.lon || "?"})</small>
                    </div>
                `).join("")}
            </div>
        `).join("")}
    `;
}

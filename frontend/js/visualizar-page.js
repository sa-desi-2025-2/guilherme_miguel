const API_BASE = "http://localhost:8081";

// PEGAR TOKEN
const params = new URLSearchParams(window.location.search);
const token = params.get("token");

if (!token) {
    alert("Token inválido!");
    throw new Error("Token ausente");
}

// ======================
// LEAFLET
// ======================
let map = null;
let markersLayer = null;

function initMap() {
    map = L.map("map").setView([0, 0], 2); // inicial vazio

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    markersLayer = L.layerGroup().addTo(map);
}

function plotarPontos(pontos) {
    markersLayer.clearLayers();

    if (!pontos.length) return;

    const bounds = [];

    pontos.forEach(p => {
        const marker = L.marker([p.latitude, p.longitude]).addTo(markersLayer);

        marker.bindPopup(`
            <b>${p.nome}</b><br>
            ${p.descricao ?? ""}
        `);

        bounds.push([p.latitude, p.longitude]);
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// ======================
// CARREGAR ROTEIRO
// ======================
async function carregarCompartilhado() {
    try {
        const resRoteiro = await fetch(`${API_BASE}/roteiros/public/${token}`);

        if (!resRoteiro.ok) {
            alert("Roteiro não encontrado!");
            return;
        }

        const roteiro = await resRoteiro.json();
        console.log("Roteiro carregado:", roteiro);

        preencherRoteiro(roteiro);

        // Buscar pontos
        const resPontos = await fetch(`${API_BASE}/pontosInteresse?roteiroId=${roteiro.id}`);
        let pontos = [];

        if (resPontos.ok) pontos = await resPontos.json();

        console.log("Pontos carregados:", pontos);

        preencherPontos(pontos);
        plotarPontos(pontos);

    } catch (e) {
        console.error("Erro:", e);
        alert("Erro ao carregar o roteiro.");
    }
}

// ======================
// PREENCHER ROTEIRO
// ======================
function preencherRoteiro(roteiro) {

    document.getElementById("titulo-mapa").innerText = roteiro.destino;
    document.getElementById("pais-localidade").innerText = roteiro.pais ?? "—";

    document.getElementById("data-viagem").innerText =
        `${roteiro.dataInicio} até ${roteiro.dataFim}`;

    document.getElementById("orcamento-viagem").innerText =
        roteiro.custoTotal ? `R$ ${roteiro.custoTotal.toFixed(2)}` : "—";

    const dias = Math.ceil(
        (new Date(roteiro.dataFim) - new Date(roteiro.dataInicio)) /
        (1000 * 60 * 60 * 24)
    );

    document.getElementById("duracao-dias").innerText = `${dias} dias`;
}

// ======================
// PREENCHER LISTA
// ======================
function preencherPontos(lista) {
    const container = document.getElementById("roteiro-container");

    if (!lista.length) {
        container.innerHTML = `<p class="text-muted">Nenhum ponto de interesse cadastrado.</p>`;
        return;
    }

    container.innerHTML = lista.map((p, i) => `
        <div class="mb-3 p-2 rounded border bg-light">
            <h6 class="fw-bold mb-1">${i + 1}. ${p.nome}</h6>
            <p class="mb-1">${p.descricao ?? ""}</p>
            <small class="text-muted">
                Lat: ${p.latitude} | Lng: ${p.longitude}
            </small>
        </div>
    `).join("");
}

initMap();
carregarCompartilhado();

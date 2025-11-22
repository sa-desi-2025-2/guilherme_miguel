// =================== IMPORTS ===================
import { gerarRoteiroGemini } from "./apis/Gemini.js";
import { buscarPontosInteresse, buscarDetalhes, buscarPontosPorCidade } from "./apis/OpenTripMap.js";
// Assumindo que leafLets.js é outro arquivo com a lógica do mapa
// import { initMap } from "./leafLets.js"; 


// =================== ELEMENTOS E VARIÁVEIS ===================
const destino = localStorage.getItem("roteiro_destino");
const inicio = localStorage.getItem("roteiro_inicio");
const fim = localStorage.getItem("roteiro_fim");
const clima = JSON.parse(localStorage.getItem("roteiro_clima"));
const orcamento = localStorage.getItem("roteiro_orcamento");

const destinoEl = document.getElementById("destino-info");
const climaEl = document.getElementById("clima-info");
const tituloMapaEl = document.getElementById("titulo-mapa");
const dataViagemEl = document.getElementById("data-viagem");
const paisLocalidadeEl = document.getElementById("pais-localidade");
const orcamentoEl = document.getElementById("orcamento-viagem");
const pontosListaEl = document.getElementById("pontos-interesse-lista");

// =================== PREENCHIMENTO BÁSICO DO HTML ===================
orcamentoEl.textContent = `BRL ${orcamento}`;
destinoEl.textContent = destino;
paisLocalidadeEl.innerHTML = `<i class="fas fa-map-marker-alt me-1"></i> ${clima.location.country}`;
dataViagemEl.textContent = `${inicio} / ${fim}`;
tituloMapaEl.textContent = `Roteiro ${destino}`;

// CLIMA
climaEl.innerHTML = `
    <h3>Clima Atual em ${destino}</h3>
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


// =================== FUNÇÃO PRINCIPAL PARA POPULAR POIS ===================
/**
 * Busca e renderiza os Pontos de Interesse próximos às atividades do roteiro.
 * @param {object} roteiro - O objeto JSON do roteiro.
 */
async function popularPOIs(roteiro) {
    const allPOIs = [];

    for (const dia of roteiro.dias) {
        for (const atividade of dia.atividades) {
            // Verifica se a atividade tem coordenadas válidas
            if (atividade.coordenadas && atividade.coordenadas.lat && atividade.coordenadas.lon) {
                
                // 1. Busca POIs próximos à coordenada da atividade (1km de raio, máximo 5)
                const pontos = await buscarPontosInteresse(
                    atividade.coordenadas.lat,
                    atividade.coordenadas.lon,
                    1000, // raio de 1km
                    5       // máximo 5 POIs por atividade
                );

                // 2. Pega os detalhes (imagem, descrição) de cada POI
                const detalhesPromises = pontos.map(p => buscarDetalhes(p.xid));
                const detalhesArray = await Promise.all(detalhesPromises);

                // 3. Adiciona apenas os POIs detalhados e com nome à lista geral
                detalhesArray.forEach(d => {
                    if (d && d.name) allPOIs.push(d);
                });
            }
        }
    }

    // 4. Montar e renderizar o HTML
    if (allPOIs.length === 0) {
        pontosListaEl.innerHTML = "Nenhum ponto de interesse encontrado nas proximidades das atividades 😢";
        return;
    }

    pontosListaEl.innerHTML = allPOIs.map(d => `
        <div class="poi-item mb-3 p-2 border rounded d-flex gap-3">
            <img src="${d.preview?.source || 'https://via.placeholder.com/80'}" 
                 alt="${d.name}" width="80" height="80" style="object-fit:cover; border-radius:5px;">
            <div class="poi-info">
                <h5 class="mb-1">${d.name}</h5>
                <p class="mb-0 text-muted">${d.wikipedia_extracts?.text || d.info?.descr || "Sem descrição disponível"}</p>
            </div>
        </div>
    `).join("");
}



// =================== GEMINI + OPENTRIPMAP (INICIALIZAÇÃO) ===================
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const dadosViagem = {
            pais: localStorage.getItem("roteiro_pais"),
            cidade: localStorage.getItem("roteiro_destino"),
            inicio: localStorage.getItem("roteiro_inicio"),
            fim: localStorage.getItem("roteiro_fim"),
            interesses: localStorage.getItem("roteiro_hobbies"),
            gastronomia: localStorage.getItem("roteiro_gastronomia"),
            orcamento: localStorage.getItem("roteiro_orcamento"),
            viajante: localStorage.getItem("roteiro_tipo")
        };

        // 1️⃣ Gemini: gera roteiro (Retorna o JSON limpo em formato de string)
        const roteiroTexto = await gerarRoteiroGemini(dadosViagem);

        if (!roteiroTexto) {
            throw new Error("Falha ao gerar roteiro com Gemini.");
        }

        // 2️⃣ Parsear a resposta JSON
        let roteiro;
        try {
            roteiro = JSON.parse(roteiroTexto);
        } catch (e) {
            console.error("Erro ao parsear JSON do Gemini:", roteiroTexto, e);
            alert("Erro ao processar o roteiro. Tente novamente.");
            return;
        }

        // 3️⃣ Preencher coordenadas faltantes
        // Se o Gemini não souber a coordenada de um ponto específico, tentamos buscar pelo título.
        for (const dia of roteiro.dias) {
            for (const atividade of dia.atividades) {
                if ((!atividade.coordenadas || !atividade.coordenadas.lat) && atividade.titulo) {
                    // Busca um ponto com o mesmo nome da atividade dentro de 5km da cidade principal.
                    const pontos = await buscarPontosPorCidade(atividade.titulo, dadosViagem.pais, 5000, 1);
                    if (pontos && pontos.length > 0) {
                        atividade.coordenadas = {
                            lat: pontos[0].point.lat,
                            lon: pontos[0].point.lon
                        };
                    } else {
                        atividade.coordenadas = { lat: null, lon: null };
                    }
                }
            }
        }

        // 4️⃣ Montar HTML do roteiro
        const roteiroDiv = document.createElement("div");
        roteiroDiv.classList.add("mt-4", "p-3", "border", "rounded");
        roteiroDiv.innerHTML = `<h3>Roteiro Gerado pela IA</h3>
            ${roteiro.dias.map(dia => `
                <h4>Dia ${dia.dia} - ${dia.data}</h4>
                ${dia.atividades.map(a => `
                    <div style="margin-bottom: 10px">
                        <b>${a.periodo.toUpperCase()} - ${a.titulo}</b><br>
                        Tipo: ${a.tipo}<br>
                        Descrição: ${a.descricao}<br>
                        Coordenadas: ${a.coordenadas.lat && a.coordenadas.lon ? `${a.coordenadas.lat}, ${a.coordenadas.lon}` : "Não disponível"}
                    </div>
                `).join("")}
            `).join("")}
        `;
        document.querySelector(".main-content-grid").appendChild(roteiroDiv);

        // 5️⃣ Buscar POIs próximos às atividades e popular a lista
        // Esta chamada faz a busca no OpenTripMap e preenche o elemento 'pontosListaEl'
        await popularPOIs(roteiro);

    } catch (err) {
        console.error("Erro ao carregar roteiro ou pontos de interesse:", err);
        pontosListaEl.innerHTML = "Erro ao carregar pontos de interesse 😢. Verifique o console para mais detalhes.";
    }
});
// frontend/pages/mapa-page.js
// Completo: carregar roteiro, chamar Gemini, salvar pontos no backend, buscar e renderizar.

// =================== IMPORTS ===================
import { gerarRoteiroGemini } from "../js/apis/Gemini.js";
import { buscarLocaisCidade } from "../js/apis/PlacesOSM.js";

// =================== CONFIG / ENDPOINTS ===================
const API_BASE = "http://localhost:8081";

// =================== PEGAR ID DA URL ===================
const params = new URLSearchParams(window.location.search);
const roteiroId = params.get("id");

// --- Validação completa do ID ---
if (!roteiroId || roteiroId === "{}" || isNaN(Number(roteiroId))) {
  alert("ID do roteiro inválido na URL! Ex: mapa-page.html?id=3");
  throw new Error("ID inválido na URL");
}

console.log("ID do roteiro capturado:", roteiroId);

// =================== HELPERS UI ===================
function qs(id) {
  return document.getElementById(id);
}

function ensureElement(id, defaultTag = "div") {
  let el = qs(id);
  if (!el) {
    el = document.createElement(defaultTag);
    el.id = id;
    document.body.appendChild(el);
  }
  return el;
}

const destinoEl = ensureElement("destino-info", "span");
const climaEl = ensureElement("clima-info", "div");
const tituloMapaEl = ensureElement("titulo-mapa", "h1");
const dataViagemEl = ensureElement("data-viagem", "div");
const paisLocalidadeEl = ensureElement("pais-localidade", "div");
const orcamentoEl = ensureElement("orcamento-viagem", "div");
const roteiroContainerEl = ensureElement("roteiro-container", "div");

const statusEl = (() => {
  const id = "mapa-status";
  const existing = qs(id);
  if (existing) return existing;
  const s = document.createElement("div");
  s.id = id;
  s.style.margin = "10px 0";
  roteiroContainerEl.parentNode.insertBefore(s, roteiroContainerEl);
  return s;
})();

// =================== FUNÇÕES DE BACKEND ===================
async function carregarRoteiroBackend() {
  const res = await fetch(`${API_BASE}/roteiros/${roteiroId}`);
  if (!res.ok) throw new Error(`Erro ao buscar roteiro: ${res.statusText}`);
  return await res.json();
}

async function salvarPontoBackend(ponto) {
  const res = await fetch(`${API_BASE}/pontosInteresse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ponto),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => null);
    throw new Error(`Erro ao salvar ponto: ${res.status} ${txt}`);
  }

  return await res.json();
}

async function buscarPontosDoBackend(roteiroIdParam) {
  const res = await fetch(
    `${API_BASE}/pontosInteresse/roteiro/${roteiroIdParam}`
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar pontos salvos: ${res.statusText}`);
  }

  return await res.json();
}

// =================== AUXILIARES ===================
function showStatus(msg) {
  statusEl.textContent = msg;
}

function clearStatus() {
  statusEl.textContent = "";
}

function formatCoord(v) {
  if (v === null || v === undefined) return "?";
  return Number(v).toFixed(6);
}

function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// =================== RENDERIZAÇÃO DO BANCO ===================
function renderizarRoteiroBanco(pontos) {
  const container = roteiroContainerEl;
  container.innerHTML = "";

  if (!pontos || pontos.length === 0) {
    container.innerHTML = "<p>Nenhum ponto salvo para este roteiro.</p>";
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "roteiro-salvo";

  const header = document.createElement("h3");
  header.textContent = "Pontos salvos no roteiro";
  wrapper.appendChild(header);

  pontos.forEach((p) => {
    const card = document.createElement("div");
    card.className = "ponto-card";
    card.style.border = "1px solid #ccc";
    card.style.padding = "10px";
    card.style.marginBottom = "8px";
    card.style.borderRadius = "6px";

    card.innerHTML = `
      <strong>${escapeHtml(p.nome)}</strong><br>
      <span style="color:#555">(${formatCoord(p.latitude)}, ${formatCoord(
      p.longitude
    )})</span>
      <div style="margin-top:6px">${escapeHtml(p.descricao || "-")}</div>
    `;

    wrapper.appendChild(card);
  });

  container.appendChild(wrapper);
}

// =================== EXECUÇÃO PRINCIPAL ===================
document.addEventListener("DOMContentLoaded", main);

async function main() {
  try {
    showStatus("Carregando roteiro...");

    const roteiroBD = await carregarRoteiroBackend();
    console.log("Roteiro carregado:", roteiroBD);

    // Preencher UI
    destinoEl.textContent = roteiroBD.destino;
    dataViagemEl.textContent = `${roteiroBD.dataInicio} / ${roteiroBD.dataFim}`;
    tituloMapaEl.textContent = `Roteiro ${roteiroBD.destino}`;
    orcamentoEl.textContent = `BRL ${roteiroBD.custoTotal ?? "—"}`;
    paisLocalidadeEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${roteiroBD.pais}`;

    const clima = JSON.parse(localStorage.getItem("roteiro_clima") || "null");
    const hobbies = localStorage.getItem("roteiro_hobbies") || "";
    const gastronomia = localStorage.getItem("roteiro_gastronomia") || "";
    const tipoViagem = localStorage.getItem("roteiro_tipo") || "";
    const orcamentoLocal =
      localStorage.getItem("roteiro_orcamento") || roteiroBD.custoTotal;

    if (clima?.current) {
      climaEl.innerHTML = `
        <h4>Clima</h4>
        <div>${clima.current.temp_c}°C — ${escapeHtml(
          clima.current.condition?.text
        )}</div>
      `;
    }

    // ================================================
    // 1️⃣ VERIFICA SE PONTOS JÁ EXISTEM NO BANCO
    // ================================================
    showStatus("Buscando pontos no banco...");
    const pontosExistentes = await buscarPontosDoBackend(Number(roteiroId));

    if (pontosExistentes.length > 0) {
      console.log("Pontos já existem — NÃO chamando Gemini.");
      clearStatus();
      renderizarRoteiroBanco(pontosExistentes);
      return; // <<< ENCERRA A EXECUÇÃO (IMPORTANTE)
    }

    // ================================================
    // 2️⃣ NENHUM PONTO EXISTE → CHAMAR GEMINI
    // ================================================
    showStatus("Buscando locais turísticos...");
    const locais = await buscarLocaisCidade(
      roteiroBD.destino,
      roteiroBD.pais,
      50
    );

    if (!locais?.length) {
      clearStatus();
      alert("Nenhum local turístico encontrado.");
      return;
    }

    showStatus("Gerando roteiro com IA...");
    const dadosGemini = {
      pais: roteiroBD.pais,
      destino: roteiroBD.destino,
      inicio: roteiroBD.dataInicio,
      fim: roteiroBD.dataFim,
      hobbies,
      gastronomia,
      tipoViagem,
      orcamento: Number(orcamentoLocal),
      clima,
    };

    const roteiroIA = await gerarRoteiroGemini(dadosGemini, locais);
    console.log("Roteiro IA:", roteiroIA);

    // ================================================
    // 3️⃣ SALVAR OS PONTOS NO BANCO
    // ================================================
    showStatus("Salvando atividades no banco...");

    const atividades = [];
    roteiroIA.dias.forEach((d) => {
      d.atividades.forEach((a) => {
        atividades.push({
          titulo: a.titulo,
          descricao: (a.descricao || "").substring(0, 5000),
          lat: a.coordenadas?.lat ?? null,
          lon: a.coordenadas?.lon ?? null,
        });
      });
    });

    for (const atv of atividades) {
      const pontoDB = {
        nome: atv.titulo,
        descricao: atv.descricao,
        avaliacaoMedia: null,
        latitude: atv.lat,
        longitude: atv.lon,
        categoria: null,
        roteiro: { id: Number(roteiroId) },
      };

      try {
        await salvarPontoBackend(pontoDB);
      } catch (err) {
        console.error("Falha ao salvar ponto:", pontoDB, err);
      }
    }

    // ================================================
    // 4️⃣ BUSCAR E RENDERIZAR
    // ================================================
    showStatus("Buscando pontos salvos...");
    const pontosSalvos = await buscarPontosDoBackend(Number(roteiroId));

    clearStatus();
    renderizarRoteiroBanco(pontosSalvos);

  } catch (err) {
    clearStatus();
    console.error("Erro geral:", err);
    alert("Erro ao carregar/gerar o roteiro. Veja o console.");
  }
}

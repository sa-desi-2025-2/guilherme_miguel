// frontend/pages/mapa-page.js
import { gerarRoteiroGemini } from "../js/apis/Gemini.js";
import { buscarLocaisCidade } from "../js/apis/PlacesOSM.js";
import { initMap, plotarPontos } from "../js/apis/leafLets.js";
import { getWeather, calcularDiasViagem } from "../js/apis/Weather.js";
import { converterMoeda, getMoedaPorPais } from "../js/apis/Currency.js";


const API_BASE = "http://localhost:8081";

// Pegar ID da URL
const params = new URLSearchParams(window.location.search);
const roteiroId = params.get("id");

if (!roteiroId || roteiroId === "{}" || isNaN(Number(roteiroId))) {
  alert("ID do roteiro inválido na URL! Ex: mapa-page.html?id=3");
  throw new Error("ID inválido na URL");
}

console.log("ID do roteiro capturado:", roteiroId);

// =================== HELPERS UI ===================
// =================== HELPERS UI ===================
function qs(id) { return document.getElementById(id); }
function ensureElement(id, defaultTag = "div") {
  let el = qs(id);
  if (!el) { el = document.createElement(defaultTag); el.id = id; document.body.appendChild(el); }
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
    if(existing) return existing;
    const s = document.createElement("div");
    s.id = id;
    s.style.margin="10px 0";
    // Adiciona o status antes do container de roteiro
    roteiroContainerEl.parentNode.insertBefore(s, roteiroContainerEl); 
    return s;
})();

// --- Controles de Loading e Erro ---
const loadingOverlay = document.getElementById("loading-overlay-mapa");
const errorOverlay = document.getElementById("error-overlay-mapa");
const errorMessageEl = document.getElementById("error-message-mapa");

function showLoading() {
    if(loadingOverlay) loadingOverlay.classList.remove("d-none");
    if(errorOverlay) errorOverlay.classList.add("d-none");
    document.body.style.overflow = "hidden"; // Evita scroll
}

function hideLoading() {
    if(loadingOverlay) loadingOverlay.classList.add("d-none");
    document.body.style.overflow = "";
}

function showErrorScreen(message) {
    hideLoading();
    if(errorMessageEl) errorMessageEl.textContent = message;
    if(errorOverlay) errorOverlay.classList.remove("d-none");
    document.body.style.overflow = "hidden";
}
// =================== FUNÇÕES DE BACKEND ===================
async function carregarRoteiroBackend() {
  const res = await fetch(`${API_BASE}/roteiros/${roteiroId}`);
  if(!res.ok) throw new Error(`Erro ao buscar roteiro: ${res.statusText}`);
  return await res.json();
}

async function salvarPontoBackend(ponto) {
  const res = await fetch(`${API_BASE}/pontosInteresse`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ponto)
  });
  if(!res.ok) { const txt = await res.text().catch(()=>null); throw new Error(`Erro ao salvar ponto: ${res.status} ${txt}`); }
  return await res.json();
}

async function buscarPontosDoBackend(roteiroIdParam) {
  const res = await fetch(`${API_BASE}/pontosInteresse/roteiro/${roteiroIdParam}`);
  if(!res.ok) throw new Error(`Erro ao buscar pontos salvos: ${res.statusText}`);
  return await res.json();
}

// =================== AUXILIARES ===================

function showStatus(msg) { statusEl.textContent = msg; }
function clearStatus() { statusEl.textContent = ""; }
function formatCoord(v) { if(v==null) return "?"; return Number(v).toFixed(6); }
function escapeHtml(s){ if(!s) return ""; return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function renderizarRoteiroBanco(pontos){
  const container = roteiroContainerEl;
  container.innerHTML = "";
  if(!pontos || pontos.length===0){ container.innerHTML="<p>Nenhum ponto salvo para este roteiro.</p>"; return; }
  const wrapper = document.createElement("div"); wrapper.className="roteiro-salvo";
  const header = document.createElement("h3"); header.textContent="Pontos salvos no roteiro"; wrapper.appendChild(header);
  pontos.forEach(p=>{
    const card=document.createElement("div");
    card.className="ponto-card";
    card.style.border="1px solid #ccc";
    card.style.padding="10px";
    card.style.marginBottom="8px";
    card.style.borderRadius="6px";
    card.innerHTML=`
      <strong>${escapeHtml(p.nome)}</strong><br>
      <span style="color:#555">(${formatCoord(p.latitude)}, ${formatCoord(p.longitude)})</span>
      <div style="margin-top:6px">${escapeHtml(p.descricao||"-")}</div>
    `;
    wrapper.appendChild(card);
  });
  container.appendChild(wrapper);
}

// =================== EXECUÇÃO PRINCIPAL ===================
document.addEventListener("DOMContentLoaded", main);

async function main(){
  
  // 1. Mostrar loading imediatamente
  showLoading();
  let erroDetalhado = "Ocorreu um erro ao processar seu roteiro. Verifique sua conexão e tente novamente.";

  try{
    showStatus("Carregando roteiro do servidor...");
    const roteiroBD = await carregarRoteiroBackend();
    console.log("Roteiro carregado:", roteiroBD);
    erroDetalhado = "Erro ao buscar locais turísticos.";

    // UI básico (pode ser feito com o loading ativo)
    destinoEl.textContent = roteiroBD.destino;
    dataViagemEl.textContent = `${roteiroBD.dataInicio} / ${roteiroBD.dataFim}`;
    tituloMapaEl.textContent = `Roteiro ${roteiroBD.destino}`;
    orcamentoEl.textContent = `BRL ${roteiroBD.custoTotal ?? "—"}`;
    paisLocalidadeEl.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${roteiroBD.pais}`;

    // Atualiza orçamento convertido e duração
    atualizarOrcamentoConvertido(roteiroBD.custoTotal ?? 0, roteiroBD.pais);
    atualizarDuracao(roteiroBD.dataInicio, roteiroBD.dataFim);

    erroDetalhado = "Erro ao buscar clima do destino.";
    // ===== CLIMA =====
    const clima = await getWeather(roteiroBD.destino, roteiroBD.pais, roteiroBD.dataInicio, roteiroBD.dataFim);
    renderClima(clima, roteiroBD.destino, roteiroBD.dataInicio, roteiroBD.dataFim);
    localStorage.setItem("roteiro_clima", JSON.stringify(clima));

    // Inicializa mapa (no Brasil, pois a localização exata virá depois)
    initMap(-23.55052, -46.633308, 13);
    
    erroDetalhado = "Erro ao buscar pontos salvos no banco de dados.";
    // Buscar pontos no banco
    showStatus("Buscando pontos no banco...");
    const pontosExistentes = await buscarPontosDoBackend(Number(roteiroId));

    if(pontosExistentes.length>0){
      clearStatus();
      renderizarRoteiroBanco(pontosExistentes);
      plotarPontos(pontosExistentes);
      hideLoading(); // Fim do carregamento
      return;
    }

    // Nenhum ponto existente → chamar IA
    erroDetalhado = "Nenhum local turístico encontrado. Tente outro destino.";
    showStatus("Buscando locais turísticos...");
    const locais = await buscarLocaisCidade(roteiroBD.destino, roteiroBD.pais, 50);
    if(!locais?.length){ clearStatus(); throw new Error(erroDetalhado); }
    
    erroDetalhado = "Falha na comunicação com a IA (Gemini).";
    showStatus("Gerando roteiro com IA...");
    const hobbies = localStorage.getItem("roteiro_hobbies") || "";
    const gastronomia = localStorage.getItem("roteiro_gastronomia") || "";
    const tipoViagem = localStorage.getItem("roteiro_tipo") || "";
    const orcamentoLocal = localStorage.getItem("roteiro_orcamento") || roteiroBD.custoTotal;

    const dadosGemini = { pais: roteiroBD.pais, destino: roteiroBD.destino, inicio: roteiroBD.dataInicio, fim: roteiroBD.dataFim, hobbies, gastronomia, tipoViagem, orcamento:Number(orcamentoLocal), clima };
    const roteiroIA = await gerarRoteiroGemini(dadosGemini, locais);
    console.log("Roteiro IA:", roteiroIA);
    
    // Salvar pontos no banco
    erroDetalhado = "Erro ao salvar as atividades geradas pela IA.";
    showStatus("Salvando atividades no banco...");
    const atividades = [];
    roteiroIA.dias.forEach(d=>{ d.atividades.forEach(a=>{
      atividades.push({titulo:a.titulo, descricao:(a.descricao||"").substring(0,5000), lat:a.coordenadas?.lat??null, lon:a.coordenadas?.lon??null});
    }); });

    for(const atv of atividades){
      const pontoDB = { nome: atv.titulo, descricao: atv.descricao, avaliacaoMedia:null, latitude:atv.lat, longitude:atv.lon, categoria:null, roteiro:{id:Number(roteiroId)} };
      // Usamos try/catch interno para não interromper se apenas um ponto falhar
      try{ await salvarPontoBackend(pontoDB); }catch(err){ console.error("Falha ao salvar ponto:", pontoDB, err); }
    }

    // Buscar e renderizar
    showStatus("Buscando pontos salvos...");
    const pontosSalvos = await buscarPontosDoBackend(Number(roteiroId));
    clearStatus();
    renderizarRoteiroBanco(pontosSalvos);
    plotarPontos(pontosSalvos);
    
    hideLoading(); // Fim do carregamento

  }catch(err){
    console.error("Erro geral no MAIN:", err);
    // 2. Esconder loading e mostrar tela de erro com a mensagem detalhada
    showErrorScreen(erroDetalhado);
  }
}



function atualizarDuracao(dataInicioStr, dataFimStr) {
  const duracaoD = document.getElementById("duracao-dias");
  if(!duracaoD) return;

  const inicio = new Date(dataInicioStr);
  const fim = new Date(dataFimStr);

  const diffMs = fim - inicio;
  // O + 1 é para incluir o dia de chegada
  const duracaoDias = Math.ceil(diffMs / (1000*60*60*24)) + 1;

  duracaoD.textContent = `${duracaoDias} dia${duracaoDias > 1 ? "s" : ""}`;
  
  // Se a duração for inválida (data início depois da data fim), aplica a classe de erro
  if (duracaoDias <= 0) {
      duracaoD.classList.add("duration-negative");
      duracaoD.textContent = "Data Inválida";
  } else {
      duracaoD.classList.remove("duration-negative");
  }
}

// Substituir o bloco DOMContentLoaded original da duração
document.addEventListener("DOMContentLoaded", async () => {
  // A duração agora é calculada dentro do main
});


// Mapeamento de códigos de clima (WMO) para ícones e descrição (usando Bootstrap Icons)
function getWeatherIconAndDescription(code) {
    // Referência WMO: https://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM
    let iconClass = 'bi-question-circle'; // Ícone padrão
    let description = 'Desconhecido';

    switch (code) {
        case 0: // Céu limpo
            iconClass = 'bi-sun';
            description = 'Céu Limpo';
            break;
        case 1: // Predominantemente claro
        case 2: // Parcialmente nublado
        case 3: // Nublado
            iconClass = 'bi-cloud-sun';
            description = 'Parcialmente Nublado';
            break;
        case 45: // Nevoeiro
        case 48: // Névoa depositante
            iconClass = 'bi-cloud-fog';
            description = 'Nevoeiro';
            break;
        case 51: // Chuvisco leve
        case 53: // Chuvisco moderado
        case 55: // Chuvisco denso
            iconClass = 'bi-cloud-drizzle';
            description = 'Chuvisco';
            break;
        case 61: // Chuva fraca
        case 63: // Chuva moderada
        case 65: // Chuva forte
            iconClass = 'bi-cloud-rain';
            description = 'Chuva';
            break;
        case 66: // Chuva congelante fraca
        case 67: // Chuva congelante forte
            iconClass = 'bi-cloud-sleet';
            description = 'Chuva Congelante';
            break;
        case 71: // Neve fraca
        case 73: // Neve moderada
        case 75: // Neve forte
            iconClass = 'bi-snow';
            description = 'Neve';
            break;
        case 77: // Grãos de neve
            iconClass = 'bi-snow2';
            description = 'Grãos de Neve';
            break;
        case 80: // Pancadas de chuva fracas
        case 81: // Pancadas de chuva moderadas
        case 82: // Pancadas de chuva violentas
            iconClass = 'bi-cloud-rain-heavy';
            description = 'Pancadas de Chuva';
            break;
        case 85: // Pancadas de neve fracas
        case 86: // Pancadas de neve fortes
            iconClass = 'bi-snow';
            description = 'Pancadas de Neve';
            break;
        case 95: // Tempestade fraca ou moderada
        case 96: // Tempestade com granizo fraco
        case 99: // Tempestade com granizo forte
            iconClass = 'bi-cloud-lightning-rain';
            description = 'Tempestade';
            break;
    }

    return { iconClass, description };
}

function renderClima(clima, destino, dataInicio, dataFim){
    if(!clima?.daily) return;

    const days = clima.daily.time.map((date, i) => ({
        date,
        tempMax: clima.daily.temperature_2m_max[i],
        tempMin: clima.daily.temperature_2m_min[i],
        precipitation: clima.daily.precipitation_sum[i],
        weatherCode: clima.daily.weathercode[i]
    }));

    // Obtém ícone e descrição do primeiro dia (dia atual/primeiro da viagem)
    const { iconClass: todayIcon, description: todayDescription } = getWeatherIconAndDescription(days[0].weatherCode);

    let html = `
      <div class="card-body p-3">
        <div class="text-center mb-4 p-3 rounded" style="background-color: #f8f9fa;">
          <i class="${todayIcon} text-warning" style="font-size: 3rem;"></i><br>
          <div class="lead text-primary">${todayDescription}</div>
          <h1 class="display-4 text-dark mb-0">${days[0].tempMax.toFixed(1)}°C</h1>
          <div class="lead text-primary">Máx: ${days[0].tempMax.toFixed(1)}°C / Mín: ${days[0].tempMin.toFixed(1)}°C</div>
        </div>

        <div class="d-flex justify-content-around text-center border-bottom pb-3 mb-3">
          <div class="flex-fill">
            <i class="bi bi-droplet-half text-info" style="font-size:1.5rem"></i><br>
            <small class="text-muted">Chuva</small><br>
            <strong class="text-dark">${days[0].precipitation.toFixed(1)} mm</strong>
          </div>
        </div>

        <small class="text-uppercase text-muted d-block mb-2">Próximos Dias</small>
    `;

    days.forEach(dia => {
        const dataFormatada = new Date(dia.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        const { iconClass: dayIcon, description: dayDescription } = getWeatherIconAndDescription(dia.weatherCode);

        html += `
        <div class="d-flex justify-content-between align-items-center py-2 border-bottom">
          <div class="text-muted small">${dataFormatada}</div>
          <div>
            <i class="${dayIcon} text-secondary me-2"></i> 
          </div>
          <div class="font-weight-bold text-dark">
            ${dia.tempMax.toFixed(1)}°C / ${dia.tempMin.toFixed(1)}°C
          </div>
          <div class="text-muted small d-none d-md-block">
            Chuva: ${dia.precipitation.toFixed(1)} mm
          </div>
        </div>
        `;
    });

    html += `</div>`;
    climaEl.innerHTML = html;
}


async function atualizarOrcamentoConvertido(custoBRL, paisISO) {
    const moedaDestino = getMoedaPorPais(paisISO);
    const valorConvertido = await converterMoeda(custoBRL, "BRL", moedaDestino);
    const el = document.getElementById("orcamento-convertido");
    if(valorConvertido != null){
        el.textContent = `${valorConvertido.toFixed(2)} ${moedaDestino}`;
    } else {
        el.textContent = "—";
    }
}


document.addEventListener("DOMContentLoaded", async () => {  // <-- async aqui

    // busca o roteiro do backend
    const carregarBanco = await carregarRoteiroBackend();

    const duracaoD = document.getElementById("duracao-dias");
    if(!duracaoD) return;

    // usa as datas do roteiro
    const inicio = new Date(carregarBanco.dataInicio);
    const fim = new Date(carregarBanco.dataFim);

    const diffMs = fim - inicio;
    const duracaoDias = Math.ceil(diffMs / (1000*60*60*24)) + 1;

    duracaoD.textContent = `${duracaoDias} dia${duracaoDias > 1 ? "s" : ""}`;
});


document.addEventListener("DOMContentLoaded", () => {

    const btnExcluir = document.getElementById("btn-excluir");
    if (!btnExcluir) return;

    btnExcluir.addEventListener("click", async () => {
        
        const confirmar = confirm("Tem certeza que deseja excluir este roteiro? Todos os pontos de interesse associados também serão apagados.");
        if (!confirmar) return;

        try {
            const res = await fetch(`http://localhost:8081/roteiros/${roteiroId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                alert("Erro ao excluir o roteiro.");
                return;
            }

            alert("Roteiro excluído com sucesso!");
            window.location.href = "../pages/roteiro-page.html"; // Redireciona para dashboard

        } catch (e) {
            console.error("Erro ao excluir:", e);
            alert("Erro interno ao excluir o roteiro.");
        }
    });

});




document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("btn-compartilhar");
    if (!btn) return;

    const modalEl = document.getElementById("modalCompartilhar");
    const modal = new bootstrap.Modal(modalEl);
    const inputLink = document.getElementById("linkCompartilhar");
    const btnCopiar = document.getElementById("btnCopiarLink");

    btn.addEventListener("click", async () => {
        const roteiro = await carregarRoteiroBackend();

        if (!roteiro.shareToken) {
            alert("Erro: roteiro sem token!");
            return;
        }

        const urlPublica = `${window.location.origin}/frontend/pages/visualizar-page.html?token=${roteiro.shareToken}`;

        // coloca o link no input
        inputLink.value = urlPublica;

        // abre o modal
        modal.show();
    });

    // botão copiar
    btnCopiar.addEventListener("click", () => {
        navigator.clipboard.writeText(inputLink.value)
            .then(() => {
                btnCopiar.innerHTML = `<i class="fas fa-check"></i>`;
                setTimeout(() => {
                    btnCopiar.innerHTML = `<i class="fas fa-copy"></i>`;
                }, 1500);
            });
    });
});


document.addEventListener("DOMContentLoaded", () => {

    const btnEditar = document.getElementById("btn-editar");

    // Recupera ID do roteiro salvo no localStorage
    const roteiroId = localStorage.getItem("roteiro_id");

    if (btnEditar && roteiroId) {
        btnEditar.addEventListener("click", () => {
            // Redireciona para página de edição
            window.location.href = `../pages/editar-roteiro.html?id=${roteiroId}`;
        });
    }
});

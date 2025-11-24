// criacao-page.js (VERSÃO CORRIGIDA E OTIMIZADA)

import { buscarUsuarioPorEmail } from "../js/conexao/usuario.js";
import { salvarRoteiroBackend } from "../js/conexao/roteiro.js";
import { getWeather } from "../js/apis/Weather.js";
import { listarPaises } from "../js/apis/Country.js";
import { buscarLocaisCidade } from "./apis/PlacesOSM.js";


// ================================
// 1) Carregar lista de países com Select2
// ================================

async function carregarPaises() {
    const select = $("#pais");

    const paises = await listarPaises();
    paises.sort((a, b) => a.nome.localeCompare(b.nome));

    const data = paises.map(p => ({
        id: p.iso2,
        text: p.nome,
        bandeira: p.bandeira
    }));

    function formatPais(pais) {
        if (!pais.id) return pais.text;

        const img = `<img src="${pais.bandeira}" width="20" style="margin-right: 8px; border-radius: 3px;">`;

        return $(`<span style="display:flex; align-items:center;">${img} ${pais.text}</span>`);
    }

    select.select2({
        data,
        templateResult: formatPais,
        templateSelection: formatPais,
        placeholder: "Selecione um país",
        allowClear: true
    });
}

carregarPaises();


// ================================
// 2) Submissão do formulário
// ================================

const form = document.querySelector("form");
const loadingOverlay = document.getElementById("loading-overlay");
const errorOverlay = document.getElementById("error-overlay");
const errorMessageEl = document.getElementById("error-message");


// --- Funções de Controle de Estado ---
function showLoading() {
    loadingOverlay.classList.remove("d-none");
    errorOverlay.classList.add("d-none");
    document.body.style.overflow = "hidden"; // Evita scroll na tela de loading
}

function hideLoading() {
    loadingOverlay.classList.add("d-none");
    document.body.style.overflow = "";
}

function showErrorScreen(message) {
    hideLoading();
    errorMessageEl.textContent = message;
    errorOverlay.classList.remove("d-none");
    document.body.style.overflow = "hidden";
}

window.hideErrorScreen = function() {
    errorOverlay.classList.add("d-none");
    document.body.style.overflow = "";
}
// -------------------------------------


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Mostrar loading imediatamente
    showLoading();
    let erroDetalhado = "Erro desconhecido. Por favor, tente novamente.";

    try {
        // --- Campos do formulário ---
        const destino = document.querySelector("#destino").value.trim();
        const inicio = document.querySelector("#inicio").value;
        const fim = document.querySelector("#fim").value;
        const orcamento = document.querySelector("#orcamento").value;
        const pais = document.querySelector("#pais").value;
        const hobbies = document.querySelector("#hobbies").value.trim();
        const gastronomia = document.querySelector("#gastronomia").value.trim();
        const tipo = document.querySelector("#tipo").value.trim();

        if (!destino || !inicio || !fim) {
            erroDetalhado = "Preencha destino e datas para continuar.";
            throw new Error(erroDetalhado);
        }

        // ================================
        // 3) Buscar locais com PlacesOSM/OpenTripMap
        // ================================
        let locais = [];
        try {
            locais = await buscarLocaisCidade(destino, pais, 50);
        } catch (err) {
            console.error("Erro ao buscar locais:", err);
            erroDetalhado = "Falha ao buscar locais turísticos (OpenTripMap).";
            throw err;
        }

        if (!Array.isArray(locais) || locais.length === 0) {
            erroDetalhado = "Nenhum local turístico encontrado para este destino.";
            throw new Error(erroDetalhado);
        }

        // Guardar no localStorage
        localStorage.setItem("roteiro_locais_otm", JSON.stringify(locais));


        // ================================
        // 4) Extrair coordenadas do primeiro local encontrado
        // ================================
        const primeiroLocal = locais[0];

        const lat = primeiroLocal?.lat;
        const lon = primeiroLocal?.lon;

        if (!lat || !lon) {
            console.error("Locais retornados:", locais);
            erroDetalhado = "Não foi possível obter coordenadas da cidade.";
            throw new Error(erroDetalhado);
        }

        console.log("Coordenadas detectadas:", lat, lon);


        // ================================
        // 5) Clima usando Weather.js (Open-Meteo)
        // ================================
        let weatherData;
        try {
            weatherData = await getWeather(lat, lon, inicio, fim);
        } catch (err) {
            console.error("Erro ao buscar clima:", err);
            erroDetalhado = "Falha ao obter clima do destino.";
            throw err;
        }

        localStorage.setItem("roteiro_clima", JSON.stringify(weatherData));


        // ================================
        // 6) Salvar informações básicas no localStorage
        // ================================
        localStorage.setItem("roteiro_destino", destino);
        localStorage.setItem("roteiro_inicio", inicio);
        localStorage.setItem("roteiro_fim", fim);
        localStorage.setItem("roteiro_orcamento", orcamento);
        localStorage.setItem("roteiro_pais", pais);
        localStorage.setItem("roteiro_hobbies", hobbies);
        localStorage.setItem("roteiro_gastronomia", gastronomia);
        localStorage.setItem("roteiro_tipo", tipo);


        // ================================
        // 7) Verificar usuário logado
        // ================================
        const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

        if (!usuarioLogado) {
            erroDetalhado = "Nenhum usuário logado. Faça login antes de criar um roteiro.";
            throw new Error(erroDetalhado);
        }

        const usuarioBackend = await buscarUsuarioPorEmail(usuarioLogado.email);

        if (!usuarioBackend) {
            erroDetalhado = "Usuário não encontrado no backend.";
            throw new Error(erroDetalhado);
        }


        // ================================
        // 8) Criar objeto do roteiro e salvar no backend
        // ================================
        const roteiroBackend = {
            pais: pais,
            destino: destino,
            dataInicio: inicio,
            dataFim: fim,
            custoTotal: Number(orcamento) || 0,
            usuario: { id: usuarioBackend.id }
        };

        const salvo = await salvarRoteiroBackend(roteiroBackend);

        if (!salvo) {
            erroDetalhado = "Erro ao salvar roteiro no backend.";
            throw new Error(erroDetalhado);
        }

        console.log("Roteiro salvo:", salvo);

        // 9. Esconder o loading e redirecionar
        hideLoading();
        window.location.href = `/frontend/pages/mapa-page.html?id=${salvo.id}`;

    } catch (error) {
        // Captura qualquer erro no processo (validação ou API)
        console.error("Falha no processo de criação:", error);
        
        // 2. Esconder loading e mostrar tela de erro
        hideLoading();
        // Tenta usar a mensagem de erro mais detalhada, ou a do objeto Error
        showErrorScreen(erroDetalhado || error.message);
    }
});
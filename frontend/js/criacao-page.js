// criacao-page.js (VERSÃO COMPLETA E CORRIGIDA)

import { buscarUsuarioPorEmail } from "../js/conexao/usuario.js";
import { salvarRoteiroBackend } from "../js/conexao/roteiro.js";
import { getWeather } from "../js/apis/Weather.js";
import { listarPaises } from "../js/apis/Country.js";
import { buscarLocaisCidade } from "./apis/PlacesOSM.js";


// =========================================================
// 1) Carregar lista de países com Select2
// =========================================================

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

$(document).ready(carregarPaises);


// =========================================================
// 2) Submissão do formulário e Lógica de Loading/Animação
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // Variáveis DOM
    const loadingOverlay = document.getElementById("loading-overlay");
    const errorOverlay = document.getElementById("error-overlay");
    const errorMessageEl = document.getElementById("error-message");
    const form = document.querySelector("form");

    // --- Configurações do Carrossel ---
    const loadingPhrases = [
        "Validando suas informações de viagem...",
        "Buscando coordenadas do destino...",
        "Consultando a previsão do tempo...",
        "Salvando roteiro inicial no servidor...",
    ];
    let currentPhraseIndex = 0;
    let phraseInterval;
    let iconInterval;


    // Função para atualizar a frase
    function updateLoadingText() {
        const textElement = document.getElementById("current-loading-text");
        if (textElement) {
            textElement.style.opacity = 0; 
            
            setTimeout(() => {
                currentPhraseIndex = (currentPhraseIndex + 1) % loadingPhrases.length;
                textElement.textContent = loadingPhrases[currentPhraseIndex];
                textElement.style.opacity = 1; 
            }, 500);
        }
    }

    // Função para animar os ícones
    function animateIconsCria() {
        const icons = [
            document.getElementById('loading-icon-cria-1'),
            document.getElementById('loading-icon-cria-2'),
            document.getElementById('loading-icon-cria-3'),
        ];
        const validIcons = icons.filter(icon => icon !== null);
        
        if (validIcons.length === 0) return;

        let currentIconIndex = 0;

        function showNextIcon() {
            validIcons.forEach(icon => {
                if (icon) {
                    icon.style.opacity = 0;
                    icon.style.transform = 'translate(-50%, 100%)'; // Move para fora (abaixo)
                }
            });

            const nextIcon = validIcons[currentIconIndex];
            if (nextIcon) {
                nextIcon.style.opacity = 1;
                nextIcon.style.transform = 'translate(-50%, -50%)'; // Move para o centro
            }
            
            currentIconIndex = (currentIconIndex + 1) % validIcons.length;
        }

        showNextIcon();
        iconInterval = setInterval(showNextIcon, 2500);
    }

    // Função principal para mostrar o loading e iniciar animações
    function showLoading() {
        loadingOverlay.classList.remove("d-none");
        errorOverlay.classList.add("d-none");
        document.body.style.overflow = "hidden"; 
        
        const textElement = document.getElementById("current-loading-text");
        if (textElement) {
            textElement.textContent = loadingPhrases[0];
        }
        phraseInterval = setInterval(updateLoadingText, 10000); 
        
        animateIconsCria();
    }

    // Função principal para esconder o loading e parar animações
    function hideLoading() {
        loadingOverlay.classList.add("d-none");
        document.body.style.overflow = "";

        clearInterval(phraseInterval);
        clearInterval(iconInterval);
    }

    // Função para mostrar a tela de erro
    function showErrorScreen(message) {
        hideLoading();
        errorMessageEl.textContent = message;
        errorOverlay.classList.remove("d-none");
        document.body.style.overflow = "hidden";
    }

    // Função global para o botão 'Voltar ao Formulário'
    window.hideErrorScreen = function() {
        errorOverlay.classList.add("d-none");
        document.body.style.overflow = "";
    }


    // =========================================================
    // 3) Listener de Submissão
    // =========================================================

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

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

            // Busca Locais
            let locais = [];
            try {
                locais = await buscarLocaisCidade(destino, pais, 50);
            } catch (err) {
                erroDetalhado = "Falha ao buscar locais turísticos (OpenTripMap).";
                throw err;
            }

            if (!Array.isArray(locais) || locais.length === 0) {
                erroDetalhado = "Nenhum local turístico encontrado para este destino.";
                throw new Error(erroDetalhado);
            }
            localStorage.setItem("roteiro_locais_otm", JSON.stringify(locais));

            // Extrair Coordenadas
            const primeiroLocal = locais[0];
            const lat = primeiroLocal?.lat;
            const lon = primeiroLocal?.lon;

            if (!lat || !lon) {
                erroDetalhado = "Não foi possível obter coordenadas da cidade.";
                throw new Error(erroDetalhado);
            }

            // Busca Clima
            let weatherData;
            try {
                weatherData = await getWeather(lat, lon, inicio, fim);
            } catch (err) {
                erroDetalhado = "Falha ao obter clima do destino.";
                throw err;
            }
            localStorage.setItem("roteiro_clima", JSON.stringify(weatherData));

            // Salvar no LocalStorage
            localStorage.setItem("roteiro_destino", destino);
            localStorage.setItem("roteiro_inicio", inicio);
            localStorage.setItem("roteiro_fim", fim);
            localStorage.setItem("roteiro_orcamento", orcamento);
            localStorage.setItem("roteiro_pais", pais);
            localStorage.setItem("roteiro_hobbies", hobbies);
            localStorage.setItem("roteiro_gastronomia", gastronomia);
            localStorage.setItem("roteiro_tipo", tipo);


            // Verifica Usuário
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


            // Salvar no Backend
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

            // Redirecionar
            hideLoading();
            window.location.href = `/frontend/pages/mapa-page.html?id=${salvo.id}`;

        } catch (error) {
            console.error("Falha no processo de criação:", error);
            hideLoading();
            showErrorScreen(erroDetalhado || error.message);
        }
    });

});
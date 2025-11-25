import { buscarUsuarioPorEmail } from "../js/conexao/usuario.js";
import { salvarRoteiroBackend } from "../js/conexao/roteiro.js";
import { getWeather } from "../js/apis/Weather.js";
import { listarPaises } from "../js/apis/Country.js";
import { buscarLocaisCidade } from "./apis/PlacesOSM.js";


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

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destino = document.querySelector("#destino").value.trim();
    const inicio = document.querySelector("#inicio").value;
    const fim = document.querySelector("#fim").value;
    const orcamento = document.querySelector("#orcamento").value;
    const pais = document.querySelector("#pais").value;
    const hobbies = document.querySelector("#hobbies").value.trim();
    const gastronomia = document.querySelector("#gastronomia").value.trim();
    const tipo = document.querySelector("#tipo").value.trim();

    if (!destino || !inicio || !fim) {
        alert("Preencha destino e datas!");
        return;
    }


    let locais = [];
    try {
        locais = await buscarLocaisCidade(destino, pais, 50);
    } catch (err) {
        console.error("Erro ao buscar locais:", err);
    }

    if (!Array.isArray(locais) || locais.length === 0) {
        alert("Nenhum local encontrado para este destino (OpenTripMap).");
        return;
    }

    localStorage.setItem("roteiro_locais_otm", JSON.stringify(locais));


    const primeiroLocal = locais[0];

    const lat = primeiroLocal?.lat;
    const lon = primeiroLocal?.lon;

    if (!lat || !lon) {
        console.error("Locais retornados:", locais);
        alert("Não foi possível obter coordenadas da cidade.");
        return;
    }

    console.log("Coordenadas detectadas:", lat, lon);


    let weatherData;
    try {
        weatherData = await getWeather(lat, lon, inicio, fim);
    } catch (err) {
        console.error("Erro ao buscar clima:", err);
        alert("Falha ao obter clima do destino.");
        return;
    }

    localStorage.setItem("roteiro_clima", JSON.stringify(weatherData));


    localStorage.setItem("roteiro_destino", destino);
    localStorage.setItem("roteiro_inicio", inicio);
    localStorage.setItem("roteiro_fim", fim);
    localStorage.setItem("roteiro_orcamento", orcamento);
    localStorage.setItem("roteiro_pais", pais);
    localStorage.setItem("roteiro_hobbies", hobbies);
    localStorage.setItem("roteiro_gastronomia", gastronomia);
    localStorage.setItem("roteiro_tipo", tipo);

    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Nenhum usuário logado.");
        return;
    }

    const usuarioBackend = await buscarUsuarioPorEmail(usuarioLogado.email);

    if (!usuarioBackend) {
        alert("Usuário não encontrado no backend.");
        return;
    }

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
        alert("Erro ao salvar roteiro no backend.");
        return;
    }

    console.log("Roteiro salvo:", salvo);

    window.location.href = `/frontend/pages/mapa-page.html?id=${salvo.id}`;
});

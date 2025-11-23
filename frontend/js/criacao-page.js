import { buscarUsuarioPorEmail } from "../js/conexao/usuario.js";
import { salvarRoteiroBackend } from "../js/conexao/roteiro.js";
import { getWeather } from "../js/apis/Weather.js";
import { listarPaises } from "../js/apis/Country.js";

//-------- Carrega lista de países no select com Select2 -------- 

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
    return $(`
      <span style="display:flex; align-items:center;">
        ${img} ${pais.text}
      </span>
    `);
  }

  select.select2({
    data: data,
    templateResult: formatPais,
    templateSelection: formatPais,
    placeholder: "Selecione um país",
    allowClear: true
  });
}

carregarPaises();


// ---------------Manipulação do formulário----------------

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

    // Buscar clima com WeatherAPI
    const weatherData = await getWeather(destino, pais);

    if (!weatherData) {
        alert("Erro ao buscar clima do destino.");
        return;
    }

    // Salva no localStorage
    localStorage.setItem("roteiro_destino", destino);
    localStorage.setItem("roteiro_inicio", inicio);
    localStorage.setItem("roteiro_fim", fim);
    localStorage.setItem("roteiro_clima", JSON.stringify(weatherData));
    localStorage.setItem("roteiro_orcamento", orcamento);
    localStorage.setItem("roteiro_pais", pais);
    localStorage.setItem("roteiro_hobbies", hobbies);
    localStorage.setItem("roteiro_gastronomia", gastronomia);
    localStorage.setItem("roteiro_tipo", tipo);

    // ➕ PEGAR USUÁRIO LOGADO
    const usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    if (!usuarioLogado) {
        alert("Nenhum usuário logado.");
        return;
    }

    // ➕ BUSCAR ID DO USUÁRIO NO BACKEND
    const usuarioBackend = await buscarUsuarioPorEmail(usuarioLogado.email);

    if (!usuarioBackend) {
        alert("Usuário não encontrado no sistema.");
        return;
    }

    // ➕ CRIA OBJETO DO ROTEIRO PARA O BACKEND
    const roteiroBackend = {
        pais: pais,
        destino: destino,
        dataInicio: inicio,
        dataFim: fim,
        custoTotal: parseFloat(orcamento) || 0,
        usuario: { id: usuarioBackend.id }
    };

    // ➕ SALVAR NO BACKEND
    const salvo = await salvarRoteiroBackend(roteiroBackend);

    if (!salvo) {
        alert("Erro ao salvar roteiro.");
        return;
    }

    console.log("Roteiro salvo no backend:", salvo);

    // ==========================
    //   REDIRECIONAMENTO CERTO
    // ==========================
    const id = salvo.id;
    window.location.href = `/frontend/pages/mapa-page.html?id=${id}`;
});

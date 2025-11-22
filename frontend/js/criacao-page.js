// criacaoForm.js
import { getWeather } from "../js/apis/Weather.js";
import { listarPaises } from "../js/apis/Country.js";

async function carregarPaises() {
  const select = $("#pais");

  const paises = await listarPaises();

  // Organizar alfabeticamente
  paises.sort((a, b) => a.nome.localeCompare(b.nome));

  // Mapeia para o formato Select2
  const data = paises.map(p => ({
    id: p.iso2,
    text: p.nome,
    bandeira: p.bandeira
  }));

  // Função para renderizar bandeiras nas opções
  function formatPais(pais) {
    if (!pais.id) return pais.text;

    const img = `<img src="${pais.bandeira}" width="20" style="margin-right: 8px; border-radius: 3px;">`;
    return $(`
      <span style="display:flex; align-items:center;">
        ${img} ${pais.text}
      </span>
    `);
  }

  // Função para renderizar seleção (quando escolhido)
  function formatPaisSelected(pais) {
    if (!pais.id) return pais.text;

    const img = `<img src="${pais.bandeira}" width="20" style="margin-right: 8px; border-radius: 3px;">`;
    return $(`
      <span style="display:flex; align-items:center;">
        ${img} ${pais.text}
      </span>
    `);
  }

  // Inicializa o Select2
  select.select2({
    data: data,
    templateResult: formatPais,
    templateSelection: formatPaisSelected,
    placeholder: "Selecione um país",
    allowClear: true
  });
}

// Carregar ao abrir
carregarPaises();



const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destino = document.querySelector("#destino").value.trim();
    const inicio = document.querySelector("#inicio").value;
    const fim = document.querySelector("#fim").value;
    const orcamento = document.querySelector("#orcamento").value;
    const pais = document.querySelector("#pais").value;

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

    // Vai para a página do mapa
    window.location.href = "../pages/mapa-page.html";
});





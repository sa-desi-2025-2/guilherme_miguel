// criacaoForm.js
import { getWeather } from "../js/apis/Weather.js";

const form = document.querySelector("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const destino = document.querySelector("#destino").value.trim();
    const inicio = document.querySelector("#inicio").value;
    const fim = document.querySelector("#fim").value;

    if (!destino || !inicio || !fim) {
        alert("Preencha destino e datas!");
        return;
    }

    // Buscar clima com WeatherAPI
    const weatherData = await getWeather(destino);

    if (!weatherData) {
        alert("Erro ao buscar clima do destino.");
        return;
    }

    // Salva no localStorage
    localStorage.setItem("roteiro_destino", destino);
    localStorage.setItem("roteiro_inicio", inicio);
    localStorage.setItem("roteiro_fim", fim);
    localStorage.setItem("roteiro_clima", JSON.stringify(weatherData));

    // Vai para a página do mapa
    window.location.href = "../pages/mapa-page.html";
});

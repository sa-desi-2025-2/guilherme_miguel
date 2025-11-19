// WeatherAPI.js
// Substitua pela sua chave da WeatherAPI
const apiKey = "1afc659b91cd4e37b63180548251911";

// Busca clima atual + previsão de 3 dias por nome da cidade
export async function getWeather(city) {
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&lang=pt`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Erro ao buscar dados da WeatherAPI");
        }

        const data = await response.json();
        return data;

    } catch (err) {
        console.error("Erro em getWeather:", err);
        return null;
    }
}

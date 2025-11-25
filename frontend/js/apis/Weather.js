const API_BASE = "http://localhost:8081";


export function calcularDiasViagem(dataInicio, dataFim) {
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffMs = fim - inicio;
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDias, 7);
}


export async function getCoords(city, countryIso2) {
    const query = encodeURIComponent(`${city}, ${countryIso2}`);
    const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Erro ao buscar coordenadas");
    const data = await res.json();
    if (!data?.length) throw new Error("Cidade não encontrada");
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}


export async function getWeather(city, countryIso2, dataInicio, dataFim) {
    try {
        const { lat, lon } = await getCoords(city, countryIso2);

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&start_date=${dataInicio}&end_date=${dataFim}`;
        
        const res = await fetch(url);
        if (!res.ok) throw new Error("Erro ao buscar dados do Open-Meteo");
        const data = await res.json();
        data.city = city;
        return data;
    } catch (err) {
        console.error("Erro em getWeather:", err);
        return null;
    }
}

export async function getWeatherDoRoteiro(roteiroId) {
    try {
        const res = await fetch(`${API_BASE}/roteiros/${roteiroId}`);
        if (!res.ok) throw new Error(`Erro ao buscar roteiro: ${res.statusText}`);
        const roteiro = await res.json();

        const clima = await getWeather(roteiro.destino, roteiro.pais, roteiro.dataInicio, roteiro.dataFim);

        return clima;
    } catch (err) {
        console.error("Erro em getWeatherDoRoteiro:", err);
        return null;
    }
}
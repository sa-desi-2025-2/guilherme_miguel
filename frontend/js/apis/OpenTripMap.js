// ATENÇÃO: EM PRODUÇÃO, NUNCA EXPOR CHAVES DE API NO FRONTEND.
const OTM_API_KEY = "5ae2e3f221c38a28845f05b6b2398f1b2020ca04c0fdfa3e72c66fd6"; // Chave de exemplo

// 1️⃣ Busca coordenadas (lat/lon) da cidade via geoname
export async function buscarCoordenadas(cidade, paisISO) {
    try {
        const name = encodeURIComponent(cidade);
        const url = `https://api.opentripmap.com/0.1/en/places/geoname?name=${name}&country=${paisISO}&apikey=${OTM_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error("Erro buscando geoname:", await response.text());
            return null;
        }

        const data = await response.json();
        if (!data || !data.lat || !data.lon) return null;

        return {
            lat: data.lat,
            lon: data.lon
        };
    } catch (err) {
        console.error("Erro em buscarCoordenadas:", err);
        return null;
    }
}

// 2️⃣ Busca pontos de interesse próximos por lat/lon
export async function buscarPontosInteresse(lat, lon, raio = 3000, limit = 30) {
    try {
        const url = `https://api.opentripmap.com/0.1/en/places/radius?radius=${raio}&lon=${lon}&lat=${lat}&format=json&limit=${limit}&apikey=${OTM_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            console.error("Erro buscando POIs:", await response.text());
            return [];
        }

        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Erro em buscarPontosInteresse:", err);
        return [];
    }
}

// 3️⃣ Buscar detalhes por xid
export async function buscarDetalhes(xid) {
    try {
        const url = `https://api.opentripmap.com/0.1/en/places/xid/${encodeURIComponent(xid)}?apikey=${OTM_API_KEY}`;
        const response = await fetch(url);
        if (!response.ok) {
            console.error("Erro buscando detalhes:", await response.text());
            return null;
        }
        return await response.json();
    } catch (err) {
        console.error("Erro em buscarDetalhes:", err);
        return null;
    }
}

// 4️⃣ Helper: buscar POIs a partir de cidade+paisISO
export async function buscarPontosPorCidade(cidade, paisISO, raio = 3000, limit = 30) {
    const coords = await buscarCoordenadas(cidade, paisISO);
    if (!coords) return [];
    return await buscarPontosInteresse(coords.lat, coords.lon, raio, limit);
}
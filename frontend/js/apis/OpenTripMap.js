// ATENÇÃO: EM PRODUÇÃO, NUNCA EXPOR CHAVES DE API NO FRONTEND.
const OTM_API_KEY = "5ae2e3f221c38a28845f05b6b2398f1b2020ca04c0fdfa3e72c66fd6";
const OTM_URL = "https://api.opentripmap.com/0.1";

/** Buscar lugares por cidade */
export async function buscarLocaisCidade(cidade, pais, limit = 40) {
    // 1. Buscar coordenadas da cidade
    const geocodeUrl = `${OTM_URL}/en/places/geoname?name=${cidade}&apikey=${OTM_API_KEY}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocode = await geocodeRes.json();

    if (!geocode.lat || !geocode.lon) {
        console.error("Erro: geocodificação não retornou lat/lon", geocode);
        return [];
    }

    const lat = geocode.lat;
    const lon = geocode.lon;

    // 2. Buscar pontos de interesse próximos
    const radiusUrl = `${OTM_URL}/en/places/radius?radius=8000&lon=${lon}&lat=${lat}&limit=${limit}&format=json&apikey=${OTM_API_KEY}`;
    const poisRes = await fetch(radiusUrl);
    const pois = await poisRes.json();

    if (!Array.isArray(pois)) {
        console.error("Erro: resposta inesperada do OTM:", pois);
        return [];
    }

    // 3. Detalhar cada POI
    const detalhes = [];

    for (const p of pois) {
        if (!p.xid) continue;

        const detalhesUrl = `${OTM_URL}/en/places/xid/${p.xid}?apikey=${OTM_API_KEY}`;
        const dRes = await fetch(detalhesUrl);
        const dJson = await dRes.json();

        detalhes.push({
            xid: p.xid,
            name: dJson.name || p.name,
            lat: dJson.point?.lat || p.point?.lat || null,
            lon: dJson.point?.lon || p.point?.lon || null,
            kinds: dJson.kinds,
            descr: dJson.wikipedia_extracts?.text || dJson.info?.descr || "",
            image: dJson.preview?.source || null
        });
    }

    return detalhes.filter(p => p.name); // só lugares reais
}

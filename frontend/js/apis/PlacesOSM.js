export async function buscarLocaisCidade(cidade, pais = "", limit = 50, radius = 8000) {
    if (!cidade) return [];

    const qCidade = encodeURIComponent(`${cidade}${pais ? ", " + pais : ""}`);

    try {
        const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${qCidade}&addressdetails=0&accept-language=en`;
        const nomRes = await fetch(nomUrl);
        const nomJson = await nomRes.json();

        if (!Array.isArray(nomJson) || nomJson.length === 0) return [];

        const { lat, lon } = nomJson[0];

        const overpassQuery = `
[out:json][timeout:25];
(
  node(around:${radius},${lat},${lon})[tourism=attraction];
  node(around:${radius},${lat},${lon})[tourism=museum];
  node(around:${radius},${lat},${lon})[tourism=gallery];
  node(around:${radius},${lat},${lon})[tourism=viewpoint];
  node(around:${radius},${lat},${lon})[tourism=zoo];
  node(around:${radius},${lat},${lon})[tourism=theme_park];
  node(around:${radius},${lat},${lon})[tourism=artwork];

  node(around:${radius},${lat},${lon})[historic];
  node(around:${radius},${lat},${lon})[leisure=park];
  node(around:${radius},${lat},${lon})[leisure=nature_reserve];

  node(around:${radius},${lat},${lon})[amenity=theatre];
  node(around:${radius},${lat},${lon})[amenity=arts_centre];
  node(around:${radius},${lat},${lon})[amenity=cinema];
  node(around:${radius},${lat},${lon})[amenity=planetarium];
  node(around:${radius},${lat},${lon})[amenity=fountain];

  way(around:${radius},${lat},${lon})[tourism];
  way(around:${radius},${lat},${lon})[historic];
  way(around:${radius},${lat},${lon})[leisure=park];
  way(around:${radius},${lat},${lon})[leisure=nature_reserve];
  way(around:${radius},${lat},${lon})[amenity=theatre];
  way(around:${radius},${lat},${lon})[amenity=arts_centre];
  way(around:${radius},${lat},${lon})[amenity=cinema];
  way(around:${radius},${lat},${lon})[amenity=planetarium];
  way(around:${radius},${lat},${lon})[amenity=fountain];
);
out center;
        `;

        const overRes = await fetch(`https://overpass-api.de/api/interpreter`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        const overJson = await overRes.json();

        if (!overJson.elements) return [];

        const locais = overJson.elements
            .map(el => {
                const tags = el.tags || {};
                const latEl = el.lat ?? el.center?.lat;
                const lonEl = el.lon ?? el.center?.lon;

                return {
                    xid: `${el.type}/${el.id}`,
                    name: tags.name || "Ponto turístico",
                    lat: latEl,
                    lon: lonEl,
                    kinds: Object.keys(tags).map(k => `${k}=${tags[k]}`).join(","),
                    descr: tags.description || "",
                    image: null
                };
            })
            .filter(x => x.lat && x.lon && x.name)
            .slice(0, limit);

        return locais;

    } catch (err) {
        console.error("Erro OSM:", err);
        return [];
    }
}

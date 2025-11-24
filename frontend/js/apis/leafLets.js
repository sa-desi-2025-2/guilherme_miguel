// frontend/js/leaflet.js
// Responsável por inicializar o mapa, adicionar marcadores e trajetos

let map = null;
let markersLayer = null; // camada para os marcadores
let polyline = null;

/**
 * Inicializa o mapa em um ponto central
 * @param {number} lat 
 * @param {number} lng 
 * @param {number} zoom 
 */
export function initMap(lat = -23.55052, lng = -46.633308, zoom = 13) {
  if (map) {
    map.remove(); // remove mapa antigo, se existir
  }

  map = L.map('map').setView([lat, lng], zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contribuidores'
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);
}

/**
 * Adiciona marcadores e desenha trajeto
 * @param {Array} pontos - array de objetos com latitude, longitude, nome e descricao
 */
export function plotarPontos(pontos) {
  if (!map || !markersLayer) {
    console.error("Mapa não inicializado. Chame initMap() antes.");
    return;
  }

  markersLayer.clearLayers();

  const latlngs = [];

  pontos.forEach((p, index) => { // <-- index indica a ordem
    if (p.latitude != null && p.longitude != null) {
      const marker = L.marker([p.latitude, p.longitude])
        .bindPopup(`<strong>${index+1}. ${escapeHtml(p.nome)}</strong><br>${escapeHtml(p.descricao || "-")}`);
      markersLayer.addLayer(marker);

      latlngs.push([p.latitude, p.longitude]);
    }
  });

  if (polyline) {
    map.removeLayer(polyline);
  }

  if (latlngs.length > 1) {
    polyline = L.polyline(latlngs, { color: 'blue', weight: 3, opacity: 0.7 });
    polyline.addTo(map);
    map.fitBounds(polyline.getBounds());
  } else if (latlngs.length === 1) {
    map.setView(latlngs[0], 13);
  }
}

// Função para escapar HTML
function escapeHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

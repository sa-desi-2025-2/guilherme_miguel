// Inicializa o mapa Leaflet
const map = L.map('map').setView([-23.55052, -46.633308], 13);

// Adiciona o mapa base (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contribuidores'
}).addTo(map);

// Adiciona marcador inicial
const marker = L.marker([-23.55052, -46.633308])
  .addTo(map)
  .bindPopup('Centro de São Paulo')
  .openPopup();

// Clicar no mapa move o marcador
map.on('click', function(e) {
  const { lat, lng } = e.latlng;
  marker.setLatLng([lat, lng])
    .bindPopup(`Nova posição:<br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`)
    .openPopup();
});

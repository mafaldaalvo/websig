// Mapa 23 de Janeiro
var geojson;
var map = L.map('map').setView([39.7, -8.0], 6);
var info = L.control();

L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/dark_all/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

casos.features.sort(function (a, b) {
    return b.properties.Casos_23_1 - a.properties.Casos_23_1;
});

function highlightFeature(e) {
    var layer = e.target;

    var popup =
        '<p><b>Concelho: ' + layer.feature.properties.Concelho + '</b></p>' +
        '<p>Casos: ' + layer.feature.properties.casos_23_1 + '</p>';
    var stylepop = {
        fillColor: 'yellow',
        fillOpacity: 1
    }

    layer.bindPopup(popup, stylepop).openPopup();
}

function resetHighlight(e) {
    var popup;
    var layer = e.target;
    layer.bindPopup(popup).closePopup();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(casos, {
    onEachFeature: onEachFeature
}).addTo(map);


info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

info.update = function (props) {
    this._div.innerHTML = '<h4>Casos 23 de Janeiro</h4>';
};

info.addTo(map);
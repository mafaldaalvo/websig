// Mapa 23 de Janeiro por 10.000 Habitantes

var map = L.map('map').setView([39.696927, -7.729808], 6);
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
}).addTo(map);

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

var props = L.geoJSON(casos10kHab).addTo(map);

info.update = function (props) {
    this._div.innerHTML = '<h4>23 de Janeiro<br>Casos por 10.000 habitantes</h4>' + (props ?
        '<b>' + props.Concelho + '</b><br />' + props.Casos_23_1 + ' casos / 10.000 hab.'
        : 'Consulta por concelho');
};

info.addTo(map);

var geojson;

function getColor(d) {
    return d > 30 ? '#800026' :
        d > 17 ? '#BD0026' :
            d > 10 ? '#E31A1C' :
                d > 5 ? '#FC4E2A' :
                    d > 3 ? '#FD8D3C' :
                        d > 2 ? '#FEB24C' :
                            d > 1 ? '#FED976' :
                                d > 0 ? '#FFEDA0' :
                                    d = 0 ? '#000000' :
                                        '#FFFFFF';
}

function style(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 1.0,
        //Para mudar a variável do mapa(dia)
        fillColor: getColor(feature.properties.Casos_23_1)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
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

geojson = L.geoJson(casos10kHab, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);

map.attributionControl.addAttribution('Número de casos: &copy; <a href="https://covid19.min-saude.pt/">Direção-Geral da Saúde</a>');

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 5, 10, 17, 30],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);
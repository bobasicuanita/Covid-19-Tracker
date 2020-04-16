mapboxgl.accessToken =
    'pk.eyJ1IjoiYm9iYXNpY3Vhbml0YSIsImEiOiJjazhzc2N4ZnYwMmF3M2R0YXExMWhyNTd6In0.8MMnpxV62tOja1esO75NIQ';

export const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bobasicuanita/ck91hb9wk176b1ik5x6rvbuh1',
    maxZoom: 24,
    minZoom: 1.6,
    minPitch: 60,
    dragRotate: false,
    zoom: 1.7,
    center: [-0.946987, 30.582403],
});


map.addControl(new mapboxgl.FullscreenControl());

export const loadMap = (map) => {
    return map.on('load', () => {
        // Add a GeoJSON source containing the state polygons.
        map.addSource('states', {
            'type': 'geojson',
            'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
        });

        // Add a layer showing the state polygons.
        map.addLayer({
            id: 'states-layer',
            type: 'fill',
            source: 'states',
            paint: {
                'fill-color': 'rgba(27, 52, 54, 1)',
                'fill-outline-color': 'rgba(25, 152, 163, 1)',
            },
        });
    })
};
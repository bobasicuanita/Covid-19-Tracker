import {
    markups,
    responsesArray,
    markupPopup
} from './markups.js';
import {
    getAll
} from './apiCalls.js';
import * as dataElements from './dataElements.js';
import {
    map
} from './mapbox.js';

const currentPopup = [];

export const numberWithThousands = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const configureSearchCountry = (response) => {

    if (currentPopup !== null) {
        currentPopup.forEach((el) => {
            currentPopup[0].remove();
            currentPopup.pop();
        });
    }

    if (document.querySelector('.mapboxgl-popup')) {
        document
            .querySelector('.mapboxgl-popup')
            .parentElement.removeChild(
                document.querySelector('.mapboxgl-popup')
            );
    }

    const tranformedDate = new Date(response.data.updated).toGMTString();

    const geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    response.data.countryInfo.long,
                    response.data.countryInfo.lat,
                ],
            },
            properties: {
                title: response.data.country,
                totalCases: response.data.cases,
            },
        }, ],
    };

    geojson.features.forEach((marker) => {
        // create a HTML element for each feature
        const el = document.createElement('div');
        el.className = 'marker';

        // make a marker for each feature and add to the map
        const popup = new mapboxgl.Popup()
            .setLngLat(marker.geometry.coordinates)
            .setHTML(
                markupPopup(
                    response.data.country,
                    tranformedDate,
                    response.data.cases,
                    response.data.todayCases,
                    response.data.deaths,
                    response.data.todayDeaths,
                    response.data.recovered,
                    response.data.active,
                    response.data.critical,
                    response.data.tests,
                    response.data.countryInfo.flag
                )
            )
            .addTo(map);

        currentPopup.push(popup);
    });

    map.flyTo({
        center: [
            response.data.countryInfo.long,
            response.data.countryInfo.lat,
        ],
        zoom: 2,
        speed: 0.5,
        curve: 1,
    });
}

export const displayTotalData = async () => {
    // Fetch all country data
    const data = await getAll();

    const tranformedDate = new Date(data.data.updated).toGMTString();

    markups.push(tranformedDate);
    markups.push(data.data.cases);
    markups.push(data.data.todayCases);
    markups.push(data.data.deaths);
    markups.push(data.data.todayDeaths);
    markups.push(data.data.recovered);
    markups.push(data.data.active);
    markups.push(data.data.critical);
    markups.push(data.data.tests);
    markups.push(data.data.affectedCountries);

    Object.entries(dataElements).forEach((el) => {
        el[1].innerText = '';
    });

    let index = 0;

    Object.entries(dataElements).forEach((el) => {
        el[1].insertAdjacentHTML(
            'afterbegin',
            responsesArray(index)
        );
        index++;
    });
};
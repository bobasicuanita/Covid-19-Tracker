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
export const date = document.querySelector('.date');

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

    const geojson = {
        type: 'FeatureCollection',
        features: [{
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [
                    response.long,
                    response.lat,
                ],
            },
            properties: {
                title: response.country,
                totalCases: response.cases,
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
                    response.country,
                    response.cases,
                    response.deaths,
                    response.recovered,
                    response.flag
                )
            )
            .addTo(map);

        currentPopup.push(popup);
    });

    map.flyTo({
        center: [
            response.long,
            response.lat,
        ],
        zoom: 2,
        speed: 0.5,
        curve: 1,
    });
}

export const displayTotalData = async () => {
    // Fetch all country data
    const data = await getAll();

    const day = new Date(data.data.data.date).getUTCDate();
    const month = new Date(data.data.data.date).getUTCMonth();
    const year = new Date(data.data.data.date).getUTCFullYear();
    const tranformedDate = `${day} - ${month} - ${year}`

    markups.push(data.data.data.totalCases);
    markups.push(data.data.data.todayCases);
    markups.push(data.data.data.totalDeaths);
    markups.push(data.data.data.todayDeaths);
    markups.push(data.data.data.totalRecovered);
    markups.push(data.data.data.totalActive);
    markups.push(data.data.data.countriesList.length);

    Object.entries(dataElements).forEach((el) => {
        el[1].innerText = '';
    });

    let index = 0;

    date.innerText = tranformedDate;
    Object.entries(dataElements).forEach((el) => {
        el[1].insertAdjacentHTML(
            'afterbegin',
            responsesArray(index)
        );
        index++;
    });
};
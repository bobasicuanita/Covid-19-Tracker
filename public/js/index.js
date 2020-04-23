import 'babel-polyfill';
import {
    getAll,
} from './apiCalls.js';
import {
    map,
    loadMap
} from './mapbox.js';
import * as dataElements from './dataElements.js';
import {
    sortCountriesByCases,
    sortCountriesByDeaths,
    casesOptions,
    deathsOptions,
} from './charts.js';
import {
    configureSearchCountry,
    displayTotalData
} from './helperFunctions.js';
import * as element from './domElements.js';
import {
    showAlert
} from './alerts.js';


// Get ALL Data
window.onload = async () => {
    // Load map layer and Charts
    await loadMap(map);

    // Loading Setting for GetAll function
    Object.entries(dataElements).forEach((el) => {
        el[1].insertAdjacentHTML('afterbegin', 'Loading...');
    });

    // Get data
    await displayTotalData();

    const response = await getAll();

    // Get top 10 countries by cases and their data
    const countriesCases = sortCountriesByCases(response, 'countries');
    const numbersCases = sortCountriesByCases(response, 'numbers');

    // Create new Bar Chart
    const chartCases = new Chart(element.ctxBarCases, casesOptions(countriesCases, numbersCases));

    // // Get top 10 countries by deaths and their data
    const countriesDeaths = sortCountriesByDeaths(response, 'countries');
    const numbersDeaths = sortCountriesByDeaths(response, 'numbers');

    // Create new Bar Chart
    const chartDeaths = new Chart(element.ctxBarDeaths, deathsOptions(countriesDeaths, numbersDeaths));
};

// Search by country name
element.btn.addEventListener('click', async (e) => {
    // Prevent Default
    e.preventDefault();

    // Change button text while searching country.
    element.btn.innerText = 'Searching...';


    if (element.input.value === '') showAlert(element.input.value);

    // Perform Search
    const response = await getAll();
    const country = response.data.data.countriesList.find(el => el.country == element.input.value.toUpperCase());
    const code = response.data.data.countriesList.find(el => el.code == element.input.value.toUpperCase());

    // Generate Popup
    if (country) configureSearchCountry(country);
    if (code) configureSearchCountry(code);

    if (!code && !country) showAlert(element.input.value);

    // Reset input value
    element.input.value = '';

    // When Search is complete revert back to old text.
    element.btn.innerText = 'Search';
});

// Use the same approach as above to indicate that the symbols are clickable
// by changing the cursor style to 'pointer'.
map.on('mousemove', function (e) {
    // Get Mapbox layer
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['states-layer'],
    });

    if (map.getLayer('cluster-count')) {
        map.removeLayer('cluster-count');
    }

    // Change cursor
    map.getCanvas().style.cursor = features.length ? 'pointer' : '';
});

map.on('click', async (e) => {
    // Get country based on Click
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['states-layer'],
    });

    if (!features.length) {
        return;
    }

    // Get first element
    const feature = features[0];

    // Get response of clicked country
    const responseClick = await getAll();
    const country = responseClick.data.data.countriesList.find(el => el.country == feature.properties.name.toUpperCase());
    if (responseClick && country) configureSearchCountry(country);
});
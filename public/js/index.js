import 'babel-polyfill';
import { search, getHistoryData } from './apiCalls.js';
import { map, loadMap } from './mapbox.js';
import * as dataElements from './dataElements.js';
import {
    configureLineData,
    sortCases,
    barOptions,
    lineOptions,
} from './charts.js';
import { configureSearchCountry, displayTotalData } from './helperFunctions.js';
import * as element from './domElements.js';


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

    // Get top 10 countries and their data
    const countries = await sortCases('countries');
    const numbers = await sortCases('numbers');

    // Create new Bar Chart
    const chart = new Chart(element.ctxBar, barOptions(countries, numbers));
};

// Search by country name
element.btn.addEventListener('click', async (e) => {
    // Prevent Default
    e.preventDefault();

    const guide = document.querySelector('.guide');

    // Change button text while searching country.
    element.btn.innerText = 'Searching...';

    // Remove Previous charts
    if (window.chart != null) {
        window.chart.destroy();
    }

    // Perform Search
    const response = await search(element.input.value);
    // Generate Popup
    if (response) configureSearchCountry(response);

    // Get Country's History Data
    const responseHistory = await getHistoryData(response.data.country);
    // If successfully
    if (responseHistory) {
        // Configure Data and Dates
        const dates = await configureLineData(
            responseHistory,
            'dates',
            response
        );
        const data = await configureLineData(responseHistory, 'data', response);

        // Create new Chart
        window.chart = new Chart(
            element.ctxLine,
            lineOptions(dates, data, response.data.country)
        );
    }

    // Reset input value
    element.input.value = '';

    // If guid exists remove it
    if (guide) guide.parentElement.removeChild(guide);

    console.log(guide);
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
    // Get guide element
    const guide = document.querySelector('.guide');

    // Get country based on Click
    const features = map.queryRenderedFeatures(e.point, {
        layers: ['states-layer'],
    });

    if (!features.length) {
        return;
    }

    // Get first element
    const feature = features[0];

    // Check if another instance of line charts exists
    if (window.chart != null) {
        window.chart.destroy();
    }

    // Get response of clicked country
    const responseClick = await search(feature.properties.name);
    if (responseClick) configureSearchCountry(responseClick);

    // Get history country data
    const responseHistory = await getHistoryData(feature.properties.name);

    // If success
    if (responseHistory) {
        // Configure Data and Dates
        const dates = await configureLineData(
            responseHistory,
            'dates',
            responseClick
        );
        const data = await configureLineData(
            responseHistory,
            'data',
            responseClick
        );
        // Create new Chart
        window.chart = new Chart(
            element.ctxLine,
            lineOptions(dates, data, responseClick.data.country)
        );
    }

    // When Search is complete revert back to old text.
    if (guide) guide.parentElement.removeChild(guide);
});

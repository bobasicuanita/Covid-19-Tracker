import {
    getAll
} from './apiCalls.js';

const compareNumbers = (a, b) => {
    return b - a;
};

export const sortCountriesByDeaths = (response, type) => {
    let countries = [];
    let numbers = [];
    let elements = [];

    // console.log(response.data.data.countriesList);

    const sortedDeaths = response.data.data.countriesList
        .map((el) => el.deaths)
        .sort(compareNumbers)
        .slice(0, 10);

    sortedDeaths.forEach((el) => {
        elements = [...elements, response.data.data.countriesList.find((element) => element.deaths === el)];
    });


    elements.forEach((el) => {
        countries = [...countries, el.country];
        numbers = [...numbers, el.deaths];
    });

    if (type === 'countries') {
        return countries;
    } else if (type === 'numbers') {
        return numbers;
    }
};

export const sortCountriesByCases = (response, type) => {
    let countries = [];
    let numbers = [];


    response.data.data.countriesList.slice(0, 10).forEach(el => {
        countries = [...countries, el.country];
        numbers = [...numbers, el.cases];
    });

    if (type === 'countries') {
        return countries;
    } else if (type === 'numbers') {
        return numbers;
    }
};

export const casesOptions = (countries, numbers) => {
    return {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Most Infected Countries',
                backgroundColor: 'rgb(66, 103, 178)',
                borderColor: 'rgb(27, 52, 54)',
                data: numbers,
            }, ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `Dates`,
                fontFamily: "'Roboto', sans-serif",
                fontSize: 50,
                position: 'bottom',
            },
            title: {
                display: true,
                text: `Top 10 Most Infected Countries`,
                fontFamily: "'Roboto', sans-serif",
                fontSize: 50,
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                    },
                }, ],
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                    },
                }, ],
            },
            tooltips: {
                enabled: true,
                titleFontSize: 50,
                bodyFontSize: 50,
                xPadding: 50,
                yPadding: 50,
                callbacks: {
                    label: function (tooltipItem) {
                        return Number(tooltipItem.yLabel) + ' cases';
                    },
                },
            },
        }
    }
}

export const deathsOptions = (countries, numbers) => {
    return {
        type: 'bar',
        data: {
            labels: countries,
            datasets: [{
                label: 'Countries With Most Deaths',
                backgroundColor: 'rgb(250, 62, 62)',
                borderColor: 'rgb(27, 52, 54)',
                data: numbers,
            }, ],
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                    },
                }, ],
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: `Dates`,
                fontFamily: "'Roboto', sans-serif",
                fontSize: 50,
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Countries With Most Deaths',
                fontFamily: "'Roboto', sans-serif",
                fontSize: 50,
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 20,
                    },
                }, ],
                xAxes: [{
                    ticks: {
                        fontSize: 20,
                    },
                }, ],
            },
            tooltips: {
                enabled: true,
                titleFontSize: 50,
                bodyFontSize: 50,
                xPadding: 50,
                yPadding: 50,
                callbacks: {
                    label: function (tooltipItem) {
                        return Number(tooltipItem.yLabel) + ' deaths';
                    },
                },
            },
        }
    }
}
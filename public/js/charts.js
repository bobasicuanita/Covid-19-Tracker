import {
    getAllCountryData
} from './apiCalls.js';

const compareNumbers = (a, b) => {
    return b - a;
};

export const sortCases = async (type) => {
    let countries = [];
    let numbers = [];
    let elements = [];


    const response = await getAllCountryData();
    const sortedCases = response.data
        .map((el) => el.cases)
        .sort(compareNumbers)
        .slice(0, 10);

    sortedCases.forEach((el) => {
        elements = [...elements, response.data.find((element) => element.cases === el)];
    });


    elements.forEach((el) => {
        countries = [...countries, el.country];
        numbers = [...numbers, el.cases];
    });

    if (type === 'countries') {
        return countries;
    } else if (type === 'numbers') {
        return numbers;
    }
};

export const configureLineData = async (response, type, responseClick) => {
    let dates = [];
    let data = [];

    const historicalData = response.data.find(
        (el) => el.country === responseClick.data.country
    );

    Object.entries(historicalData.timeline.cases).forEach((el) =>
        dates = [...dates, el[1]]
    );
    Object.entries(historicalData.timeline.cases).forEach((el) =>
        data = [...data, el[1]]
    );

    if (type === 'dates') {
        return dates;
    } else if (type === 'data') {
        return data;
    }
}

export const barOptions = (countries, numbers) => {
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
                        fontSize: 40,
                    },
                }, ],
                xAxes: [{
                    ticks: {
                        fontSize: 30,
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

export const lineOptions = (dates, data, country) => {
    return {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                // label: `Historical Data of ${responseClick.data.country}`,
                backgroundColor: 'rgba(66,103,178,0.2)',
                borderColor: 'rgba(66,103,178,1)',
                borderWidth: 10,
                data,
                pointStyle: 'circle',
                pointRadius: 15,
                pointHoverRadius: 15,
                // fill: false,
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
                text: `Historical Data of ${country}`,
                fontFamily: "'Roboto', sans-serif",
                fontSize: 50,
            },

            scales: {
                yAxes: [{
                    ticks: {
                        fontSize: 40,
                    },
                }, ],
                xAxes: [{
                    ticks: {
                        fontSize: 30,
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
        },
    }
}
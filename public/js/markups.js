import {
    numberWithThousands
} from './helperFunctions.js';
export const markups = [];

export const markupPopup = (
    country,
    cases,
    deaths,
    recovered,
    flag
) => {
    return (
        '<div class="tooltip"><h3>' +
        country + '&nbsp;&nbsp;<img width="22" height="14" alt="Country Flag" src=' + flag + '>' +
        '</h3><ul><li>Total Cases: <span class="negative">' +
        numberWithThousands(cases) +
        '</li><li>Total Deaths: <span class="negative">' +
        numberWithThousands(deaths) +
        '</li><li>Recovered: <span class="positive">' +
        numberWithThousands(recovered) +
        '</li></ul></div>'
    );
};

export const markupNotification = (input) => {
    if (!input)
        return `<p class="errortext">You need to specify a country's name or country code (example: FR for France) !</p>`;
    return `<p class="errortext">There is no country with name ${input.toUpperCase()} ! Please submit a valid country name or country code !</p>`;
};

export const responsesArray = (index) => {
    return `${numberWithThousands(markups[index])}`;
}
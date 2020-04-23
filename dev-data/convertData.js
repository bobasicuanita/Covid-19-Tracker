const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const rimraf = require('rimraf');
const Latest = require('../models/latestDataModel.js');

dotenv.config({
    path: './config.env',
});

const importSummaryData = async (summary) => {
    try {
        await Latest.create(summary);
        console.log('Summary successfully loaded!');
    } catch (err) {
        console.log(err);
        process.exit();
    }
};
exports.convertData = async () => {
    let summary;
    const directoryPath = path.join(__dirname, './tmp/csse_covid_19_data/csse_covid_19_daily_reports/');

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        files.shift();
        files.pop();

        if (!fs.existsSync(path.join(__dirname, './jsonData'))) {
            fs.mkdirSync(path.join(__dirname, './jsonData'));
        }

        for (let i = files.length - 2; i < files.length; i++) {
            console.log(`Converting ${files[i]} to JSON...`);
            const csvFilePath = path.join(
                __dirname,
                `./tmp/csse_covid_19_data/csse_covid_19_daily_reports/${files[i]}`
            );
            csv()
                .fromFile(csvFilePath)
                .then((jsonObj) => {
                    const toJSON = JSON.stringify(jsonObj);
                    try {
                        fs.writeFileSync(
                            path.join(__dirname, `./jsonData/${files[i].split('.')[0]}.json`),
                            toJSON
                        );
                    } catch (err) {
                        console.error(err);
                    }
                });
        }
    });

    const jsonPath = path.join(__dirname, './jsonData');

    console.log('Sending data to database...');

    fs.readdir(jsonPath, (err, files) => {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const countryList = JSON.parse(fs.readFileSync(`${__dirname}/countries/countryList.json`, 'utf-8'));
        const previousDayData = JSON.parse(
            fs.readFileSync(`${__dirname}/jsonData/${files[files.length - 2]}`, 'utf-8')
        );

        const latestData = JSON.parse(
            fs.readFileSync(`${__dirname}/jsonData/${files[files.length - 1]}`, 'utf-8')
        );

        let totalCases = 0;
        let previousDayCases = 0;
        let totalDeaths = 0;
        let previousDayDeaths = 0;
        let totalRecovered = 0;
        let totalActive = 0;
        let todayCases = 0;
        let todayDeaths = 0;

        const formattedDate = files[files.length - 1].split('.')[0];

        previousDayData.forEach((el) => {
            previousDayCases += parseInt(el.Confirmed);
            previousDayDeaths += parseInt(el.Deaths);
        });

        latestData.forEach((el) => {
            totalCases += parseInt(el.Confirmed);
            totalDeaths += parseInt(el.Deaths);
            totalRecovered += parseInt(el.Recovered);
            totalActive += parseInt(el.Active);
        });

        const countriesDataList = [];
        const countriesWithStates = [
            (us = {
                country: 'US',
                code: '',
            }),
            (china = {
                country: 'CHINA',
                code: '',
            }),
            (Australia = {
                country: 'AUSTRALIA',
                code: '',
            }),
            (unitedKingdom = {
                country: 'UNITED KINGDOM',
                code: '',
            }),
            (france = {
                country: 'FRANCE',
                code: '',
            }),
            (netherlands = {
                country: 'NETHERLANDS',
                code: '',
            }),
            (denmark = {
                country: 'DENMARK',
                code: '',
            }),
            (canada = {
                country: 'CANADA',
                code: '',
            }),
        ];

        countriesWithStates.forEach((el) => {
            el.cases = 0;
            el.deaths = 0;
            el.recovered = 0;
        });

        latestData.forEach((el) => {
            countryList.forEach((element) => {
                if (el.Country_Region.toUpperCase() == element.country.toUpperCase() && el.Province_State.length > 0) {
                    countriesWithStates.forEach((elem) => {
                        if (el.Country_Region.toUpperCase() == elem.country.toUpperCase()) {
                            elem.code = element.code;
                            elem.flag = element.flag;
                            elem.lat = parseFloat(element.coordinates[1]);
                            elem.long = parseFloat(element.coordinates[0]);
                            elem.cases = elem.cases + parseInt(el.Confirmed);
                            elem.deaths = elem.deaths + parseInt(el.Deaths);
                            elem.recovered = elem.recovered + parseInt(el.Recovered);
                        }
                    });
                } else if (el.Country_Region == element.country) {
                    const countryData = {
                        country: element.country.toUpperCase(),
                        code: element.code,
                        flag: element.flag,
                        lat: parseFloat(element.coordinates[1]),
                        long: parseFloat(element.coordinates[0]),
                        cases: parseInt(el.Confirmed),
                        deaths: parseInt(el.Deaths),
                        recovered: parseInt(el.Recovered),
                    };

                    countriesDataList.push(countryData);
                }
            });
        });

        countriesDataList.forEach((el) => {
            countriesWithStates.forEach((elem) => {
                if (elem.country == el.country) {
                    el.cases += elem.cases;
                    el.deaths += elem.deaths;
                    el.deaths += elem.deaths;
                    const index = countriesWithStates.indexOf(elem);
                    countriesWithStates.splice(index, 1);
                }
            });
        });

        countriesWithStates.forEach((el) => {
            countriesDataList.push(el);
        });

        todayCases = totalCases - previousDayCases;
        todayDeaths = totalDeaths - previousDayDeaths;

        const compareNumbers = (a, b) => {
            return b.cases - a.cases;
        };

        summary = {
            totalCases,
            todayCases,
            totalDeaths,
            todayDeaths,
            totalRecovered,
            totalActive,
            date: formattedDate,
            countriesList: countriesDataList.sort(compareNumbers),
        };

        summary.countriesList.find((el) => el.country === 'US').country = 'UNITED STATES';

        importSummaryData(summary);
    });
};
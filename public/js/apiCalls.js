import {
    showAlert
} from './alerts.js';


// Get all data
export const getAll = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'https://corona.lmao.ninja/all',
            redirect: 'follow',
        });

        return response;
    } catch (err) {
        console.log('error', err);
    }
};

// Search clicked or searched country
export const search = async (value) => {
    try {
        if (value === '') throw err;

        const response = await axios({
            method: 'GET',
            url: `https://corona.lmao.ninja/countries/${value}`,
            redirect: 'follow',
        });

        return response;
    } catch (err) {
        showAlert(value);
    }
};

// Get all country history data
export const getAllCountryData = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: `https://corona.lmao.ninja/countries?sort=country`,
            redirect: 'follow',
        });

        return response;
    } catch (err) {
        console.log('error', err);
    }
};

export const getHistoryData = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: `https://corona.lmao.ninja/v2/historical`,
            redirect: 'follow',
        });

        return response;
    } catch (err) {
        console.log('error', err);
    }
};
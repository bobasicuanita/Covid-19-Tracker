const mongoose = require('mongoose');

const latestSchema = new mongoose.Schema({
    date: {
        type: String
    },
    totalCases: {
        type: Number
    },
    todayCases: {
        type: Number
    },
    totalDeaths: {
        type: Number
    },
    todayDeaths: {
        type: Number
    },
    totalRecovered: {
        type: Number
    },
    totalActive: {
        type: Number
    },
    countriesList: {
        type: Array
    }
})

const Latest = mongoose.model('latest', latestSchema);

module.exports = Latest;
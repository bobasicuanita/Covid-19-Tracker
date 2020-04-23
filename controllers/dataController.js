const Latest = require('../models/latestDataModel.js');

exports.getData = async (req, res, next) => {
    const data = await Latest.findOne({});

    res.status(200).json({
        status: 'success',
        results: data.length,
        data
    })
}
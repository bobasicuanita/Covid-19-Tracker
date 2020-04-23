const dotenv = require('dotenv');
const app = require('./app.js');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cloneData = require('./dev-data/cloneData.js');
const rimraf = require('rimraf');
const convertData = require('./dev-data/convertData.js');
const path = require('path');
const Latest = require('./models/latestDataModel.js');

dotenv.config({
    path: './config.env',
});

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB connection successful');
        cron.schedule('44 * * * *', async () => {
            await Latest.deleteOne({});
            await cloneData.cloneData();
            await convertData.convertData();

            cron.schedule('05 0 * * *', () => {
                console.log('Deleting previous data...');
                rimraf(path.join(__dirname, './dev-data/jsonData'), () => {
                    console.log('Successfully deleted jsonData folder and its contents.');
                });
                rimraf(path.join(__dirname, './dev-data/tmp'), () => {
                    console.log('Successfully deleted tmp folder and its contents.');
                });
            });
        });
    });

// Server port
const port = process.env.PORT || 3000;

// Server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
// server.js

const express        = require('express');
const MongoClient    = require('mongodb').MongoClient;
const bodyParser     = require('body-parser');
const app            = express();
const config         = require('./config/config');

const port = 8081;

app.use(bodyParser.urlencoded({ extended: true }));

const connectToMongo = async() => {
    let client = await MongoClient.connect(config.url,{ useNewUrlParser: true });

    let db = await client.db('java-api');

    require('./app/routes')(app, db);

    await app.listen(port, () => {
        console.log('We are live on ' + port);
    });
};

connectToMongo();


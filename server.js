// Asenna ensin express npm install express --save

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var customerController = require('./customerController');

const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = process.env.PORT || 3002;

//CORS middleware
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

app.use(allowCrossDomain);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Staattiset filut
app.use(express.static('public'));

// REST API Asiakas
app.route('/types')
    .get(customerController.fetchTypes);

app.route('/asiakas')
    .get(customerController.fetchAll)
    .post(customerController.create);

app.route('/asiakas/:id')
    .put(customerController.update)
    .delete(customerController.delete);
//

app.get('/', function (request, response) {
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/plain');
    response.end("Terve maailma");
});

app.listen(port, hostname, () => {
    console.log(`Server running AT http://${hostname}:${port}/`);
});
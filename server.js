const express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    fs = require('fs'),
    cors = require('cors'),
    routers = require('./server/routes/routes.js');
const port = 3001;

const app=express();

app.use('/list', express.static(path.join(__dirname, 'client/html/index.html'))); // Serve index.html for /list
// app.use('/add_photos.html', express.static(path.join(__dirname, 'client/html')));
app.use('/add_photos', express.static(path.join(__dirname, 'client/html/add_photos.html')));


app.use('/js', express.static(path.join(__dirname, 'client/js')));

app.use('/css', express.static(path.join(__dirname, 'client/css')));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use('/', routers);

const server = app.listen(port, () => {
    console.log('listening on port %s...', server.address().port);
});
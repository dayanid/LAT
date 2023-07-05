const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
const {checkApiKey,generateApiKey} = require("./app/middleware/validate");
const path = require('path');

app.use(cors());
// parse requests of content-type: application/json

app.use(bodyParser.json({ limit: '10mb' }));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) { res.sendFile(path.join(__dirname + '/app/doc/index.html')); });

// Use the middleware on all routes
app.use(checkApiKey);


require('./routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running...`);  
  console.log(`API Documentation = http://localhost:${PORT}`);
  console.log(`API KEY = ${generateApiKey()}`);
});
// Specify the URL you want to open in the browser
import('open').then(open => {
  // Specify the URL you want to open in the browser
  const url = `http://localhost:${PORT}`;

  // Open the URL in the default web browser
  //open.default(url)
});
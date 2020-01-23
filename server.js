'use strict';

// Load environment variables from the .env
require('dotenv').config();

// Declare app dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
const PORT = process.env.PORT;
const app = express();
app.use(cors());

// Route syntax = app.<operation>('<route>', callback );
// Home Page for Server Testing
app.get('/', (request, response) => {
  response.send('Home Page!');
});

// Error Handler
function errorHandler(error, request, response) {
  response.status(500).send(error);
}

// Location Data
app.get('/location', (request, response) => {
  try{
    const geoData = require('./data/geo.json');
    const city = request.query.city;

    if (city){
      console.log(request.query.city);
      const locationData = new Location(city, geoData);
      response.send(locationData);
    } else {
      errorHandler('Oops, no city!', request, response);
    }
  }
  catch(error){
    errorHandler('So sorry, something went wrong.', request, response);
  }
});

function Location(city, geoData){
  this.search_query = city;
  this.formatted_query = geoData[0].display_name;
  this.latitude = geoData[0].lat;
  this.longitude = geoData[0].lon;
}

// Weather Data
app.get('/weather', (request, response) => {
  try{
    const weatherData = require('./data/darksky.json');
    const city = request.query.city;
    const locationWeather = getForecast(city, weatherData);
    // console.log(locationWeather);
    response.send(locationWeather);
  }
  catch(error) {
    errorHandler('Oops! Something seems off here.', request, response);
  }
});

// Return the array of forecast objects
function getForecast(city, weatherData) {
  let weatherArr = [];
  for (let i = 0; i < 8; i++) {
    let singleDay = weatherData.daily.data[i];
    const singleLocationWeather = new Forecast(city, singleDay);
    weatherArr.push(singleLocationWeather);
  }
  return weatherArr;
}

// Forecast Contructor
function Forecast(city, singleDay){
  this.forecast = singleDay.summary;
  this.time = singleDay.time;
}


//Ensure the server is listening for requests
//THIS MUST BE AT THE END OF THE FILE!!!
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));

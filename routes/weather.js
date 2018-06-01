const request = require("request");
const express = require("express");
const router = express.Router();

/**
 * Entry Route for Website. Displays the index.ebs page
 * @function
 * @param {object} req - Request object from HTTP.
 * @param {object} res - Response object from HTTP.
 */
router.get('/', function(req, res) {
  res.render('index');
});

/**
 * Home Page Route for Website. Displays the index.ebs page
 * @method
 * @param {object} req - Request object from HTTP.
 * @param {object} res - Response object from HTTP.
 */
router.get("/home", (req, res) => {
  var json = {
    pageTitle: "Community App",
    content: `    <h1>Introduction</h1>
        <p>
Welcome to Travel Mate! Your first-stop guide to finding out the key information regarding the Kingdom of Fife!
        </p>
        <h4>How to use this website</h4>
        <p>
            Use the navigation along the left hand side to navigate different towns or cities.
            Each page will provide tools such as a 5-day, and 24 hour weather forecast, as well as a map with traffic conjestion
            and routes for inter-town travel.
        </p><br><br>
        <h5>What's in the news?</h5>
`
  };
  try {
    if (req.query.data === undefined)
      console.log("Bad Request");
    else
      console.log(req.query.data);
  } catch (e) {
    console.log("Bad request");
  }
  res.send(json);
});


/**
 * Controller for getWeather. Called from the Route
 * @function
 * @param {object} req - Request object from HTTP.
 * @param {object} res - Response object from HTTP.
 */
router.get("/getWeather", (req, res) => {

  var city = "New York";
  if (req.query.data === undefined) {
    json = {
      weather: null,
      error: 'Error, Bad Request'
    };
    res.send(json);
  } else {
    city = req.query.data;
  }

//openweathermap API from https://openweathermap.org/api
  var apiKey = "64238228ee2298d9f34c75c3cff51b58";
  var url2 = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;
  var json = {};

  request(url2, function(err, response, body) {
    if (err) {
      console.error('Error on requesting api:', err);
      json = {
        weather: null,
        error: 'Error, please try again'
      };
      //res.render('index', { weather: null, error: 'Error, please try again' });
      res.send(json);
    } else {
      var weatherData = JSON.parse(body);
      console.log(weatherData);
      for (var i = 0; i < 40; i++) {
        var weather = weatherData.list[i].weather[0] ? weatherData.list[i].weather[0] : null; //aj83: validation
        i += 7;
      }
      var coordinates = weatherData.city.coord;
      if (!weather || !coordinates) {
        json = {
          weather: null,
          error: 'Now weather data for requested city'
        };
        //res.render('index', { weather: null, error: 'Error, please try again' });
        res.send(json);
      } else {
        var json_data = {};
        json_data['description'] = [];
        json_data['temp'] = [];
        json_data['time'] = [];
        json_data['icon'] = [];
        for (var i = 0; i < 40; i++) {
          json_data['temp'].push(weatherData.list[i].main.temp);
          json_data['description'].push(weatherData.list[i].weather[0].description);
          json_data['icon'].push(weatherData.list[i].weather[0].icon);
          json_data['time'].push(weatherData.list[i].dt_txt);
          i += 7;
        }
        json_data['humidity'] = weatherData.list[0].main.humidity;
        json_data['temp_min'] = weatherData.list[0].main.temp_min;
        json_data['temp_max'] = weatherData.list[0].main.temp_max;
        json_data['pressure'] = weatherData.list[0].main.pressure;
        json_data['wind_speed'] = weatherData.list[0].wind.speed;
        json_data['lon'] = coordinates.lon;
        json_data['lat'] = coordinates.lat;

        for (var i = 0; i < 8; i++) {
          //here, i am pulling time, but 1 at a time, not 7 like above
          //aj83: suggest to combine three for loops into one
          json_data['time' + i] = weatherData.list[i].dt_txt.substring(11, 13)
        }
        for (var i = 0; i < 9; i++) {
          json_data['wind' + i] = weatherData.list[i].wind.speed
        }
        for (var i = 0; i < 9; i++) {
          json_data['timeTemp' + i] = weatherData.list[i].main.temp
        }
        json = {
          weather: json_data
        };
        console.log(json);
        //var weatherText = `It's ${weatherData.list[0].main.temp} degrees in ${weatherData.city.name}!`;
        //console.log(weatherText);
        //res.render('index', { weather: weatherText, error: null });
        res.send(json);
      }
    }
  });

});

module.exports = router;

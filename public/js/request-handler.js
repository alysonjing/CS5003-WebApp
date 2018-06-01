/**
 * Request Handler Javascript for Weather App. Contains "click" event on all cities in Nav Bar
 @method
 */

$(document).ready(function(res) {
  $(".main-wrapper").hide();
  $("#direction-details").hide();
  $("#mapSlide").hide();
  $(".weatherVis").hide();
  getNews(res);
  $("a[name='home']").on("click", function(res) {
    var data = {};
    data.data = "Hello world";
    data = getContent(data, "/home")
    $(".home-content").html(data.content);
    $(".city-content").hide();
    $(".main-wrapper").hide();
    $("#mapSlide").hide();
    $("#newsSlide").show();
    $(".home-content").show()
    $(".weatherVis").hide();
    getNews(res);
  });
  $("a[name='st andrews']").on("click", function() {
    setData("St Andrews");
    $("#newsSlide").hide();
  });
  $("a[name='dundee']").on("click", function() {
    setData("Dundee, UK");
    $("#newsSlide").hide();
  });
  $("a[name='newport-on-tay']").on("click", function() {
    setData("Newport-on-tay");
    $("#newsSlide").hide();
  });
  $("a[name='glenrothes']").on("click", function() {
    setData("Glenrothes, UK");
    $("#newsSlide").hide();
  });
  $("a[name='cupar']").on("click", function() {
    setData("Cupar, UK");
    $("#newsSlide").hide();
  });
  $("a[name='dunfermline']").on("click", function() {
    setData("Dunfermline, UK");
    $("#newsSlide").hide();
  });
  $("a[name='kirkcaldy']").on("click", function() {
    setData("Kirkcaldy, UK");
    $("#newsSlide").hide();
  });
  $("a[name='forum']").on("click", function() {});
  //Selected nav bar highlight
  $('.sidebar-nav a').click(function(e) {
    $('.sidebar-nav a').removeClass('selected');
    $(this).addClass('selected');
  });
});



/**
 * Data received from Route "getWeather" is paased and rendered to the UI
 * @function
 * @param {string} city - Getting data for the City on which user clicked.
 */

function setData(city) {
  $(".home-content").hide();
  $(".main-wrapper").show();
  $("#mapSlide").show();
  $(".weatherVis").show();
  $("#direction-details").show();
  // Fife images from http://www.welcometofife.com/,https://www.standrews.com/ and so on, check the dtails in group report.
  $("#img-place").html("<img src='images/" + city + ".jpg" + "'/>");

  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var months = ["January", "Feburary", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];
  var data = {};
  data.data = city;
  data = getContent(data, "/getWeather");
  if (data.weather !== null) {
    $("#city_name").text(city);
    $("#description").text(data.weather.description[0]);
    for (var i = 0; i < 5; i++) { //aj83: combining nodes using for loop
      if (i === 0) {
        $("#temp").text(parseInt(data.weather.temp[0]));
        $("#today").text(days[(new Date(data.weather.time[0])).getDay()] + ", " + months[(new Date(data.weather.time[0])).getMonth()] + " " + new Date().getDate() + ", " + new Date().getHours() + ":" + new Date().getMinutes());
      } else {
        $(`#temp${i}`).text(parseInt(data.weather.temp[i]));
        $(`#day${i}`).text(days[(new Date(data.weather.time[i])).getDay()]);
        //reference: css/icon from https://dribbble.com/shots/1663525-Weather-Widget-freebie-HTML-CSS
        $(`#icon${i}`).html("<img src ='css/icon/" + data.weather.icon[i] + ".svg" + "'style='position:relative;bottom:23px;left:-19px;'/>");
      }
    }
    $("#humidity").text(data.weather.humidity + "%" + " humidity");
    $("#temp_min").text(data.weather.temp_min);
    $("#temp_max").text(data.weather.temp_max);
    $("#pressure").text(data.weather.pressure + " mm Hg");
    $("#wind_speed").text(data.weather.wind_speed + " m/s");
    $("#lon").text(data.weather.lon);
    $("#lat").text(data.weather.lat);

  }
/**
*create new arrays for temperative, time, and wind for weather visualisation
@method
*/
  //build weather visualisation
  var tempData = ['Temperature']
  var tempValues = [data.weather.timeTemp0, data.weather.timeTemp1, data.weather.timeTemp2,
    data.weather.timeTemp3, data.weather.timeTemp4, data.weather.timeTemp5, data.weather.timeTemp6,
    data.weather.timeTemp7, data.weather.timeTemp8
  ]
  for (var i = 0; i < 9; i++) {
    tempData.push(tempValues[i])
  }

  var time = ['Time']
  var timeValues = [data.weather.time0, data.weather.time1, data.weather.time2,
    data.weather.time3, data.weather.time4, data.weather.time5, data.weather.time6,
    data.weather.time7
  ]
  for (var i = 0; i < 8; i++) {
    time.push(timeValues[i])
  }

  var windData = ['Wind']
  var windValues = [data.weather.wind0, data.weather.wind1, data.weather.wind2,
    data.weather.wind3, data.weather.wind4, data.weather.wind5, data.weather.wind6,
    data.weather.wind7, data.weather.wind8
  ]
  for (var i = 0; i < 9; i++) {
    if (windValues[i] === undefined) {
      windData.push(0)
    } else {
      windData.push(windValues[i])
    }
  }
  /**
  *generate chart visualisation for temperature and wind
  * @event
  */
  var chart = c3.generate({
    data: {
      x: 'Time',
      columns: [
        ['Time', time[1], time[2], time[3], time[4], time[5], time[6], time[7], time[8], ],
        tempData, windData,
      ],
      axes: {
        Temperature: 'y',
        Wind: 'y2'
      },

      type: 'line',
      colors: {
        Temperature: '#71B280'
      },
      labels: {
        format: {
          Temperature: d3.format('')
        }
      }
    },
    zoom: {
      enabled: true
    },
    grid: {
      y: {
        show: true
      },
    },
    tooltip: {
      show: true
    },
    axis: {
      y: {
        label: {
          text: "Temperature (°C)",
          position: 'outer-center'
        },
      },
      y2: {
        show: true,
        padding: {
          bottom: 0
        },
        min: 0,
        label: {
          text: "Wind (mph)",
          position: 'outer-center'
        },
      },
      x: {
        label: {
          text: "Time (24 hours)",
          position: 'outer-center'
        },
        tick: {
          values: [time[1], time[2], time[3], time[4], time[5], time[6], time[7], time[8], ],
        },
      }
    }
  });
  setTimeout(function() {
    chart.transform('bar', 'Temperature');
  }, 2000);

/**
  *build the initial map based on the coordinates of the openweather long/lat values
  @method
  */
  let lonVal = data.weather.lon
  let latVal = data.weather.lat

  let map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: {
      lat: latVal,
      lng: lonVal
    }
  })


  //put a traffic layer on top of the map to see how much traffic there is
  let trafficLayer = new google.maps.TrafficLayer()
  trafficLayer.setMap(map)

  // Instantiate a directions service.
  let directionsService = new google.maps.DirectionsService;

  // Create a renderer for directions and bind it to the map.
  let directionsDisplay = new google.maps.DirectionsRenderer({
    map: map
  });
  directionsDisplay.setMap(map);

  //clear the directions panel so that new information can be loaded everytime it is being refreshed
  directionsDisplay.setPanel(null);
  //assign the direction from the api call to the "right-panel" div
  directionsDisplay.setPanel(document.getElementById('right-panel'));

  let onChangeHandler = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  };

  //on click event of the select menues, call onChangeHandler to calculate the route
  $('#start').change(onChangeHandler);
  $('#end').change(onChangeHandler);
  $('#travel-mode').change(onChangeHandler);

/**
  *calculate distance and route between two destinations
  @method
  */

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: $('#start').val(),
      destination: $('#end').val(),
      travelMode: $('#travel-mode').val()
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else if ($('#start').val() == "select") {
        window.alert('"Select" is not a city - please select a city')
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
  //empty the panel that holds the directions so that new directions can be displayed
  $('#right-panel').empty();
} //end of setData function

/**
 * AJAX Handler to make a request to the Route and Get the JSON Data in response.
 * @function
 * @param {object} data - JSON data to be sent with Request to the Route.
 * @param {string} url - URL of the Route from which the data to be fetched.
 */
function getContent(data, url) {
  var output ='';
  $.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    data: data,
    url: url,
    async: false,
    success: function(data) {
      output = data;
    }
  });
  return output;
}

/**
  * create function to fetch news from external API.
  * @method
  * @param {object} res
  */

function getNews(res){

  let url = 'https://newsapi.org/v2/top-headlines?' +
        'country=gb&' +
        'apiKey=bcc8f687a1b144dbbcc612e6f4e10aba';

  let req = new Request(url);

  //use a fetch request to get the new data from the API
  fetch(req)
    .then(res => res.json())
    .then(res => displayHeadlines(res))
    .catch(err => console.log(err));

    /**
      * creates a function to display news on our home page.
      * @method
      * @param {object} news
      */

  function displayHeadlines(res) {

    let news = res;
    console.log(news);
/**
    *loop over the returned object and check whether any of the required information are missing
    *if one of the required information is missing, continue with the next one
    @method
    */
    for (idx = 0; idx < 10; idx++){
      if (news.articles[idx].title !== null || news.articles[idx].description !== null || news.articles[idx].urlToImage !== null) {

        //assign title, description and picture to the newsSlide div
        $('#title-wrapper1').text(news.articles[idx].title);
        $('#content-wrapper1').text(news.articles[idx].description);

        let img1 = document.createElement('img');
        img1.setAttribute('src', news.articles[idx++].urlToImage);
        img1.setAttribute('width', '100%');
        img1.setAttribute('height', '400px');
        img1.setAttribute('alt', '');
        $('#picture-wrapper1').html(img1);

        // assign a second title, description and picture to the newsSlide div
        $('#title-wrapper2').text(news.articles[idx].title);
        $('#content-wrapper2').text(news.articles[idx].description);

        let img2 = document.createElement('img');
        img2.setAttribute('src', news.articles[idx++].urlToImage);
        img2.setAttribute('width', '100%');
        img2.setAttribute('height', '400px');
        img2.setAttribute('alt', '');
        $('#picture-wrapper2').html(img2);

        // assign a third title, description and picture to the newsSlide div
        $('#title-wrapper3').text(news.articles[idx].title);
        $('#content-wrapper3').text(news.articles[idx].description);

        let img3 = document.createElement('img');
        img3.setAttribute('src', news.articles[idx].urlToImage);
        img3.setAttribute('width', '100%');
        img3.setAttribute('height', '400px');
        img3.setAttribute('alt', '');
        $('#picture-wrapper3').html(img3);

      } else {
        continue;
    }
   }
  }
 }
//set a timeout to repeat the API call after some time
setTimeout(getNews, 10000);

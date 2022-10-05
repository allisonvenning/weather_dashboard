// Global variables
var searchBtn = document.getElementById('search-button');
var searchInput = document.getElementById('search-input');
var currentDay = document.getElementById('today');
var forecast = document.getElementById('forecast');
var history = document.getElementById('historybtn');

// API info
var api = "http://api.openweathermap.org";
var apiKey = "d91f911bcf2c0f925fb6535547a5ddc9"

// Add timezone plugins to day.js
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// Functions and their purposes:
// #1 Take value of input - validate city
function searchForm(event) {
    console.log(searchForm);
   
    if (!searchInput.value) {
        return;
    }
    event.preventDefault();
    var search = searchInput.value.trim();
    getCoords(search);
}

// #2 Get the coordinates of the city by a geo  API (Fetch)
function getCoords(search) {
   var apiUrl = `${api}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
   console.log(apiUrl);
   fetch(apiUrl)
   .then(function(res) {
    return res.json();
   })
   .then(function(data) {
    if (!data[0]) {
        console.log(data[0]);
        alert("Please enter a valid city");
    } else {
        // searchHistory(search);
        getWeather(data[0]);
    }
   })
}

// #3 Take those coordinates and get the weather (fetch)
function getWeather(location) {
    var { lat, lon } = location;
    console.log(location);
    console.log(lat);
    console.log(lon);
    var city = location.name;
    console.log(city);
    console.log(location.name);
    var apiUrl = `${api}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${apiKey}`;

    fetch(apiUrl)
    .then(function(res) {
     return res.json();
    })
    .then(function(data) {
     passInfo(city, data);
     })
}
// This function will carry through both current and daily forecast data to their respective functions
function passInfo(city, data) {
    currentWeather(city, data.current, data.timezone);
    console.log(data.current);
    forecastWeather(data.daily, data.timezone);
    console.log(data.daily);
}

// // #4 Handle current weather (build card and pull the data)
function currentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format("M/D/YYYY");
    // weather data from fetch
    var temp = weather.temp;
    var wind = weather.wind_speed;
    var humidity = weather.humidiy;
    var uvi = weather.uvi;
    var iconUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var iconDescription = weather.weather[0].description || weather[0].main;

    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var title = document.createElement("h5");
    var iconImg = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    var uviEl = document.createElement("p");
    var uviBadge = document.createElement("button");

    card.setAttribute("class", "card");
    cardBody.setAttribute("class", "card-body");
    card.append(cardBody);

    title.setAttribute("class", "h3 card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    title.textContent = `${city} (${date})`;
    iconImg.setAttribute("src", iconUrl);
    iconImg.setAttribute("alt", iconDescription);
    iconImg.setAttribute("class", "card-img");
    title.append(iconImg);

    // create text content of data into the card areas
    tempEl.textContent = `Temp: ${temp}F`;
    windEl.textContent = `Wind: ${wind}MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;
    uviEl.textContent = `UV Index: `;
    
    // append data into card body
    cardBody.append(title, tempEl, windEl, humidityEl);

    // UV index- create text
    // uviEl.textContent = weather.uvi;

    // uviBadge.classList.add("btn", "btn-sm")
    uviBadge.classList.add("btn", "btn-sm");

    // CSS - call out 3 classes in CSS (safe, okay, danger for UVI) - look at readme
    // if comparison to determine past, present, future - add uvi text to button/ append
    // safe = 3, okay = 7, else = danger
    if (uvi < 3) {
        uviBadge.classList.add("btn-success");
    } else if (uvi < 7) {
        uviBadge.classList.add("btn-warning");
    } else {
        uviBadge.classList.add("btn-danger");
    }

    uviBadge.textContent = uvi;
    uviEl.append(uviBadge);
    cardBody.append(uviEl);

    currentDay.innerHTML = '';
    currentDay.append(card);
};

// // #5 Forecast (iterate through array of 5 days - call out a function for the card)
function forecastWeather(dailyForecast, timezone) {
    console.log(forecastWeather);
    var startDay = dayjs().tz(timezone).add(1, "day").startOf("day").unix();
    var endDay = dayjs().tz(timezone).add(6, "day").startOf("day").unix();
    var heading = document.createElement("h3");
    var headingCol = document.createElement("div");

    headingCol.setAttribute("class", "col-12");
    heading.textContent = "5 Day Forecast";
    headingCol.append(heading);
    forecast.append(headingCol);

    for (let i = 0; i < dailyForecast.length; i++) {
        // const element = array[i];
        if (dailyForecast[i].dt >= startDay && dailyForecast[i].dt < endDay) {
            forecastWeatherCard(dailyForecast[i], timezone);
        }
    }
}

function forecastWeatherCard(forecast, timezone) {
    console.log(forecastWeatherCard);
    // look at demo to review what needs to be coded here
    // iterating through the index  of daily (for loop - calling out the card)
   // var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var unixTs = forecast.dt;
    var temp = forecast.temp.day;
    var wind = forecast.wind_speed;
    var {humidity} = forecast;
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description || weather[0].main;
    var col = document.createElement("div");
    var card = document.createElement("div");
    var cardBody = document.createElement("div");
    var title = document.createElement("h5");
    var iconImg = document.createElement("img");
    var tempEl = document.createElement("p");
    var windEl = document.createElement("p");
    var humidityEl = document.createElement("p");
    
    col.append(card);
    card.setAttribute("class", "card bg-primary h-100 text-white");
    cardBody.setAttribute("class", "card-body p-2");
    card.append(cardBody);
    cardBody.append(title, iconUrl, tempEl, windEl, humidityEl);
    col.setAttribute("class", "col-md five-day-card");

    title.setAttribute("class", "card-title");
    tempEl.setAttribute("class", "card-text");
    windEl.setAttribute("class", "card-text");
    humidityEl.setAttribute("class", "card-text");

    title.textContent = dayjs.unix(unixTs).tz(timezone).format("M/D/YYYY");
    iconImg.setAttribute("src", iconUrl);
    iconImg.setAttribute("alt", iconDescription);
    //iconImg.setAttribute("class", "card-img");
   // title.append(iconImg);

    // create text content of data into the card areas
    tempEl.textContent = `Temp: ${temp}F`;
    windEl.textContent = `Wind: ${wind}MPH`;
    humidityEl.textContent = `Humidity: ${humidity}%`;

    // append data into card body
    //cardBody.append(title, tempEl, windEl, humidityEl);

    //forecastWeather.innerHTML = '';
    forecast.append(col);
}


// // #6 Create the card and pull data
// function name(params) {
    
// }
// click event to start the app - go to first function
searchBtn.addEventListener('click', searchForm);


// Get other API
// weather: https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid={API key}
// city coordinates:  http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
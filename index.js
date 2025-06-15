const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");
const themeToggleBtn = document.getElementById("theme_toggle");
const body = document.body;
const video = document.getElementById("background-video");

const dayVideo = "Video/cloudy sky 8(2).mp4";
const nightVideo = "Video/night sky 1.mp4";
video.src = dayVideo;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// *>>>>>>>>>----- Theme toggle -------->>>>>>>>>>>>>>>>

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark");
  themeToggleBtn.textContent = "☀️";
} else {
  themeToggleBtn.textContent = "🌙";
}

themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDark = body.classList.contains("dark");
  themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");

  video.src = isDark ? nightVideo : dayVideo;
  video.load();
  video.play();
});

//*>>>>>>>>>>>-------- Scroll navbar --------->>>>>>>>>>>>>

document.getElementById("today-btn").onclick = () =>
  document.getElementById("today-section").scrollIntoView({ behavior: "smooth" });
document.getElementById("daily-btn").onclick = () =>
  document.getElementById("daily-section").scrollIntoView({ behavior: "smooth" });
document.getElementById("hourly-btn").onclick = () =>
  document.getElementById("hourly-section").scrollIntoView({ behavior: "smooth" });

//*>>>>>>>>>--------Live Time and Date --------->>>>>>>>>>>
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" : "") +
    hoursIn12HrFormat +
    " : " +
    (minutes < 10 ? "0" : "") +
    minutes +
    ' <span id="am-pm">' +
    ampm +
    "</span>";

  dateEl.innerHTML = days[day] + " , " + date + " " + months[month];
}, 1000);

//*>>>>>>>>>>>>------- Geolocation weather ------------>>>>>>>>>>>>

getWeatherDataByGeolocation();

function getWeatherDataByGeolocation() {
  navigator.geolocation.getCurrentPosition(
    (success) => {
      const { latitude, longitude } = success.coords;
      fetch(`/.netlify/functions/weather?lat=${latitude}&lon=${longitude}`)
        .then((res) => {
          if (!res.ok) throw new Error("Network error");
          return res.json();
        })
        .then((data) => {
          const { currentData, forecastData } = data;
          console.log("ForecastData:", forecastData);
          showWeatherData(currentData, forecastData);
        })
        .catch((error) => {
          console.error("Geolocation weather fetch failed:", error);
        });
    },
    () => {
      alert("Geolocation not allowed or failed. Please search a city manually.");
    }
  );
}

//*>>>>>>>>>>------ Search by city -------->>>>>>>>>>>>>>

document.getElementById("search_btn").addEventListener("click", () => {
  const city = document.getElementById("city_input").value.trim();
  if (city) getWeatherDataByCity(city);
});

document.getElementById("city_input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("search_btn").click();
});

function getWeatherDataByCity(city) {
  fetch(`/.netlify/functions/weather?city=${city}`)
    .then((res) => {
      if (!res.ok) {
        alert("City not found!");
        throw new Error("City not found");
      }
      return res.json();
    })
    .then((data) => {
      const { currentData, forecastData } = data;
      console.log("ForecastData:", forecastData); 
      showWeatherData(currentData, forecastData);
    })
    .catch((error) => {
      console.error("City weather fetch failed:", error);
    });
}



function showWeatherData(currentData, forecastData) {
  document.getElementById("location-name").textContent = `${currentData.name}, ${currentData.sys.country}`;

  const lat = currentData.coord.lat;
  const lon = currentData.coord.lon;
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";

  countryEl.textContent = `${Math.abs(lat).toFixed(2)}°${latDir} ${Math.abs(lon).toFixed(2)}°${lonDir}`;

  const humidity = currentData.main.humidity;
  const pressure = currentData.main.pressure;
  const wind_speed = currentData.wind.speed;
  const sunrise = currentData.sys.sunrise;
  const sunset = currentData.sys.sunset;

  currentWeatherItemsEl.innerHTML = `
    <div class="weather-info">
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="weather icon" class="current-w-icon">
      <div class="temp">${currentData.main.temp}&#176;C</div>
      <div class="feelslike-main">
        <div class="feelslike">Feels Like: ${currentData.main.feels_like}&#176;C</div>
        <div class="weather-main">${currentData.weather[0].main}</div>
      </div>
    </div>

    <div class="weather-description">
      <div class="description">Weather description: ${currentData.weather[0].description}</div>
    </div>

    <div class="other-weather-items">
      <div class="weather-items"><div><i class="fas fa-tint"></i> Humidity</div><div>${humidity}%</div></div>
      <div class="weather-items"><div><i class="fas fa-tachometer-alt"></i> Pressure</div><div>${pressure} hPa</div></div>
      <div class="weather-items"><div><i class="fas fa-wind"></i> Wind Speed</div><div>${wind_speed} m/s</div></div>
      <div class="weather-items"><div><i class="fas fa-sun"></i> Sunrise</div><div>${moment(sunrise * 1000).format("hh:mm A")}</div></div>
      <div class="weather-items"><div><i class="fas fa-moon"></i> Sunset</div><div>${moment(sunset * 1000).format("hh:mm A")}</div></div>
    </div>
  `;

// *>>>>>>>----- Today card------>>>>>>>>>>>>>>>>>>

  currentTempEl.innerHTML = `
    <div class="today-item">
      <div class="day">${moment().format("dddd")}</div>
      <img src="https://openweathermap.org/img/wn/${currentData.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
      <div class="weather_description">${currentData.weather[0].description}</div>
      <div class="temp">Temp: ${currentData.main.temp}&#176;C</div>
      <div class="feelslike">Feels Like: ${currentData.main.feels_like}&#176;C</div>
    </div>
  `;

// * >>>>>>>>>------ Next five day card ------>>>>>>>>>>>>>>>>>>

  // const nextFiveDaysForecast = forecastData.list.filter(item => item.dt_txt.includes("12:00:00"));
  const today = moment().format("YYYY-MM-DD");
const nextFiveDaysForecast = forecastData.list.filter(item =>
  item.dt_txt.includes("12:00:00") && !item.dt_txt.startsWith(today)
).slice(0, 5);

let otherDayForecast = "";
  nextFiveDaysForecast.forEach(day => {
    otherDayForecast += `
      <div class="weather-forecast-item">
        <div class="day">${moment(day.dt * 1000).format("dddd")}</div>
        <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
        <div class="weather_description">${day.weather[0].description}</div>
        <div class="temp">Temp: ${day.main.temp}&#176;C</div>
        <div class="feelslike">Feels Like: ${day.main.feels_like}&#176;C</div>
      </div>
    `;
  });
  weatherForecastEl.innerHTML = otherDayForecast;

// * >>>>>>>>-----Hourly forecast -------->>>>>>>>>>>>>>>>>>>>>

  const hourlyForecastEl = document.getElementById("hourly-forecast");
  const hourlyData = forecastData.list.slice(0, 12);
  let hourlyHTML = "";
  hourlyData.forEach(hour => {
    hourlyHTML += `
      <div class="hourly-item">
        <div class="day">${moment(hour.dt * 1000).format("ddd")}</div>
        <div>${moment(hour.dt * 1000).format("h A")}</div>
        <img class="hourly-w-icon" src="https://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png" alt="icon">
        <div class="hourly-weather-description">${hour.weather[0].description}</div>
        <div>${hour.main.temp}&#176;C</div>
        <div class="hourly-humidity"><i class="fas fa-tint"></i> ${hour.main.humidity}%</div>
        <div class="hourly-windspeed"><i class="fas fa-wind"></i> ${hour.wind.speed} m/s</div>
      </div>`;
  });
  hourlyForecastEl.innerHTML = hourlyHTML;
}

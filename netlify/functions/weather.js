require("dotenv").config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


exports.handler = async function (event) {
  const API_KEY = process.env.API_KEY;
  console.log("API_KEY Loaded:", !!API_KEY); // logs true/false
  console.log("Query Params:", event.queryStringParameters);

  const { lat, lon, city } = event.queryStringParameters;


  if (!API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API Key" }),
    };
  }

  try {
    let currentWeatherUrl = "";
    let forecastUrl = "";

    if (city) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    } else if (lat && lon) {
      currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing lat/lon or city parameter" }),
      };
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(currentWeatherUrl),
      fetch(forecastUrl),
    ]);

    const currentData = await currentRes.json();
    const forecastData = await forecastRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ currentData, forecastData }),
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch weather data" }),
    };
  }
};

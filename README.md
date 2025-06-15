# 🌦️ Weather Forecast App

A responsive and interactive weather forecasting web application built using **HTML, CSS, and JavaScript**, with a **secured backend integration** using **Netlify Functions** to protect API keys.

## 📌 Project Overview

This application allows users to get real-time weather information including **current**, **hourly**, and **5-day forecasts** based on their location. It provides an intuitive interface with day/night themed background videos and ensures secure API calls through a serverless backend setup.

## 🔑 Key Features

- 📍 Auto-detects user’s current location via Geolocation API  
- 🔎 Search by city name with instant forecast updates
- ☀️ Displays today’s weather, hourly forecast, and 5-day outlook
- 🌗 Day/Night theme with background video transitions
- 🌐 Secure weather data fetching using Netlify Functions (API key protected)
- 📱 Fully responsive design for desktop, tablet, and mobile

## 🧰 Technologies Used

- **Frontend**: HTML, CSS, JavaScript  
- **API Integration**: OpenWeatherMap API  
- **Backend**: Netlify Functions (Node.js)  
- **Deployment**: GitHub + Netlify  

## 📁 Folder Structure

weather-forecast-app/
├── netlify/
│ └── functions/
│ └── weather.js # Serverless backend logic
├── Video/ # Day and night background videos (ignored from GitHub)
├── Images/ # Supporting background/images
├── index.html
├── style.css
├── index.js
└── netlify.toml


## 🔐 API Security

API keys are **not exposed** in frontend code. All weather data is fetched through a Netlify Function (`weather.js`) that securely handles requests on the server side.

## 🔗 Live Demo

- 🌍 **Live Website**: [https://venerable-eclair-78e541.netlify.app/](https://venerable-eclair-78e541.netlify.app/)   
👉 [GitHub Repository](https://github.com/M-Lipsa-Jena/weather-forecast-app)

---

## 👩‍💻 About the Developer

**M. Lipsa Jena**  
Frontend Developer | Passionate about building user-centric and responsive web applications  
Skilled in JavaScript, React, Node.js, and modern web practices.

---


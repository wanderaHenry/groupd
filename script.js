
const apiKey = "7947387b8c052c0829ee40bbf089aa33"; //my api key
const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const loader = document.getElementById("loader");
const weatherCard = document.getElementById("weather-card");
const errorMsg = document.getElementById("error-msg");
const themeToggle = document.getElementById("theme-toggle");

// Load last searched city
const lastCity = localStorage.getItem("lastCity");
if (lastCity) fetchWeather(lastCity);

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    showLoader();
    fetchWeather(city);
  }
});

themeToggle.addEventListener("click", () => {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme");
  html.setAttribute("data-theme", current === "light" ? "dark" : "light");
});

function showLoader() {
  loader.classList.remove("hidden");
  weatherCard.style.display = "none";
  errorMsg.textContent = "";
}

function hideLoader() {
  loader.classList.add("hidden");
}

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    displayWeather(data);
    errorMsg.textContent = "";
    localStorage.setItem("lastCity", city);
  } catch (err) {
    errorMsg.textContent = "Invalid city name. Please try again.";
    weatherCard.style.display = "none";
  } finally {
    hideLoader();
  }
}

function displayWeather(data) {
  const { name, main, weather, wind } = data;
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

  weatherCard.innerHTML = `
    <h2>${name}</h2>
    <img src="${icon}" alt="Weather Icon">
    <p>${weather[0].main} - ${weather[0].description}</p>
    <p>🌡 Temperature: ${main.temp}°C</p>
    <p>💧 Humidity: ${main.humidity}%</p>
    <p>🌬 Wind Speed: ${wind.speed} m/s</p>
  `;
  weatherCard.style.display = "block";
}

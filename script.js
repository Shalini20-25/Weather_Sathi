// msg : please generate ur own API from any resource like weatherAPI etc. and place it at the place of "api_please"

const apiKey = "api_please"; 

// WeatherAPI Endpoints
const CURRENT_URL = "http://api.weatherapi.com/v1/current.json";
const FORECAST_URL = "http://api.weatherapi.com/v1/forecast.json";

/* ===========================================================
   Global Variables
=========================================================== */

let currentQuery = "";
let useCelsius = true;
let currentLanguage = "en";

/* ===========================================================
   DOM Elements
=========================================================== */

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

const unitToggle = document.getElementById("unitToggle");
const languageSelect = document.getElementById("languageSelect");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("errorMessage");

const weatherCard = document.getElementById("currentWeather");
const forecastContainer = document.getElementById("forecastContainer");
const forecastTitle = document.getElementById("forecastTitle");

const toast = document.getElementById("toast");

/* Current Weather */

const cityName = document.getElementById("cityName");
const country = document.getElementById("country");
const localTime = document.getElementById("localTime");

const weatherIcon = document.getElementById("weatherIcon");

const temperature = document.getElementById("temperature");

const conditionEmoji = document.getElementById("conditionEmoji");
const conditionText = document.getElementById("conditionText");

const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

/* Labels */

const title = document.getElementById("title");
const humidityLabel = document.getElementById("humidityLabel");
const windLabel = document.getElementById("windLabel");
const forecastHeading = document.getElementById("forecastTitle");
const loadingText = document.getElementById("loadingText");
const footerText = document.getElementById("footerText");

const languageLabel = document.getElementById("languageLabel");
const unitLabel = document.getElementById("unitLabel");

/* ===========================================================
   Language Dictionary
=========================================================== */

const text = {

    en: {

        title: "🌤 Weather App",

        placeholder: "Enter city...",

        search: "Search",

        location: "My Location",

        humidity: "Humidity",

        wind: "Wind",

        forecast: "5-Day Forecast",

        loading: "Loading...",

        footer: "Weather data provided by WeatherAPI.com",

        language: "Language",

        unit: "°C / °F",

        cityNotFound: "City not found.",

        suggestion: "Try adding a region or check spelling.",

        invalidKey: "Invalid API key or API limit exceeded.",

        geoDenied: "Location permission denied.",

        network: "Network error. Please try again.",

        umbrella: "Please carry your umbrella ☔",

        sunny: "Stay at home or carry a water bottle ☀️",

        windy: "Be careful, it's windy 🌬️",

        snow: "Wear warm clothes ❄️",

        defaultAdvice: "Have a nice day!"
    },

    hi: {

        title: "🌤 मौसम ऐप",

        placeholder: "शहर का नाम लिखें...",

        search: "खोजें",

        location: "मेरा स्थान",

        humidity: "नमी",

        wind: "हवा",

        forecast: "5 दिन का पूर्वानुमान",

        loading: "लोड हो रहा है...",

        footer: "मौसम डेटा WeatherAPI.com द्वारा",

        language: "भाषा",

        unit: "°C / °F",

        cityNotFound: "शहर नहीं मिला।",

        suggestion: "वर्तनी जांचें या क्षेत्र जोड़कर देखें।",

        invalidKey: "API Key गलत है या सीमा पूरी हो गई है।",

        geoDenied: "लोकेशन अनुमति अस्वीकार कर दी गई।",

        network: "नेटवर्क त्रुटि।",

        umbrella: "कृपया छाता साथ रखें ☔",

        sunny: "घर पर रहें या पानी की बोतल साथ रखें ☀️",

        windy: "सावधान रहें, तेज़ हवा चल रही है 🌬️",

        snow: "गर्म कपड़े पहनें ❄️",

        defaultAdvice: "आपका दिन शुभ हो!"
    }

};

/* ===========================================================
   Update UI Language
=========================================================== */

function updateLanguageUI() {

    const lang = text[currentLanguage];

    title.textContent = lang.title;

    cityInput.placeholder = lang.placeholder;

    searchBtn.textContent = lang.search;

    locationBtn.textContent = lang.location;

    humidityLabel.textContent = lang.humidity;

    windLabel.textContent = lang.wind;

    forecastHeading.textContent = lang.forecast;

    loadingText.textContent = lang.loading;

    footerText.textContent = lang.footer;

    languageLabel.textContent = lang.language;

    unitLabel.textContent = lang.unit;

}

/* ===========================================================
   Show Loading
=========================================================== */

function showLoading(){

    loading.classList.remove("hidden");

}

/* ===========================================================
   Hide Loading
=========================================================== */

function hideLoading(){

    loading.classList.add("hidden");

}

/* ===========================================================
   Show Error
=========================================================== */

function showError(message){

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

}

/* ===========================================================
   Hide Error
=========================================================== */

function hideError(){

    errorBox.classList.add("hidden");

}

/* ===========================================================
   Weather Emoji
=========================================================== */

function getEmoji(condition){

    const c = condition.toLowerCase();

    if(c.includes("rain")) return "🌧️";

    if(c.includes("snow")) return "❄️";

    if(c.includes("wind")) return "🌬️";

    if(c.includes("cloud")) return "☁️";

    if(c.includes("clear")) return "☀️";

    if(c.includes("sun")) return "☀️";

    return "🌤️";

}
/* ===========================================================
   Fetch Current Weather + Forecast
   Uses encodeURIComponent() to safely encode user input.
=========================================================== */

async function fetchWeather(query) {

    currentQuery = query;

    showLoading();
    hideError();

    // Clear previous forecast before rendering new one
    forecastContainer.innerHTML = "";
    forecastTitle.classList.add("hidden");

    weatherCard.classList.add("hidden");

    try {

        const encodedQuery = encodeURIComponent(query);

        // Fetch current weather and forecast simultaneously
        const [currentResponse, forecastResponse] = await Promise.all([

            fetch(
                `${CURRENT_URL}?key=${apiKey}&q=${encodedQuery}&aqi=yes`
            ),

            fetch(
                `${FORECAST_URL}?key=${apiKey}&q=${encodedQuery}&days=5&aqi=no&alerts=no`
            )

        ]);

        /* ---------------------------------------
           Handle API Errors
        --------------------------------------- */

        if (!currentResponse.ok || !forecastResponse.ok) {

            // WeatherAPI usually returns JSON even for errors
            let errorData = {};

            try {
                errorData = await currentResponse.json();
            } catch (e) {}

            const code = errorData?.error?.code;

            // Invalid API key
            if (code === 1002 || code === 2006) {

                showError(text[currentLanguage].invalidKey);

                return;

            }

            // City not found
            if (code === 1006) {

                showError(
                    text[currentLanguage].cityNotFound +
                    " " +
                    text[currentLanguage].suggestion
                );

                return;

            }

            throw new Error("API Error");

        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        renderCurrentWeather(currentData);
        renderForecast(forecastData);

        showAdvice(currentData.current.condition.text);

    }

    catch (error) {

        console.error(error);

        showError(text[currentLanguage].network);

    }

    finally {

        hideLoading();

        // Keep search input active for quick searches
        cityInput.focus();

    }

}

/* ===========================================================
   Fetch Weather by Latitude & Longitude
=========================================================== */

async function fetchWeatherByCoordinates(latitude, longitude) {

    const query = `${latitude},${longitude}`;

    await fetchWeather(query);

}

/* ===========================================================
   Get User Location
=========================================================== */

function getLocation() {

    if (!navigator.geolocation) {

        showError(text[currentLanguage].geoDenied);

        return;

    }

    showLoading();

    navigator.geolocation.getCurrentPosition(

        // Success
        position => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            fetchWeatherByCoordinates(latitude, longitude);

        },

        // Error
        error => {

            hideLoading();

            switch (error.code) {

                case error.PERMISSION_DENIED:

                    showError(text[currentLanguage].geoDenied);
                    break;

                case error.POSITION_UNAVAILABLE:

                    showError(text[currentLanguage].network);
                    break;

                case error.TIMEOUT:

                    showError(text[currentLanguage].network);
                    break;

                default:

                    showError(text[currentLanguage].network);

            }

        },

        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

    );

}

/* ===========================================================
   Helper Function
   Returns selected temperature
=========================================================== */

function getTemperature(current) {

    return useCelsius
        ? `${current.temp_c} °C`
        : `${current.temp_f} °F`;

}

/* ===========================================================
   Helper Function
   Returns selected wind speed
=========================================================== */

function getWind(current) {

    return useCelsius
        ? `${current.wind_kph} km/h`
        : `${current.wind_mph} mph`;

}

/* ===========================================================
   Get Forecast Temperature
=========================================================== */

function getForecastTemperature(day) {

    if (useCelsius) {

        return `${day.maxtemp_c}° / ${day.mintemp_c}°`;

    }

    return `${day.maxtemp_f}° / ${day.mintemp_f}°`;

}

/* ===========================================================
   Format Forecast Date
=========================================================== */

function formatDate(dateString) {

    const options = {

        weekday: "short"

    };

    return new Date(dateString).toLocaleDateString(

        currentLanguage === "hi" ? "hi-IN" : "en-US",

        options

    );

}
/* ===========================================================
   Render Current Weather
=========================================================== */

function renderCurrentWeather(data) {

    const location = data.location;
    const current = data.current;

    // Show location information
    cityName.textContent = location.name;
    country.textContent = location.country;
    localTime.textContent = location.localtime;

    // Weather icon from WeatherAPI
    weatherIcon.src = "https:" + current.condition.icon;
    weatherIcon.alt = current.condition.text;

    // Temperature
    temperature.textContent = getTemperature(current);

    // Condition
    conditionEmoji.textContent = getEmoji(current.condition.text);
    conditionText.textContent = current.condition.text;

    // Weather details
    humidity.textContent = current.humidity + "%";
    wind.textContent = getWind(current);

    // Display card
    weatherCard.classList.remove("hidden");
}

/* ===========================================================
   Render 5-Day Forecast
=========================================================== */

function renderForecast(data) {

    // Clear previous forecast
    forecastContainer.innerHTML = "";

    forecastTitle.classList.remove("hidden");

    data.forecast.forecastday.forEach(day => {

        const card = document.createElement("div");

        card.className = "forecast-card";

        card.innerHTML = `

            <h3>${formatDate(day.date)}</h3>

            <img
                src="https:${day.day.condition.icon}"
                alt="${day.day.condition.text}"
            >

            <div style="font-size:28px;margin:8px 0;">
                ${getEmoji(day.day.condition.text)}
            </div>

            <p>${day.day.condition.text}</p>

            <p class="forecast-temp">
                ${getForecastTemperature(day.day)}
            </p>

        `;

        forecastContainer.appendChild(card);

    });

}

/* ===========================================================
   Show Toast Message
=========================================================== */

function showToast(message) {

    toast.textContent = message;

    toast.classList.remove("hidden");

    // Hide after 3.5 seconds
    setTimeout(() => {

        toast.classList.add("hidden");

    }, 3500);

    // Older browser fallback
    if (!("animate" in document.body)) {

        alert(message);

    }

}

/* ===========================================================
   Contextual Weather Advice
   Priority:
   Rain
   Snow
   Wind
   Sunny/Clear
   Default
=========================================================== */

function showAdvice(condition) {

    const value = condition.toLowerCase();

    let message;

    if (value.includes("rain")) {

        message = text[currentLanguage].umbrella;

    }

    else if (value.includes("snow")) {

        message = text[currentLanguage].snow;

    }

    else if (value.includes("wind")) {

        message = text[currentLanguage].windy;

    }

    else if (
        value.includes("sun") ||
        value.includes("clear")
    ) {

        message = text[currentLanguage].sunny;

    }

    else {

        message = text[currentLanguage].defaultAdvice;

    }

    showToast(message);

}

/* ===========================================================
   Refresh Weather
   Used after changing units or language
=========================================================== */

function refreshWeather() {

    if (currentQuery !== "") {

        fetchWeather(currentQuery);

    }

}
/* ===========================================================
   Search Weather by City
=========================================================== */

function searchWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        showError(
            currentLanguage === "en"
                ? "Please enter a city name."
                : "कृपया शहर का नाम दर्ज करें।"
        );

        cityInput.focus();

        return;
    }

    fetchWeather(city);
}

/* ===========================================================
   Search Button
=========================================================== */

searchBtn.addEventListener("click", () => {

    searchWeather();

});

/* ===========================================================
   Enter Key Search
=========================================================== */

cityInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchWeather();

    }

});

/* ===========================================================
   My Location Button
=========================================================== */

locationBtn.addEventListener("click", () => {

    getLocation();

});

/* ===========================================================
   Unit Toggle
   Re-fetch current query so all displayed values stay synced.
=========================================================== */

unitToggle.addEventListener("change", () => {

    useCelsius = unitToggle.value === "c";

    if (currentQuery !== "") {

        fetchWeather(currentQuery);

    }

});

/* ===========================================================
   Language Selector
=========================================================== */

languageSelect.addEventListener("change", () => {

    currentLanguage = languageSelect.value;

    updateLanguageUI();

    hideError();

    // Refresh weather in the selected language
    if (currentQuery !== "") {

        fetchWeather(currentQuery);

    }

});

/* ===========================================================
   Accessibility Improvements
=========================================================== */

// Keep input focused after searches
cityInput.focus();

// Keyboard focus styling
document.querySelectorAll("button, select, input").forEach(element => {

    element.addEventListener("focus", () => {

        element.style.outline = "2px solid #73c6b6";

    });

    element.addEventListener("blur", () => {

        element.style.outline = "";

    });

});

/* ===========================================================
   Initialize App
=========================================================== */

updateLanguageUI();

unitToggle.value = "c";
languageSelect.value = "en";




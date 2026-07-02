# 🌤 Weather App

A modern, responsive Weather Application built using **HTML, CSS, and JavaScript** that provides real-time weather information and a 5-day weather forecast using **WeatherAPI**.

The application allows users to search for weather by city, use their current location, switch between temperature units, and view the interface in either **English** or **Hindi**. It also includes contextual weather advice, smooth animations, and a clean user-friendly interface.

---

## ✨ Features

### 🌍 Weather Information

* Search weather by city name
* Get weather using your current location
* Display current weather conditions
* Show city, country, and local time
* Display weather icons and condition emojis
* Show humidity and wind speed
* View a 5-day weather forecast

### 🌡 Temperature Units

* Switch between **Celsius (°C)** and **Fahrenheit (°F)**
* Weather information refreshes automatically after changing the unit

### 🌐 Multi-Language Support

Supports two languages:

* 🇬🇧 English
* 🇮🇳 Hindi

The app dynamically updates:

* App title
* Search placeholder
* Buttons
* Labels
* Forecast heading
* Loading text
* Footer text
* Error messages
* Weather advice notifications

### 📍 Current Location Weather

* Uses the browser's Geolocation API
* Fetches weather using latitude and longitude
* Handles location permission errors gracefully

### 💬 Smart Weather Advice

Displays contextual toast notifications based on current weather conditions.

Examples:

* ☔ Carry an umbrella during rain
* ☀️ Stay hydrated on sunny days
* 🌬️ Be careful in windy weather
* ❄️ Wear warm clothes during snow

### 🚨 Error Handling

Handles common scenarios including:

* Invalid city name
* Invalid API key
* API usage limit exceeded
* Network errors
* Empty search input
* Location permission denied

### 🎨 User Interface

* Modern glassmorphism-inspired design
* Smooth animations and transitions
* Sticky search section
* Loading spinner
* Toast notifications
* Responsive layout for desktop, tablet, and mobile devices

### ♿ Accessibility

* ARIA labels for form controls
* Keyboard-friendly navigation
* Visible keyboard focus indicators

---

## 🛠️ Built With

* HTML5
* CSS3
* JavaScript (ES6+)
* WeatherAPI
* Fetch API
* Geolocation API
* Google Fonts (Poppins)

---

## 📂 Project Structure

```text
Weather-App/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/weather-app.git
```

### 2. Open the project

Open the project folder in your preferred code editor.

### 3. Get a WeatherAPI key

Create a free API key from:

https://www.weatherapi.com/

### 4. Add your API key

Open **script.js** and replace:

```javascript
const apiKey = "yourAPI";
```

with your own API key.

### 5. Run the application

Simply open **index.html** in your browser.

---

## 📸 Screenshots

Add screenshots of your application here.

Example:

```
screenshots/
├── home.png
├── current-weather.png
└── forecast.png
```

---

## 💡 Future Improvements

* More language options
* Dark mode
* Hourly weather forecast
* Recent search history
* Weather charts
* Additional weather details such as UV Index, Visibility, and Air Quality

---

## 👩‍💻 Author

**Shalini Kumari Singh**

If you like this project, consider giving it a ⭐ on GitHub!

---

## 📄 License

This project is created for learning and educational purposes.

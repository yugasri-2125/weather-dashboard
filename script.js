async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();
    const error = document.getElementById("error");

    error.textContent = "";

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    try {

        // Convert city name into latitude and longitude
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!locationResponse.ok) {
            throw new Error("Location request failed");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;

        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;

        // Display city
        document.getElementById("city").textContent =
            `${location.name}, ${location.country}`;

        // Display temperature
        document.getElementById("temperature").textContent =
            `${current.temperature_2m} °C`;

        // Display humidity
        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m} %`;

        // Display wind speed
        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        // Display weather condition
        const condition = getWeatherCondition(current.weather_code);

        document.getElementById("condition").textContent =
            condition.text;

        document.getElementById("icon").textContent =
            condition.icon;

    } catch (err) {

        error.textContent =
            "Unable to fetch weather data. Please check the city name and try again.";

        console.error(err);
    }
}


// Convert weather code into readable condition
function getWeatherCondition(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            text: "Cloudy",
            icon: "☁️"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            text: "Drizzle",
            icon: "🌦️"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            text: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown",
        icon: "🌤️"
    };
}

const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const card = document.querySelector(".card");
const apiKey = "d666fc91cc628c904be6496127c648f8"; // Replace with your OpenWeatherMap API key

// Event listener for form submission
weatherForm.addEventListener("submit", async event => {
    event.preventDefault();
    const city = cityInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError("City not found. Please try again.");
        }
    } else {
        displayError("Please enter a city.");
    }
});

// Fetch weather data from OpenWeatherMap API
async function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error("Could not fetch weather data");
    }
    return await response.json();
}

// Display weather information on the card
function displayWeatherInfo(data) {
    const { name: city, 
            main: { temp, humidity }, 
            weather: [{ description, id }] } = data;

    card.textContent = "";
    card.style.display = "flex";

    // Create elements for weather information
    const cityDisplay = document.createElement("h1");
    const tempDisplay = document.createElement("p");
    const humidityDisplay = document.createElement("p");
    const descDisplay = document.createElement("p");
    const weatherEmoji = document.createElement("p");

    // Set content for the elements
    cityDisplay.textContent = city;

    // Convert Kelvin to Celsius and Fahrenheit
    const celsius = (temp - 273.15).toFixed(1);
    const fahrenheit = ((temp - 273.15) * (9 / 5) + 32).toFixed(1);
    tempDisplay.textContent = `${celsius}°C / ${fahrenheit}°F`;

    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    descDisplay.textContent = description;
    weatherEmoji.textContent = getWeatherEmoji(id);

    // Add classes for styling
    cityDisplay.classList.add("cityDisplay");
    tempDisplay.classList.add("tempDisplay");
    humidityDisplay.classList.add("humidityDisplay");
    descDisplay.classList.add("descDisplay");
    weatherEmoji.classList.add("weatherEmoji");

    // Append elements to the card
    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(humidityDisplay);
    card.appendChild(descDisplay);
    card.appendChild(weatherEmoji);
}

// Get weather emoji based on weather ID
function getWeatherEmoji(weatherId) {
    switch (true) {
        case (weatherId >= 200 && weatherId < 300):
            return "⛈"; // Thunderstorm
        case (weatherId >= 300 && weatherId < 400):
            return "🌧"; // Drizzle
        case (weatherId >= 500 && weatherId < 600):
            return "🌧"; // Rain
        case (weatherId >= 600 && weatherId < 700):
            return "❄"; // Snow
        case (weatherId >= 700 && weatherId < 800):
            return "🌫"; // Atmosphere (e.g., fog, haze)
        case (weatherId === 800):
            return "☀"; // Clear sky
        case (weatherId >= 801 && weatherId < 810):
            return "☁"; // Clouds
        default:
            return "❓"; // Unknown
    }
}

// Display error message
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");

    card.textContent = "";
    card.style.display = "flex";
    card.appendChild(errorDisplay);
}


const apiKey = "1635890035cbba097fd5c26c8ea672a1"; // OpenWeatherMap API key

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const temp = document.querySelector('.temp');
const weatherCondition = document.querySelector('.weather-condition');
const humidityValue = document.querySelector('.humidity-value');
const windValue = document.querySelector('.wind-value');

async function getWeather(city) {
    try {
        if (!apiKey) {
            alert('Please add your OpenWeatherMap API key in script.js file');
            return;
        }

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
        
        if (response.status === 404) {
            alert('City not found. Please enter a valid city name.');
            return;
        }
        
        if (!response.ok) {
            throw new Error('Weather data not available. Please try again later.');
        }
        
        const data = await response.json();
        
        // Update UI with weather data
        cityName.textContent = data.name;
        temp.textContent = `${Math.round(data.main.temp)}°C`;
        weatherCondition.textContent = data.weather[0].description.charAt(0).toUpperCase() + 
                                     data.weather[0].description.slice(1);
        humidityValue.textContent = `${data.main.humidity}%`;
        windValue.textContent = `${data.wind.speed} km/h`;
        
    } catch (error) {
        alert(error.message);
    }
}

// Event listeners
searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() !== '') {
        getWeather(cityInput.value);
    }
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && cityInput.value.trim() !== '') {
        getWeather(cityInput.value);
    }
});

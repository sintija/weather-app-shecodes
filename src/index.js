//Add Read ME file 
// fix background issues on the firefox 
// Update the styling of the open source by Sintija
// Explore the animations on the search button 
// Find the responsive image to add the schreenshots 

(function () {

    //global selectors
    let mainImageUrl;
    let unit = 'metric';
    let celsiusTemp = null;
    let apiKey = "a4f791ec3190105377dcfdf1cf72f27d";
    let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";

    //get elements from HTML
    let temperatureElement = document.querySelector("#current-temperature");
    let cityElement = document.querySelector("#current-city");
    let descriptionElement = document.querySelector("#weather-description");
    let humidity = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind-speed");
    let dateElement = document.querySelector("#current-time");
    let cityInput = document.querySelector("#search-input");
    let iconElement = document.querySelector("#primary-icon");
    let mainImage = document.querySelector("#main-illustration");
    let fahrenheitLink = document.querySelector("#degreesFahr");
    let celsiusLink = document.querySelector("#degreesCelsius");
    let form = document.querySelector("#search-form");
    let tempElement = document.querySelector("#current-temperature");
    let cityName = document.querySelector(".city-not-found");
    let currentLocationIcon = document.querySelector("#current-location-addon");



    //get Last updated date
    function formatDate(timestamp) {
        let date = new Date(timestamp);
        let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturtday"];
        let day = days[date.getDay()];
        return `Last updated <br/> ${day} ${formatHours(timestamp)}`;
    }

    //format hours
    function formatHours(timestamp) {
        let date = new Date(timestamp);
        let hours = date.getHours();
        if (hours < 10) {
            hours = `0${hours}`;
        }
        let minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        return `${hours}:${minutes}`;
    }

    //display temperature
    function showTemperature(response) {
        //get API data
        celsiusTemp = response.data.main.temp;
        temperatureElement.innerHTML = Math.round(celsiusTemp);
        cityElement.innerHTML = response.data.name;
        descriptionElement.innerHTML = response.data.weather[0].description;
        humidity.innerHTML = `${response.data.main.humidity} %`;
        windElement.innerHTML = Math.round(response.data.wind.speed) + " km/h";
        dateElement.innerHTML = formatDate(response.data.dt * 1000);
    }

    //get the weather from user location

    function getWeatherDataFromCoords(position) {

        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        let apiUrl = `${apiEndPoint}lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;

        axios.get(apiUrl).then(showTemperature);
    }

    //get current location 
    function setTempToCurrentLocation() {
        navigator.geolocation.getCurrentPosition(getWeatherDataFromCoords);
    }

    // get related weather image and icon
    function getweatherImage(response) {
        let temp = response.data.main.temp;
        let iconCode = response.data.weather[0].icon;
        let iconURL = "./images/icons/" + iconCode + ".png";
        iconElement.setAttribute("src", iconURL);
        iconElement.setAttribute("alt", response.data.weather[0].description);
        let changeImage = () => mainImage.setAttribute("src", mainImageUrl);
        let cloudyIcons = ["02d", "02n", "03d", "03n", "04d", "04n"];
        let rainyIcons = ["09d", "09n", "10d", "10n"];
        let thunderIcons = ["11d", "11n"];
        let snowIcons = ["13d", "13n"];
        let mistIcons = ["50d", "50n"];

        //change illustration based on weather
        switch (iconCode) {
            case "01d":
                if (temp < -1) {
                    mainImageUrl = "./images/illustrations/cold.png";
                } else {
                    mainImageUrl = "./images/illustrations/sunny.png";
                }
                changeImage();
                break;
            case "01n":
                if (temp < -1) {
                    mainImageUrl = "./images/illustrations/cold.png";
                } else {
                    mainImageUrl = "./images/illustrations/night.png";
                }
                changeImage();
                break;
            case cloudyIcons[0]:
            case cloudyIcons[1]:
            case cloudyIcons[2]:
            case cloudyIcons[3]:
            case cloudyIcons[4]:
            case cloudyIcons[5]:
                if (temp < -1) {
                    mainImageUrl = "./images/illustrations/cold.png";
                } else {
                    mainImageUrl = "./images/illustrations/cloudy.png";
                }
                changeImage();
                break;
            case rainyIcons[0]:
            case rainyIcons[1]:
            case rainyIcons[2]:
            case rainyIcons[3]:
                mainImageUrl = "./images/illustrations/rain.png";
                changeImage();
                break;
            case thunderIcons[0]:
            case thunderIcons[1]:
                mainImageUrl = "./images/illustrations/thunder.png";
                changeImage();
                break;
            case snowIcons[0]:
            case snowIcons[1]:
                mainImageUrl = "./images/illustrations/snow.png";
                changeImage();
                break;
            case mistIcons[0]:
            case mistIcons[1]:
                if (temp < -1) {
                    mainImageUrl = "./images/illustrations/cold.png";
                } else {
                    mainImageUrl = "./images/illustrations/misty.png";
                }
                changeImage();
                break;
        }
    }

    //get city input value
    function handleSubmit(event) {
        event.preventDefault();
        search(cityInput.value);
    }


    //get additonal forecast data from API
    function displayForecast(response) {
        let forecast = null;
        let forecastElement = document.querySelector("#forecast");
        forecastElement.innerHTML = null
        for (let index = 0; index < 4; index++) {
            forecast = response.data.list[index];
            let maxTemp = `${Math.round(forecast.main.temp_max)}`;
            forecastElement.innerHTML += `
<div class="col-3">
    <span class="additional-time">${formatHours(forecast.dt * 1000)}</span>
    <img class="weather-icon" src="./images/icons/${forecast.weather[0].icon}.png" alt="sun">
    <span class="additonal-degree-info">max ${maxTemp}°</span>
</div>`;
        }
    }


    function search(city) {
        let apiUrl = `${apiEndPoint}q=${city}&appid=${apiKey}&units=${unit}`;
        axios.get(apiUrl).then((response) => {
                cityName.innerHTML = "";
                showTemperature(response);
                getweatherImage(response);
            })
            .catch(function (error) {
                if (error.response.status === 404) {
                    cityName.innerHTML = "Woops, we could not find this place, try another city";
                }
            });
        apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
        axios.get(apiUrl).then(displayForecast);

    }


    //convert  to farh units
    function showFahrTemp(event) {
        event.preventDefault();
        let fahrTemp = (celsiusTemp * 9) / 5 + 32;
        tempElement.innerHTML = Math.round(fahrTemp);
        //remove the active class celsius link
        celsiusLink.classList.remove("active");
        fahrenheitLink.classList.add("active");
    }

    //convert  to celsius units
    function showCelsiusTemp(event) {
        event.preventDefault();
        tempElement.innerHTML = Math.round(celsiusTemp);
        celsiusLink.classList.add("active");
        fahrenheitLink.classList.remove("active");
    }

    //Add event listener
    fahrenheitLink.addEventListener("click", showFahrTemp);
    celsiusLink.addEventListener("click", showCelsiusTemp);
    form.addEventListener("submit", handleSubmit);
    currentLocationIcon.addEventListener("click", setTempToCurrentLocation);
    search("London");

})();
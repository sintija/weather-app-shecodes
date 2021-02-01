//What needs to be don 
//Add currect location
//Add loading bar optional 
//add error message oops try again 
//Fix displaying broken image


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

function showTemperature(response) {
    //get HTML elements
    let temperatureElement = document.querySelector("#current-temperature");
    let cityElement = document.querySelector("#current-city");
    let descriptionElement = document.querySelector("#weather-description");
    let humidity = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind-speed");
    let dateElement = document.querySelector("#current-time");

    //get API data
    celsiusTemp = response.data.main.temp;
    temperatureElement.innerHTML = Math.round(celsiusTemp);
    cityElement.innerHTML = response.data.name;

    descriptionElement.innerHTML = response.data.weather[0].description;
    humidity.innerHTML = `${response.data.main.humidity} %`;
    windElement.innerHTML = Math.round(response.data.wind.speed) + " km/h";
    dateElement.innerHTML = formatDate(response.data.dt * 1000);

}

// get related weather image and icon
function getweatherImage(response) {
    let iconElement = document.querySelector("#primary-icon");
    let mainImage = document.querySelector("#main-illustration");
    let iconCode = response.data.weather[0].icon;
    let iconURL = "./images/icons/" + iconCode + ".png";
    iconElement.setAttribute("src", iconURL);
    iconElement.setAttribute("alt", response.data.weather[0].description);
    //change illustration based on weather
    if (iconCode === "01d") {
        let mainImageUrl = "./images/illustrations/sunny.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "01n") {
        mainImageUrl = "./images/illustrations/night.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "02d" || iconCode === "02n" || iconCode === "03d" || iconCode === "03n" || iconCode === "04d" || iconCode === "04n") {
        mainImageUrl = "./images/illustrations/cloudy.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "09d" || iconCode === "09n" || iconCode === "10d" || iconCode === "10n") {
        mainImageUrl = "./images/illustrations/rain.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "11d" || iconCode === "11n") {
        mainImageUrl = "./images/illustrations/thunder.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "13d" || iconCode === "13n") {
        mainImageUrl = "./images/illustrations/snow.png"
        mainImage.setAttribute("src", mainImageUrl);
    } else if (iconCode === "50d" || iconCode === "50n") {
        mainImageUrl = "./images/illustrations/misty.png"
        mainImage.setAttribute("src", mainImageUrl);
    }
}

//get city input value
function handleSubmit(event) {
    event.preventDefault();
    let cityInput = document.querySelector("#search-input");

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
    let apiKey = "a4f791ec3190105377dcfdf1cf72f27d";
    let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
    let unit = 'metric';
    let apiUrl = `${apiEndPoint}q=${city}&appid=${apiKey}&units=${unit}`;


    axios.get(apiUrl).then((response) => {
        console.log(response);

        let cityName = document.querySelector(".city-not-found");

        if (response.status !== 200) {
            cityName.innerHTML = "Woops, we could not find this place, try another city";
        } else {
            cityName.innerHTML = "";
            showTemperature(response);
            getweatherImage(response);
        }



    });

    // axios.get(apiUrl).then(showTemperature);
    // axios.get(apiUrl).then(getweatherImage);
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(displayForecast);
}

//convert  to farh units
function showFahrTemp(event) {
    event.preventDefault();
    let fahrTemp = (celsiusTemp * 9) / 5 + 32;
    let tempElement = document.querySelector("#current-temperature");
    tempElement.innerHTML = Math.round(fahrTemp);
    //remove the active class celsius link
    celsiusLink.classList.remove("active");
    fahrenheitLink.classList.add("active");
}

//convert  to celsius units
function showCelsiusTemp(event) {
    event.preventDefault();
    let tempElement = document.querySelector("#current-temperature");
    tempElement.innerHTML = Math.round(celsiusTemp);
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
}

let celsiusTemp = null;
let fahrenheitLink = document.querySelector("#degreesFahr");
fahrenheitLink.addEventListener("click", showFahrTemp);
let celsiusLink = document.querySelector("#degreesCelsius");
celsiusLink.addEventListener("click", showCelsiusTemp);
let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);
search("London");
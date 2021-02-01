//What needs to be don 
//Add currect location
//add error message oops try again 


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

    let temp = response.data.main.temp;
    let iconElement = document.querySelector("#primary-icon");
    let mainImage = document.querySelector("#main-illustration");
    let iconCode = response.data.weather[0].icon;
    let iconURL = "./images/icons/" + iconCode + ".png";
    iconElement.setAttribute("src", iconURL);
    iconElement.setAttribute("alt", response.data.weather[0].description);
    let mainImageUrl;
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
            cityName.innerHTML = "";
            showTemperature(response);
            getweatherImage(response);

        })

        .catch(function (error) {
            if (error.response.status === 404) {
                let cityName = document.querySelector(".city-not-found");
                cityName.innerHTML = "Woops, we could not find this place, try another city";
            }
            // handle error
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
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
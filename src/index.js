function showTemperature(response) {
    let temperatureElement = document.querySelector("#current-temperature");
    let cityElement = document.querySelector("#current-city");
    let descriptionElement = document.querySelector("#weather-description");
    let humidity = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind-speed");
    let iconElement = document.querySelector("#primary-icon");

    let mainImage = document.querySelector("#main-illustration");


    let currentTimeMessage = document.querySelector("#current-time");
    temperatureElement.innerHTML = Math.round(response.data.main.temp);
    cityElement.innerHTML = response.data.name;
    descriptionElement.innerHTML = response.data.weather[0].description;
    humidity.innerHTML = `${response.data.main.humidity} %`;
    windElement.innerHTML = Math.round(response.data.wind.speed) + " km/h";

    let iconCode = response.data.weather[0].icon;
    let iconURL = "./images/icons/" + iconCode + ".png";
    iconElement.setAttribute("src", iconURL);
    iconElement.setAttribute("alt", response.data.weather[0].description);

    let description = response.data.weather[0].description




    if (description === "clear sky") {

        let mainImageUrl = "./images/illustrations/sunny.png"
        mainImage.setAttribute("src", mainImageUrl);

    }







    // let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";


    // iconElement.setAttribute("src", `http://openweathermap.org/img/wn/${}@2x.png`);








    currentTimeMessage.innerHTML = "yahooo";

    console.log(response.data);
}








let apiKey = "a4f791ec3190105377dcfdf1cf72f27d";
let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
let defaultLocation = "London";
let unit = 'metric';
let apiUrl = `${apiEndPoint}q=${defaultLocation}&appid=${apiKey}&units=metric`;


axios.get(apiUrl).then(showTemperature);
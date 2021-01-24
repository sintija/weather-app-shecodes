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


    //Change illustration based on weather needs changing

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
    currentTimeMessage.innerHTML = "yahooo";

    console.log(response.data);
}


function handleSubmit(event) {
    event.preventDefault();

    let cityInput = document.querySelector("#search-input");
    search(cityInput.value);
}


function search(city) {

    let apiKey = "a4f791ec3190105377dcfdf1cf72f27d";
    let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
    let unit = 'metric';
    let apiUrl = `${apiEndPoint}q=${city}&appid=${apiKey}&units=${unit}`;
    axios.get(apiUrl).then(showTemperature);

}











let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("London");
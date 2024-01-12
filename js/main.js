function showCards(cards) {
  $(".owl-carousel").owlCarousel({
    items: cards,
    loop: true,
    margin: 0,
    mouseDrag: true,
    onInitialized: function (event) {
      console.log(event.target);
      $(event.target)
        .find(".weather-card")
        .each(function (index) {
          if (index % 2 === 0) {
            $(this).addClass("even-card");
            $(".even-card .day-date").addClass("day-date-even");
          } else {
            $(this).addClass("odd-card");
            $(".odd-card .day-date").addClass("day-date-odd");
          }
        });
    },
  });
}

function checkResponsive() {
  const windowWidth = window.innerWidth;
  if (windowWidth <= 576) return $(document).ready(showCards(1.25));
  if (windowWidth < 768) return $(document).ready(showCards(2.25));
  if (windowWidth >= 768) return $(document).ready(showCards(3.25));
}

// ________________

function updateWeatherCards(weatherData) {
  weatherCards.innerHTML = codeOFhtml(weatherData);
  $(".owl-carousel").trigger("destroy.owl.carousel");
  if (weatherCards.innerHTML.startsWith("undefined")) {
    weatherCards.innerHTML = weatherCards.innerHTML.slice("undefined".length);
  }

  checkResponsive();
}

const weatherCards = document.getElementById("weatherCards");

async function getWeatherData(q = "cairo") {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=015455016670491983f224044241001&q=${q}&days=7`
    );

    let weatherData = await response.json();

    updateWeatherCards(weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

getWeatherData();

// ________________

function getNext7Days() {
  const today = new Date();
  const next7Days = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    const dateArr = currentDate.toString().split(" ");
    next7Days.push(dateArr);
  }

  return next7Days;
}

const sevenDaysArray = getNext7Days();

// ________________

function codeOFhtml(weatherData) {
  let code;

  for (let i = 0; i < 7; i++) {
    code += `<div class="weather-card">
 <div class="day-date d-flex justify-content-between p-3">
   <p>${sevenDaysArray[i][0]}</p>
   <p>${sevenDaysArray[i][2] + sevenDaysArray[i][1]} </p>
 </div>
 <div class="weather-card-body p-3">
   <p id="city">${weatherData.location.name}</p>
   <div class="d-flex justify-content-between align-items-center">
     <p id="degree">${
       i == 0
         ? weatherData.current.temp_c
         : Math.round(weatherData.forecast.forecastday[i].day.avgtemp_c)
     }<sup>o</sup>C</p>
     <div>
       <img src="https:${
         i == 0
           ? weatherData.current.condition.icon
           : weatherData.forecast.forecastday[i].day.condition.icon
       }" alt="" />
       </div>
       </div>
       <p id="cloudText">${
         i == 0
           ? weatherData.current.condition.text
           : weatherData.forecast.forecastday[i].day.condition.text
       }</p>
   <footer class="d-flex justify-content-around">
     <p><i class="fa-solid fa-umbrella"></i> ${Math.round(
       weatherData.forecast.forecastday[i].day.maxwind_kph
     )}%</p>
     <p><i class="fa-solid fa-wind"></i> ${Math.round(
       weatherData.forecast.forecastday[i].day.maxwind_mph
     )} km/h</p>
   </footer>
 </div>
</div>`;
  }

  return code;
}

// ________________

const searchInput = document.getElementById("searchInput");

searchInput.onkeyup = function () {
  getWeatherData(searchInput.value);
};

let form = document.querySelector("form");
let findBtn = document.getElementById("findBtn");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (searchInput.value != "") {
    getWeatherData(searchInput.value);
  }
});

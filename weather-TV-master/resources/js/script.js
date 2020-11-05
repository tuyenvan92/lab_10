//run when the document object model is ready for javascript code to execute
$(document).ready(function () {
  let lat = 40.73061;
  let long = -73.935242;

  let query = "New York";
  let number_of_days = 5;

  getWeather();

  $("#checkWeather").click(function (e) {
    lat = $("#lat").val();
    long = $("#long").val();
    query = lat + "," + long;

    getWeather();
  });

  function getWeather() {
    var url =
      "https://api.weatherstack.com/forecast?access_key=5bc82451636190abd9d7afe6fe9b20b5&query=" +
      query +
      "&forecast_days=" +
      number_of_days;

    $.ajax({ type: "POST", url: url, dataType: "jsonp" }).then(function (data) {
      $("#heading").text("Today's Weather " + data.location.name);
      $("#image_today").attr("src", data.current.weather_icons[0]);
      $("#local_time").text(data.location.localtime);
      $("#precip_today").text(data.current.precip);
      $("#humidity_today").text(data.current.humidity);
      $("#wind_today").text(data.current.wind_speed);
      $("#summary_today").text(data.current.weather_descriptions);

      let farenheitTemp = getFarenheitTemp(data.current.temperature);
      let backgroundColor = "grey";
      if (farenheitTemp > 85) {
        backgroundColor = "red";
      } else if (farenheitTemp < 65) {
        backgroundColor = "blue";
      }

      $("#thermometer_inner").css({
        height: farenheitTemp + "%",
        "background-color": backgroundColor,
      });

      $("#temp_today").text(farenheitTemp + " F");

      for (let index = 0; index < number_of_days; index++) {
        let element = getKey(index);
        $(` <div style="width: 20%;">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title"> ${element.dayOfWeek}</h5>
                <p class="card-text">Date: ${element.date}</p> 
                <p class="card-text">High: ${element.maxtemp}</p> 
                <p class="card-text">Low: ${element.mintemp}</p> 
                <p class="card-text">Sunrise: ${element.astro.sunrise}</p> 
                <p class="card-text">Sunset: ${element.astro.sunset}</p> 
              </div>
            </div>
          </div>`).appendTo("#5_day_forecast");
      }

      function getKey(i) {
        var week_names = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ];

        dayOfWeek =
          week_names[new Date(Object.keys(data.forecast)[i]).getDay()];
        const newData = {
          dayOfWeek,
          ...data.forecast[Object.keys(data.forecast)[i]],
        };
        return newData;
      }
    });
  }
});

//helper functions
var dayOfWeek = "";
function formatDate(date, month, year) {
  month = month.length < 2 ? "0" + month : month;
  date = date.length < 2 ? "0" + date : date;
  return [year, month, date].join("-");
}

function getDayofWeek(date, month, year) {
  var week_names = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  dayOfWeek = week_names[new Date([month, date, year].join("-")).getDay()];
}
function getFarenheitTemp(temp) {
  return (9 * temp) / 5 + 32;
}

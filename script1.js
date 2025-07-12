const apiKey = '00d4ba52e18569a8185ff7855e9a1fd3'; 
let intervalId; 
function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const result = document.getElementById('weatherResult');
  const error = document.getElementById('error');
  const loader = document.getElementById('loader');

  result.innerHTML = '';
  error.textContent = '';
  loader.style.display = 'block';

  if (!city) {
    loader.style.display = 'none';
    error.textContent = "Please enter a city name.";
    return;
  }

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    .then(res => res.json())
    .then(data => {
      loader.style.display = 'none';

      if (data.cod !== 200) {
        error.textContent = data.message;
        result.innerHTML='';
        clearInterval(intervalId);
        return;
      }

      const weather = data.weather[0].main.toLowerCase();
      const cardClass = `weather-card ${weather}`;
      const timezoneOffset = data.timezone;

      const html = `
        <div class="${cardClass}">
          <h3>${data.name}, ${data.sys.country}</h3>
          <p id="localTime"></p>
          <p><strong>Temperature:</strong> ${data.main.temp} °C</p>
          <p><strong>Weather:</strong> ${data.weather[0].main}</p>
          <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
          <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
        </div>
      `;

      result.innerHTML = html;

      function updateTime() {
        const nowUTC = new Date(new Date().getTime() + new Date().getTimezoneOffset() * 60000);
        const cityTime = new Date(nowUTC.getTime() + timezoneOffset * 1000);

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];

        const dayName = days[cityTime.getDay()];
        const monthName = months[cityTime.getMonth()];
        const dateNum = cityTime.getDate();
        const year = cityTime.getFullYear();

        const hours = cityTime.getHours();
        const minutes = cityTime.getMinutes().toString().padStart(2, '0');
        const seconds = cityTime.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = (hours % 12) || 12;

        const timeString = `${displayHour}:${minutes}:${seconds} ${ampm}`;
        const dateString = `${dayName}, ${monthName} ${dateNum}, ${year}`;

        document.getElementById("localTime").innerHTML =
          `<strong>Local Time:</strong> ${timeString}<br><strong>Date:</strong> ${dateString}`;
      }

      updateTime();                      
      clearInterval(intervalId);         
      intervalId = setInterval(updateTime, 1000); 
    })
    .catch(() => {
      loader.style.display = 'none';
      error.textContent = "Network error. Try again later.";
    });
}

const apiKey = "5a87669d5ec4583c5aec185a1a8d7b35";

function weathercheck() {
    const place = document.getElementById('searchinp').value.trim();

    if (!place) {
        alert('Please enter a valid city or country name.');
        return;
    }

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = '';

            const now = new Date();
            const today = now.toISOString().split('T')[0];
            const todayForecast = data.list.filter(forecast => {
                const forecastDate = new Date(forecast.dt * 1000);
                const forecastDay = forecastDate.toISOString().split('T')[0];
                return forecastDay === today && forecastDate.getHours() >= now.getHours();
            });

            if (todayForecast.length > 0) {
                const currentTemp = todayForecast[0].main.temp;
                setBackground(currentTemp);

                todayForecast.forEach(entry => {
                    const forecastTime = new Date(entry.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                    const temp = entry.main.temp.toFixed(1);
                    const icon = entry.weather[0].icon;
                    const description = entry.weather[0].description;
                    const forecastHTML = `
                        <div class="day">
                            <p>Today at ${forecastTime}</p>
                            <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
                            <p><strong>${temp}°C</strong></p>
                            <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                        </div>
                    `;
                    forecastDiv.innerHTML += forecastHTML;
                });
            }

            const forecastDays = data.list.filter(forecast => forecast.dt_txt.includes("12:00:00")).slice(1, 5);
            forecastDays.forEach(day => {
                const forecastDate = new Date(day.dt * 1000);
                const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'long' });
                const temp = day.main.temp.toFixed(1);
                const icon = day.weather[0].icon;
                const description = day.weather[0].description;
                const forecastHTML = `
                    <div class="day">
                        <p>${dayName}</p>
                        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="icon">
                        <p><strong>${temp}°C</strong></p>
                        <p>${description.charAt(0).toUpperCase() + description.slice(1)}</p>
                    </div>
                `;
                forecastDiv.innerHTML += forecastHTML;
            });

            forecastDiv.style.display = 'flex';
        })
        .catch(err => {
            console.error('Error fetching weather data:', err);
            alert('Error fetching data: ' + err.message);
        });
}

function setBackground(temp) {
    const body = document.body;
    if (temp >= 30) {
        body.style.backgroundImage = "url('https://media.gettyimages.com/id/523848604/video/sun-and-blue-sky.jpg?s=640x640&k=20&c=oYgozeGpT9jItfM4A7saAZzC44ulevj-zoGmz0HVgy4=')";
    } else if (temp >= 15 && temp < 30) {
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1670258421086-338921eda8a2?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3')";
    } else {
        body.style.backgroundImage = "url('https://d1whtlypfis84e.cloudfront.net/guides/wp-content/uploads/2019/07/25131640/winter.jpg')";
    }

    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
}

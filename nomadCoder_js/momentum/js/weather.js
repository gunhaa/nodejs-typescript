    const API_KEY = "6a9be1e8b2508f7f5f890c76c214f424";
    
    
    function onGeoOk(position){
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const weather = document.querySelector("#weather span:first-child");
            const city = document.querySelector("#weather span:last-child")
            city.innerText = data.name;
            weather.innerText = `${data.weather[0].main} / ${data.main.temp}`;
        });
    }

    function onGeoError(){
        alert("Can't find you. No weather for you.")
    }

    navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);

    // key : 6a9be1e8b2508f7f5f890c76c214f424

    // call : https://api.openweathermap.org/data/2.5/weather?lat=37.535744&lon=127.0710272&appid=APP_KEY




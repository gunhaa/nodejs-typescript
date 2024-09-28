const API_KEY = "6a9be1e8b2508f7f5f890c76c214f424";
    
    
function onGeoOk(position){
    console.log(position);
}

function onGeoError(){
    alert("Can't find you. No weather for you.")
}

navigator.geolocation.getCurrentPosition(onGeoOk,onGeoError);



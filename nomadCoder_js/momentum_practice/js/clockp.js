
const clock = document.querySelector("#clock");


function time (){
    const nowDate = new Date();
    const hour = nowDate.getHours();
    const min = nowDate.getMinutes();
    const sec = nowDate.getSeconds();
    clock.innerText = `${hour}:${min}:${sec}`;
};


setInterval(time, 1000);
// date정의 위치에 대해서..
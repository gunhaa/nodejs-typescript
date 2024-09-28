
const bgImage = document.querySelector("#background");


const randomBackGround = [
     "0.jpg",
     "1.jpg",
     "2.jpg"
]

const todayBackground = Math.floor(Math.random()*randomBackGround.length);

function backGround(){
    const curImage = new Image();
    curImage.src=`img/${randomBackGround[todayBackground]}`;
    console.log(curImage);
    curImage.classList.add("background");
    document.body.appendChild(curImage);

}

backGround();
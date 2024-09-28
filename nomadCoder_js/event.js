/*
const title = document.querySelector(".hello h1")

//title.style.color = "blue";

function handleTitleClick(){
    title.style.color = "blue";
}

title.addEventListener("click", handleTitleClick);


function handleWindowResize(){
    document.body.style.backgroundColor = "tomato";
}

function handleWindowCopy(){
    alert("copier!!");
}

function handleWindowOffline(){
    alert("no wifi!!");
}

function handleWindowOnline(){
    alert("all gooddd");
}

window.addEventListener("resize", handleWindowResize);

window.addEventListener("copy", handleWindowCopy)

window.addEventListener("offline", handleWindowOffline);

window.addEventListener("online", handleWindowOnline);


*/


const h1 = document.querySelector("div.hello:first-child h1");
/*
function handleTitleClick(){
    const currentColor = h1.style.color;
    let newColor;
    if(currentColor === "blue"){
        newColor = "tomato";
    } else {
        newColor = "blue";
    }
    h1.style.color = newColor;
}
*/

function handleTitleClick(){
    if(h1.className==="active"){
        h1.className = "";
    } else {
        h1.className = "active";
    }
}
h1.addEventListener("click", handleTitleClick);


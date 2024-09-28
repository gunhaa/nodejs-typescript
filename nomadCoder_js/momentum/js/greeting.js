const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

const HIDDEN_CLASSNAME = "hidden";
const USERNAME_KEY = "username";

function onLoginSubmit(event) {
    event.preventDefault();
    loginForm.classList.add(HIDDEN_CLASSNAME);
    const username = loginInput.value;
    // greeting.innerText="Hello " + username;
    localStorage.setItem(USERNAME_KEY,username);
    paintGreetings(username);
}

loginForm.addEventListener("submit", onLoginSubmit);

const savedUsername = localStorage.getItem(USERNAME_KEY);

if(savedUsername ===null){
// show the form
    loginForm.classList.remove(HIDDEN_CLASSNAME);
    loginForm.addEventListener("submit", onLoginSubmit);
} else {
// show the greeting
    paintGreetings(savedUsername);
}

function paintGreetings(username){
    greeting.innerText=`Hello ${username}` ;  
    greeting.classList.remove(HIDDEN_CLASSNAME);
}

function handleLinkClick(event) {
    event.preventDefault();
    console.dir(event);
}
const link = document.querySelector("a");

link.addEventListener("click", handleLinkClick);

// 메타버스 개발자 경진대회 확인하기
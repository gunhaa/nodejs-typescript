
const login_form = document.querySelector("#greeting");
const login_input = document.querySelector("#greeting input");
const introduce = document.querySelector("#introduce");

login_form.addEventListener("submit", login_member);

function login_member(event){
    event.preventDefault();
    const username=login_input.value;
    introduce.classList.remove("hidden");
    introduce.innerText=`Hello !! ${username}`;
    login_form.classList.add("hidden");
    localStorage.setItem("username", username);
}

if(localStorage.getItem("username")!==null) {

    login_form.classList.add("hidden");
    introduce.classList.remove("hidden");
    const username = localStorage.getItem("username");
    introduce.innerText=`Hello !! ${username}`;

} 
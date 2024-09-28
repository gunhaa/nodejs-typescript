
const input = document.querySelector("#input");
const submit = document.querySelector("#submit");
const authorP = document.querySelector("#author");
const textP = document.querySelector("#text");
let inform = "";
let quote = "";
let author = "";

submit.addEventListener("click", search);

function search(event){
    event.preventDefault();
    inform = input.value;
    input.value="";
    firstAPI();
    console.log(author);
}



function firstAPI(){
    fetch("https://quote-garden.onrender.com/api/v3/quotes")
    .then((response) => response.json())
    .then((data) => {
        author=data.data[0].quoteAuthor;
        quote=data.data[0].quoteText;
        authorP.innerText = author;
        textP.innerText = quote;
    })
}


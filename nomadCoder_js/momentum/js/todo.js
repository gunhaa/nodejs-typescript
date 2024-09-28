const toDoForm = document.getElementById("todo-form");
const toDoInput = document.querySelector("#todo-form input");
const toDoList = document.getElementById("todo-list");

const TODOS_KEY = "todos";

let toDos = [];

function saveToDos(){
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos));
}


function deleteTodo(event){
    // 삭제하고싶은 li
    const li = event.target.parentElement;
    li.remove();
}

function paintToDo(newTodo){
    const li =document.createElement("li");
    const span = document.createElement("span");
    span.innerText = newTodo;
    const button = document.createElement("button");
    button.innerText="X";
    button.addEventListener("click", deleteTodo )
    li.appendChild(span);
    li.appendChild(button);
    toDoList.appendChild(li);
}

function handleToDoSubmit(event){
    event.preventDefault();
    const newTodo = toDoInput.value;
    toDoInput.value="";
    toDos.push(newTodo);
    paintToDo(newTodo);
    saveToDos();
}

toDoForm.addEventListener("submit", handleToDoSubmit);


function sayHello(){
    console.log("hello");
}

const savedTodDos = localStorage.getItem(TODOS_KEY);

console.log(savedTodDos);
if(savedTodDos !== null){
    const parsedToDos=JSON.parse(savedTodDos);
    toDos=parsedToDos;
    parsedToDos.forEach(paintToDo);
}

// (item) => console.log("this is the turn of ", item);

// function sayHello(item){
//     console.log("this is the turn of ", item);
// }
//  두 가지는 완전히 같다
const todoForm = document.querySelector("#todoForm");
const todoList = document.querySelector("#todoForm #todoInput");
const todoWrite = document.querySelector("#todoResult");

todoForm.addEventListener("submit" , add);

function add(event){
    event.preventDefault();
    const list = todoList.value;
    const li = document.createElement("li");
    li.innerText=list;
    todoWrite.appendChild(li);
    todoList.value="";
    
}


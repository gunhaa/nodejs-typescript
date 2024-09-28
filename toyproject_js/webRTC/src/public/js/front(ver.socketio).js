const socket = io();

const welcome = document.querySelector("#welcome");
const form = welcome.querySelector("#msg");
const room = document.querySelector("#room");

room.hidden = true;
let roomName;
document.querySelector("#welcome form").addEventListener("submit", handleRoomSubmit);

function addMessage(message){
    const li = document.createElement("li");
    li.innerText= message;
    const ul = room.querySelector("ul");
    ul.appendChild(li);
}


socket.on("welcome", (user)=>{

    addMessage(`${user} joined`);
});

socket.on("bye", (left)=>{

    addMessage(`${left} left bb`);
})

function handleRoomSubmit(e){
    e.preventDefault();
    const input = document.querySelector("#welcome input");
    socket.emit("enter_room" , input.value, showRoom);
    roomName=input.value;
    input.value = "";
}

function handleMessageSubmit(Event){
    Event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value , roomName, ()=>{
        addMessage(`You: ${value}`);
    });
    input.value="";
};

function handleNicknameSubmit(Event){
    Event.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value)
    input.value = "";
};

function showRoom(){
    room.hidden=false;
    welcome.hidden=true;
    room.querySelector("h3").innerText=`Room : ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}

socket.on("new_message", addMessage);
const express = require("express");

const app = express();

const http = require("http");

// const Websocket = require("ws");

const SocketIO = require("socket.io");
const { setTimeout } = require("timers/promises");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const httpServer = http.createServer(app);

const wsServer = SocketIO(httpServer);

wsServer.on("connection", socket => {

    socket["nickname"]= "Anon";

    socket.onAny((e) => {

        console.log(`Socket Event:${e}`);

    });

    socket.on("enter_room", (roomName, done)=>{
        socket.join(roomName);
        done();
        socket.to(roomName).emit("welcome" , socket.nickname);

    });

    socket.on("disconnecting", ()=>{

        socket.rooms.forEach((room)=> socket.to(room).emit("bye", socket.nickname));

    });

    socket.on("new_message", (msg, room, done)=>{
        socket.to(room).emit("new_message", `${socket.nickname} : ${msg}`);
        done();
    });

    socket.on("nickname", (nickname)=>{
        socket.nickname=nickname;
    });

});

// const wss = new Websocket.Server({ server });

// const sockets = [];


// wss.on("connection", (socket) => {
//     sockets.push(socket);
//     socket["nickname"] = "Anon";
//     console.log("Connected to Browser")
//     socket.on("close", () => { console.log("disconnected to Browser X") });
//     socket.on("message", msg => {
//         const message = JSON.parse(msg);
//         console.log(message);
//         switch (message.type){
//             case "new_message" : 
//             sockets.forEach(asocket => {
//                 asocket.send(`${socket.nickname} : ${message.payload}`);
//             });
//             break;
//             case "nickname" :
//                 socket["nickname"]=message.payload;
//         }

//     });
// });

httpServer.listen(3000, handleListen);
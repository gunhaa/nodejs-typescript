const express = require("express");

const app = express();

const http = require("http");

const Websocket = require("ws");



app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`)

const server = http.createServer(app);

const wss = new Websocket.Server({ server });


const sockets = [];


wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser")
    socket.on("close", () => { console.log("disconnected to Browser X") });
    socket.on("message", msg => {
        const message = JSON.parse(msg);
        console.log(message);
        switch (message.type){
            case "new_message" : 
            sockets.forEach(asocket => {
                asocket.send(`${socket.nickname} : ${message.payload}`);
            });
            break;
            case "nickname" :
                socket["nickname"]=message.payload;
        }

    });
});

server.listen(3000, handleListen);
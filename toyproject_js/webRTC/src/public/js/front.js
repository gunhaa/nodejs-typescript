const socket = io();

const myFace = document.getElementById("MyFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
let roomName;
let myPeerConnection;

// 변수가 이곳에서 선언되야 하는 이유는, 변수 값이 할당되는 곳이 peer A 와 peer B에서 다르기 때문이다.
let myDataChannel;


call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;


async function getCameras() {
    try {

        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput")
        const currentCamera = myStream.getVideoTracks()[0];

        cameras.forEach(camera => {

            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        });

    } catch (e) {
        console.log(e);
    }
}

async function getMedia(deviceId) {

    const initialConstrains = {
        audio: true,
        video: { faceingMode: "user" }
    }

    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId } }
    }

    try {
        // 사용자에게 권한을 요청한다.
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstrains
        )
        myFace.srcObject = myStream;

        if (!deviceId) {
            await getCameras();
        }

    } catch (e) {
        console.log(e);
    }

}


function handleMuteBtn() {
    myStream.getAudioTracks()[0].enabled = !(myStream.getAudioTracks()[0].enabled);
    if (!muted) {
        muteBtn.innerText = "UNMUTE";
        muted = true;
    } else {
        muteBtn.innerText = "MUTE"
        muted = false;
    }
}

function handleCameraBtn() {
    myStream.getVideoTracks()[0].enabled = !(myStream.getVideoTracks()[0].enabled);
    if (cameraOff) {
        cameraBtn.innerText = "CAMERAOFF"
        cameraOff = false;
    } else {
        cameraBtn.innerText = "CAMERAON"
        cameraOff = true;
    }
}

async function handleCameraChange() {
    await getMedia(camerasSelect.value);
    if (myPeerConnection) {
        const videoTrack = myStream.getVideoTracks()[0];
        // 장치 바꾸기 후 바뀐 Stream 재전송 메소드
        const videoSender = myPeerConnection.getSenders().find(sender => { return sender.track.kind === "video" });
        videoSender.replaceTrack(videoTrack);
    }
}

async function handleWelcomeSubmit(event) {
    event.preventDefault();
    const input = welcomeForm.querySelector("input");
    await initCall();
    socket.emit("join_room", input.value);
    roomName = input.value;
    input.value = "";
}

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

//getMedia();

muteBtn.addEventListener("click", handleMuteBtn);
cameraBtn.addEventListener("click", handleCameraBtn);
camerasSelect.addEventListener("input", handleCameraChange);

welcomeForm = welcome.querySelector("form");

welcomeForm.addEventListener("submit", handleWelcomeSubmit);


// Socket Code
// socket connect 이벤트
// 누군가가 들어온다면, 본인이 실행되는 코드(PEER A)
socket.on("welcome", async () => {
    // DATA CHANNEL은 OFFER 단계에서 만들어져야한다.
    myDataChannel = myPeerConnection.createDataChannel("chat");
    myDataChannel.addEventListener("message", event => { console.log(event.data); console.log(event); });
    console.log("data channel 만들었음");

    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    socket.emit("offer", offer, roomName);
    console.log("SENT OFFER");
    //console.log(offer);
})


// 상대방에서 실행되는 코드(PEER B) // 양쪽 모두에서 실행되는 코드같음
socket.on("offer", async (offer) => {
    myPeerConnection.addEventListener("datachannel", event => {
        myDataChannel = event.channel;
        myDataChannel.addEventListener("message", event => { console.log(event.data) });
    });
    // 전송 방법은 console에 myDataChannel.send("msg");

    //console.log("received the offer");
    //console.log(offer);
    myPeerConnection.setRemoteDescription(offer);
    // 서로의 설정을 맞추기위해, 기존 로컬 설정을 바꾼다
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
    console.log("sent answer");
})

// 본인과 상대방에서 모두 실행되는 코드 
socket.on("answer", answer => {
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
});
// 본인과 상대방 양쪽에서 실행되어야한다.
socket.on("ice", ice => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
})

// RTC CODE
// 실제로 연결을 만든다.
function makeConnection() {

    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ]
            }
        ]
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    //console.log(myStream.getTracks());
    // 내가 가지고 있는 트랙들을 배열로 반환
    myStream
        .getTracks()
        .forEach(track => myPeerConnection.addTrack(track, myStream));
}


// 두 브라우저가 candidate를 서로 주고받을 수 있게한다.
function handleIce(event) {

    console.log("sent candidate");
    //ice는 STUN 서버를 통한 내 네트워크 경로를 
    socket.emit("ice", event.candidate, roomName);
    //console.log("got ice candidate");
    //console.log(data);

}

function handleAddStream(event) {

    const peerFace = document.querySelector("#peerFace");

    //console.log(` my friend stream` , data.stream);
    //console.log(` my stream : ` , myStream )
    peerFace.srcObject = event.stream;
}

function check(){
    if (myPeerConnection.remoteDescription) {
        console.log("Remote description is set:", myPeerConnection.remoteDescription);
    } else {
        console.log("Remote description is not set.");
    }
}
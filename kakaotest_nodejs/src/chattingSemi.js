
const chatIcon = document.querySelector("#chatBtn");
const chatClose = document.querySelector("#chat-close");
const chatBox = document.querySelector("#chat-box");
const chatToBtn = document.querySelector("#chatToBtn");
const chatSendBox = document.querySelector("#sendChat");
const chatArea = document.querySelector("#chatContent");
let websocket;
let hasChattingId = false;

let toId;

// 페이지 로딩 완료시 웹소켓 연결
document.addEventListener("DOMContentLoaded", () => {
    openWebSocket();
});


chatIcon.addEventListener("click", () => {
    chatIcon.hidden = true;
    chatBox.hidden = false;
});

chatClose.addEventListener("click", () => {
    chatIcon.hidden = false;
    chatBox.hidden = true;
});

// 유저 선택후 채팅 보내기 이벤트 리스너
chatToBtn.addEventListener("click", () => {

    startChatting();

});

// 전송 버튼 이벤트 리스너
chatSendBox.addEventListener("click", () => {

    chatSend(toId);

});

// 페이지 로드시 웹소켓 열기
function openWebSocket() {

    if (memberNo) {
        if (!websocket || websocket.readyState === WebSocket.CLOSED) {
            websocket = new WebSocket(`ws://localhost:8080/${contextPath}/chat/end?clientId=${memberNo}`);
        }
        websocket.onopen = function () {
            console.log("연결됨");
        };
        websocket.onmessage = function (event) {
            console.log('웹소켓으로 부터 받은 메시지:', event.data);
            //받은 사람 화면 만들기
            let result = JSON.parse(event.data);

            document.querySelector("#chat-message").insertAdjacentHTML("beforeend",
                '<div id="chat-frombox"><div id="chat-from">' + result.message + '</div></div>')

        };
    }



}


function startChatting() {

    let result;
    // value값의 닉네임이 유효한지 검사
    toId = document.querySelector("#chatTo").value;
    if (toId == memberNickname) {
        "자기 자신에게는 메시지를 보낼 수 없습니다.";
    } else {

        $.ajax({
            url: contextPath + "/chat",
            type: "GET",
            data: {
                "toId": toId
            },
            success(res) {
                const result = JSON.parse(res);
                if (result == 0) {

                    alert("유효한 아이디를 입력해주세요.");

                } else {

                    if (memberNo) {

                        $.ajax({
                            url: contextPath + "/chat",
                            type: "POST",
                            data: {
                                "toId": toId
                            },
                            success(res) {
                                const result = JSON.parse(res);
                                document.querySelector("#chat-message").innerHTML = "";
                                result.reverse().forEach((chat) => {
                                    if (chat.fromName == memberNickname) {
                                        document.querySelector("#chat-message").insertAdjacentHTML("afterbegin",
                                            '<div id="chat-tobox"><div id="chat-to">' + chat.message + '</div></div>'
                                        );
                                    } else {
                                        document.querySelector("#chat-message").insertAdjacentHTML("afterbegin",
                                            '<div id="chat-frombox"><div id="chat-from">' + chat.message + '</div></div>'
                                        );
                                    }
                                });

                                hasChattingId = true;
                            },
                            error() {
                            }
                        })
                        document.querySelector("#chatToBtn").insertAdjacentHTML("afterend", "<div id='myPartner'>현재 대화중인 상대 : " + toId + "</div>")
                        document.querySelector("#chatTo").value = "";

                    } else {
                        alert("로그인을 하고 이용해주세요.");
                    }
                }
            },
            error(res) {
                console.log("닉네임 유효성 검사 에러");
            }
        })

    }




}

function chatSend(toId) {

    // 1. 화면 만들기

    if (hasChattingId) {
        document.querySelector("#chat-message").insertAdjacentHTML("beforeend",
            `<div id="chat-tobox"><div id="chat-to">${document.querySelector("#chatContent").value}</div></div>`
        );
    } else {
        alert("상대 닉네임을 입력해주세요");
        document.querySelector("#chatTo").focus();
    }


    // 2. 웹소켓 전송하기


    websocket.send(JSON.stringify({
        "toId": toId,
        "fromId": memberNo,
        "message": document.querySelector("#chatContent").value,
    }))

    // 전송 후 메시지 제거
    document.querySelector("#chatContent").value = "";

}

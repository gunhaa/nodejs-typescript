


// 페이지 로딩때 리뷰 불러오기
document.addEventListener("DOMContentLoaded", () => {
    
    
    selectReview();
    

});

// 스크롤 이벤트리스너 상태 제어
let isScrollListenerActive = true;

// 스크롤 핸들러 선언
let scrollHandler;

const write = document.querySelector(".btn3");
// 글쓰기 불러오기
write.addEventListener("click", () => {
    if (memberNickname != "") {

        document.querySelector("#startLine").insertAdjacentHTML("afterend",
            `<div id="background-modal"></div>
                    
                    <div id="write-modal">
                        <div class="write-wrapper">
                            <form action="${contextPath}/review/write" method="GET">
                                <div class="write-lecture">
                                    <label for="lecture" class="selectlabel">리뷰할 강의를 골라주세요</label>
                                    <select name="parents" class="selectBox" required>
                                    </select>
                                </div>
                                <div class="write-tag">
                                    <div class="write-tag-question">태그를 선택해 주세요</div>
                                    <div class="write-tag-select">
                                        <div class="radio-button selected" data-value="1">#친절해요</div>
                                        <div class="radio-button" data-value="2">#재밌어요</div>
                                        <div class="radio-button" data-value="3">#시간가는줄 몰라요</div>
                                        <div class="radio-button" data-value="4">#가격대비최고</div>
                                        <div class="radio-button" data-value="5">#강의 맛집</div>
                                        <div class="radio-button" data-value="6">#다음에 또 올께요</div>
                                        <div class="radio-button" data-value="7">#완강했어요</div>
                                        <div class="radio-button" data-value="8">#후회 안해요</div>
                                        <div class="radio-button" data-value="9">#고민은 시간낭비</div>
                                        <input type="radio" name="tag" value="1" id="option1" required checked
                                            hidden>
                                        <input type="radio" name="tag" value="2" id="option2" hidden>
                                        <input type="radio" name="tag" value="3" id="option3" hidden>
                                        <input type="radio" name="tag" value="4" id="option4" hidden>
                                        <input type="radio" name="tag" value="5" id="option5" hidden>
                                        <input type="radio" name="tag" value="6" id="option6" hidden>
                                        <input type="radio" name="tag" value="7" id="option7" hidden>
                                        <input type="radio" name="tag" value="8" id="option8" hidden>
                                        <input type="radio" name="tag" value="9" id="option9" hidden>
                                    </div>
                                </div>
                                <div class="write-content">
                                    <div class="writestarbox">
                                        <div class="starsel">
                                            <input type="radio" name="writeStar" value="5" id="star1" required
                                                hidden><label for="star1">★ </label><input type="radio" name="writeStar"
                                                value="4" id="star2" hidden><label for="star2">★ </label><input
                                                type="radio" name="writeStar" value="3" id="star3" hidden><label
                                                for="star3">★ </label><input type="radio" name="writeStar" value="2"
                                                id="star4" hidden><label for="star4">★ </label><input type="radio"
                                                name="writeStar" value="1" id="star5" hidden><label for="star5">★
                                            </label>
                                            별점을 선택해주세요
                                        </div>
                                        <input type="text" placeholder="제목을 입력해주세요" id="writeTitle" name="writeTitle" maxlength="30">
                                        <textarea name="writetext" cols="60" rows="6" id="writecontext" maxlength="300"
                                            placeholder="내용을 입력해주세요"></textarea>
                                    </div>
                                    <button id="write-btn1" type="submit">글 쓰기</button>
                                    <button id="write-btn2" type="button">취소</button>
                            </form>
                        </div>
                    </div>`
        )

        selectMylecture();

        tagButtonController();

    } else {
        alert("로그인을 하고 리뷰를 작성해주세요.");
    }

});

//추천 순 리뷰 불러오기
document.querySelector(".btn1").addEventListener("click", () => {
    selectReviewByThumbs();
});


//최신순 리뷰 불러오기 
document.querySelector(".btn2").addEventListener("click", () => {
    selectReview();

})

// 검색 버튼 이벤트 리스너
document.querySelector("#searchReviewBtn").addEventListener("click", () => {
    searchReview();
})

function selectReview() {

    $.ajax({

        url: contextPath + "/review/view",
        type: "POST",
        success(res) {

            const result = JSON.parse(res);
            //기존요소가 있다면 모두 제거
            document.querySelectorAll("#main-box").forEach((el) => {
                el.remove();
            });


            // 무한 페이지네이션 구현
            // 총 길이 result.length
            // 배열을 20개 단위로 자르고 이걸 새로운 배열로 만들어야함
            // 그리고 이벤트 리스너를 붙여서 스크롤 95%까지 오면 다음 배열을 불러야함

            //페이지의 총 길이 (한 페이지에 20개씩)
            const page = Math.ceil(result.length / 20);
            //resutls 배열의 인덱스는 페이지수를 나타냄
            let results = [];
            for (let i = 1; i < page + 1; i++) {

                let start = (i - 1) * 20;
                let end = i * 20;

                let arr = result.slice(start, end);

                results.push(arr);
            }
            results = results.reverse();
            // 첫 번째 배열을 통해서 화면을 만든다
			console.log(results[0]);
            results[0].forEach(review => {
                let starText = "";
                if (review.profileImage == null) {
                    review.profileImage = "/resources/img/profile-default.jpg";
                }

                let memberBtn = "";
                if (memberNickname == review.memberNickname) {
                    memberBtn = `<div class='updateBtn' id='update${review.boardNo}${review.memberNickname}'>수정하기</div><div class='deleteBtn' id=delete${review.boardNo}${review.memberNickname}>삭제하기</div>`
                }

                if (review.reviewStar == 1) {
                    review.reviewStar = "★";
                    starText = "1.0";
                } else if (review.reviewStar == 2) {
                    review.reviewStar = "★★";
                    starText = "2.0";
                } else if (review.reviewStar == 3) {
                    review.reviewStar = "★★★";
                    starText = "3.0";
                } else if (review.reviewStar == 4) {
                    review.reviewStar = "★★★★";
                    starText = "4.0";
                } else if (review.reviewStar == 5) {
                    review.reviewStar = "★★★★★";
                    starText = "5.0";
                }
                document.querySelector("#startLine").insertAdjacentHTML("afterend",
                    `<div id="main-box" class=mapping${review.boardNo}>
                    <div class="content">
                <div class="titlebox">
                    <span class="title">${review.lectureName}</span>${memberBtn}
                    <span class="lecturer">강사</span>
                    <span class="name">${review.instructorName}</span>
                    <div class="recommend-btn" id="thumbs${review.boardNo}${review.memberNickname}">추천</div>
                    <div class="declaration-btn">신고</div>
                </div>
                <div class="classimgcontainer">
                    <img src="${contextPath}${review.classURL}" class="classimg">
                </div>
                <div class="reviewcontentbox">
                    <div class="reviewtitle">
                        <img src="${contextPath}${review.profileImage}" class="profileimg">
                        <div class="name1">
                            <div class="reviewer">${review.memberNickname}</div>
                            <div class="reviewScore">
                                <div class="star" style="color:gold">${review.reviewStar}</div>
                                <div class="starnum">(${starText})</div>
                            </div>
                        </div>
                        <div class="title1">
                            <div class="title1-reviewtitle">${review.boardTitle}</div>
                            <div class="title1-reviewsubtitle">
                                <div class="title1-reviewsubtitle-date color626262" id="${review.boardNo}${review.updateDate}">작성일 ${review.createdDate}</div>
                                <div class="title1-reviewsubtitle-recommend color595959" id="recommend${review.boardNo}">추천${review.thumbs}</div>
                                <div class="title1-reviewsubtitle-report color595959">신고${review.report}</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentbox">
                        <div class="reviewcontext">${review.boardContent}
                        </div>
                        <div class="reviewtag">#${review.tag}</div>
                    </div>
                </div>
                </div>
                </div>`

                )

				if (review.updateDate) {
                    document.getElementById(`${review.boardNo}${review.updateDate}`).insertAdjacentHTML("afterbegin",
                        `<div class="title1-reviewsubtitle-update color626262">수정일 ${review.updateDate}</div>`
                    );
                }


                // 리뷰 작성자와 로그인 멤버가 일치해서 버튼이 필요한 경우 이벤트 리스너 추가
                // 수정하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`update${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        // 내가 선택한 boardno를 넘겨서 value들을 가져온후 그 값을 기반으로 글쓰기 페이지 생성
                        updateMylecture(`${review.boardNo}`);
                    })
                }

                // 삭제하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`delete${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                            deleteReview(review.boardNo);
                        }
                    })
                }

                // 추천하기 이벤트 추가
                if (document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`)) {
                    document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {

                        if (memberNickname) {
                            console.log(`리뷰 번호 : ${review.boardNo}, 추천할사람 닉네임 : ${memberNickname}`);

                            thumbsReview(review.boardNo, memberNickname);

                        } else {
                            alert("로그인 이후 추천을 할 수 있습니다.");
                        }

                    });
                }
            });

				// 만약 이벤트 핸들러 객체가 존재한다면 삭제 후
				
				if(scrollHandler){
					scrollHandler.removeScrollListener();
				}
				// 스크롤 이벤트 추가 이벤트 핸들러 객체 생성

                scrollHandler = createScrollEventHandler(results, memberNickname, contextPath);

        },
        error() {
            console.log("에러임");
        }

    });
}



function selectReviewByThumbs() {

    $.ajax({

        url: contextPath + "/review/viewThumbs",
        type: "POST",
        success(res) {

            const result = JSON.parse(res);
            //기존요소가 있다면 모두 제거
            document.querySelectorAll("#main-box").forEach((el) => {
                el.remove();
            });


            // 무한 페이지네이션 구현
            // 총 길이 result.length
            // 배열을 20개 단위로 자르고 이걸 새로운 배열로 만들어야함
            // 그리고 이벤트 리스너를 붙여서 스크롤 95%까지 오면 다음 배열을 불러야함

            //페이지의 총 길이 (한 페이지에 20개씩)
            const page = Math.ceil(result.length / 20);
            //resutls 배열의 인덱스는 페이지수를 나타냄
            let results = [];
            for (let i = 1; i < page + 1; i++) {

                let start = (i - 1) * 20;
                let end = i * 20;

                let arr = result.slice(start, end);

                results.push(arr);
            }
            results = results.reverse();

            // 첫 번째 배열을 통해서 화면을 만든다.

            results[0].forEach(review => {
                let starText = "";
                if (review.profileImage == null) {
                    review.profileImage = "/resources/img/profile-default.jpg";
                }

                let memberBtn = "";
                if (memberNickname == review.memberNickname) {
                    memberBtn = `<div class='updateBtn' id='update${review.boardNo}${review.memberNickname}'>수정하기</div><div class='deleteBtn' id=delete${review.boardNo}${review.memberNickname}>삭제하기</div>`
                }

                if (review.reviewStar == 1) {
                    review.reviewStar = "★";
                    starText = "1.0";
                } else if (review.reviewStar == 2) {
                    review.reviewStar = "★★";
                    starText = "2.0";
                } else if (review.reviewStar == 3) {
                    review.reviewStar = "★★★";
                    starText = "3.0";
                } else if (review.reviewStar == 4) {
                    review.reviewStar = "★★★★";
                    starText = "4.0";
                } else if (review.reviewStar == 5) {
                    review.reviewStar = "★★★★★";
                    starText = "5.0";
                }
                document.querySelector("#startLine").insertAdjacentHTML("afterend",
                    `<div id="main-box" class=mapping${review.boardNo}>
                    <div class="content">
                <div class="titlebox">
                    <span class="title">${review.lectureName}</span>${memberBtn}
                    <span class="lecturer">강사</span>
                    <span class="name">${review.instructorName}</span>
                    <div class="recommend-btn" id="thumbs${review.boardNo}${review.memberNickname}">추천</div>
                    <div class="declaration-btn">신고</div>
                </div>
                <div class="classimgcontainer">
                    <img src="${contextPath}${review.classURL}" class="classimg">
                </div>
                <div class="reviewcontentbox">
                    <div class="reviewtitle">
                        <img src="${contextPath}${review.profileImage}" class="profileimg">
                        <div class="name1">
                            <div class="reviewer">${review.memberNickname}</div>
                            <div class="reviewScore">
                                <div class="star" style="color:gold">${review.reviewStar}</div>
                                <div class="starnum">(${starText})</div>
                            </div>
                        </div>
                        <div class="title1">
                            <div class="title1-reviewtitle">${review.boardTitle}</div>
                            <div class="title1-reviewsubtitle">
                                <div class="title1-reviewsubtitle-date color626262" id="${review.boardNo}${review.updateDate}">작성일 ${review.createdDate}</div>
                                <div class="title1-reviewsubtitle-recommend color595959" id="recommend${review.boardNo}">추천${review.thumbs}</div>
                                <div class="title1-reviewsubtitle-report color595959">신고${review.report}</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentbox">
                        <div class="reviewcontext">${review.boardContent}
                        </div>
                        <div class="reviewtag">#${review.tag}</div>
                    </div>
                </div>
                </div>
                </div>`

                )


				if (review.updateDate) {
                    document.getElementById(`${review.boardNo}${review.updateDate}`).insertAdjacentHTML("afterbegin",
                        `<div class="title1-reviewsubtitle-update color626262">수정일 ${review.updateDate}</div>`
                    );
                }


                // 리뷰 작성자와 로그인 멤버가 일치해서 버튼이 필요한 경우 이벤트 리스너 추가
                // 수정하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`update${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        // 내가 선택한 boardno를 넘겨서 value들을 가져온후 그 값을 기반으로 글쓰기 페이지 생성
                        updateMylecture(`${review.boardNo}`);
                    })
                }

                // 삭제하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`delete${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                            deleteReview(review.boardNo);
                        }
                    })
                }

                // 추천하기 이벤트 추가
                if (document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`)) {
                    document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {

                        if (memberNickname) {
                            console.log(`리뷰 번호 : ${review.boardNo}, 추천할사람 닉네임 : ${memberNickname}`);

                            thumbsReview(review.boardNo, memberNickname);

                        } else {
                            alert("로그인 이후 추천을 할 수 있습니다.");
                        }

                    });
                }

            });

				// 만약 이벤트 핸들러 객체가 존재한다면 삭제 후
				
				if(scrollHandler){
					scrollHandler.removeScrollListener();
				}
				// 스크롤 이벤트 추가 이벤트 핸들러 객체 생성

                scrollHandler = createScrollEventHandler(results, memberNickname, contextPath);



        },
        error() {
            console.log("에러임");
        }

    });
}


// 글쓰기 창 화면 만들기
function selectMylecture() {
    $.ajax({

        url: contextPath + "/review/writeForm",
        type: "POST",
        data: {
            "memberNo": memberNo
        },
        success(res) {
            let result = JSON.parse(res);
            let str = "";
            result.forEach((item) => {
                str += `<option value="${item.classNo}" name="parents">${item.className}</option>`
                console.log(`멤버 번호(item.classNo) : ${item.classNo}`);

            })
            document.querySelector(".selectBox").innerHTML = str

            document.querySelector(".write-tag-question").insertAdjacentHTML("afterbegin", `<input type="text" value="${memberNo}" name="writeMember" hidden>`)

        },
        error() {
            console.log("error");
        }

    })

}

//게시글 업데이트
function updateMylecture(boardNo) {

    $.ajax({

        url: contextPath + "/review/updateForm",
        type: "POST",
        data: {
            "boardNo": boardNo
        },
        success(result) {
            let res = JSON.parse(result);

            res.boardContent = res.boardContent.replaceAll("<br>", "\n");


            document.querySelector("#main-box").insertAdjacentHTML("afterend",
                `<div id="background-modal"></div>
                        <div id="write-modal">
                            <div class="write-wrapper">
                                <form action="${contextPath}/review/updateReview" method="POST">
                                    <div class="write-lecture">
                                        <label for="lecture" class="selectlabel">현재 수정중인 리뷰 :<br> ${res.lectureName} </label>

                                    </div>
                                    <div class="write-tag">
                                        <div class="write-tag-question">태그를 선택해 주세요</div>
                                        <div class="write-tag-select">
                                            <div class="radio-button" data-value="1">#친절해요</div>
                                            <div class="radio-button" data-value="2">#재밌어요</div>
                                            <div class="radio-button" data-value="3">#시간가는줄 몰라요</div>
                                            <div class="radio-button" data-value="4">#가격대비최고</div>
                                            <div class="radio-button" data-value="5">#강의 맛집</div>
                                            <div class="radio-button" data-value="6">#다음에 또 올께요</div>
                                            <div class="radio-button" data-value="7">#완강했어요</div>
                                            <div class="radio-button" data-value="8">#후회 안해요</div>
                                            <div class="radio-button" data-value="9">#고민은 시간낭비</div>
                                            <input type="radio" name="tag" value="1" id="option1" required
                                                hidden>
                                            <input type="radio" name="tag" value="2" id="option2" hidden>
                                            <input type="radio" name="tag" value="3" id="option3" hidden>
                                            <input type="radio" name="tag" value="4" id="option4" hidden>
                                            <input type="radio" name="tag" value="5" id="option5" hidden>
                                            <input type="radio" name="tag" value="6" id="option6" hidden>
                                            <input type="radio" name="tag" value="7" id="option7" hidden>
                                            <input type="radio" name="tag" value="8" id="option8" hidden>
                                            <input type="radio" name="tag" value="9" id="option9" hidden>
                                        </div>
                                    </div>
                                    <div class="write-content">
                                        <div class="writestarbox">
                                            <div class="starsel">
                                                <input type="radio" name="writeStar" value="5" id="star1" required
                                                    hidden><label for="star1">★ </label><input type="radio" name="writeStar"
                                                    value="4" id="star2" hidden><label for="star2">★ </label><input
                                                    type="radio" name="writeStar" value="3" id="star3" hidden><label
                                                    for="star3">★ </label><input type="radio" name="writeStar" value="2"
                                                    id="star4" hidden><label for="star4">★ </label><input type="radio"
                                                    name="writeStar" value="1" id="star5" hidden><label for="star5">★
                                                </label>
                                                별점을 선택해주세요
                                            </div>
                                            <input type="text" placeholder="제목을 입력해주세요" id="writeTitle" name="writeTitle" maxlength="30" value="${res.boardTitle}">
                                            <textarea name="writetext" cols="60" rows="6" id="writecontext" maxlength="300"
                                                placeholder="내용을 입력해주세요">${res.boardContent}</textarea>
                                        </div>
                                        <button id="write-btn1" type="submit">글 쓰기</button>
                                        <button id="write-btn2" type="button">취소</button>
                                </form>
                            </div>
                        </div>`
            )
            // 수정하는 게시글 식별
            console.log("수정 게시글 : " + boardNo);
            document.querySelector(".write-tag-question").insertAdjacentHTML("afterbegin", `<input type="text" value="${boardNo}" name="updateBoardNo" hidden>`)

            switch (res.reviewStar) {
                case 1:
                    document.querySelector("#star5").checked = true;
                    break;
                case 2:
                    document.querySelector("#star4").checked = true;
                    break;
                case 3:
                    document.querySelector("#star3").checked = true;
                    break;
                case 4:
                    document.querySelector("#star2").checked = true;
                    break;
                case 5:
                    document.querySelector("#star1").checked = true;
                    break;
            }

            switch (res.tag) {
                case "친절해요":
                    let btn1 = document.querySelectorAll('.radio-button')[0];
                    updateTagController(btn1);
                    break;
                case "재밌어요":
                    let btn2 = document.querySelectorAll('.radio-button')[1];
                    updateTagController(btn2);
                    break;
                case "시간가는줄 몰라요":
                    let btn3 = document.querySelectorAll('.radio-button')[2];
                    updateTagController(btn3);
                    break;
                case "가격대비최고":
                    let btn4 = document.querySelectorAll('.radio-button')[3];
                    updateTagController(btn4);
                    break;
                case "강의 맛집":
                    let btn5 = document.querySelectorAll('.radio-button')[4];
                    updateTagController(btn5);
                    break;
                case "다음에 또 올께요":
                    let btn6 = document.querySelectorAll('.radio-button')[5];
                    updateTagController(btn6);
                    break;
                case "완강했어요":
                    let btn7 = document.querySelectorAll('.radio-button')[6];
                    updateTagController(btn7);
                    break;
                case "후회 안해요":
                    let btn8 = document.querySelectorAll('.radio-button')[7];
                    updateTagController(btn8);
                    break;
                case "고민은 시간낭비":
                    let btn9 = document.querySelectorAll('.radio-button')[8];
                    updateTagController(btn9);
                    break;
            }


            tagButtonController();



        },
        error() {
            console.log("update 에러");
        }

    })
}


function tagButtonController() {
    const buttons = document.querySelectorAll('.radio-button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));

            button.classList.add('selected');

            const value = button.getAttribute('data-value');
            const radioButton = document.querySelector(`input[type="radio"][value="${value}"]`);
            radioButton.checked = true;
        });
    });

    document.querySelector("#write-btn2").addEventListener("click", () => {
        const background = document.querySelector("#background-modal");
        const writemodal = document.querySelector("#write-modal");
        if (background) {
            background.remove();
        }
        if (writemodal) {
            writemodal.remove();
        }
    });
}


function updateTagController(btn) {
    btn.classList.add('selected');

    const value = btn.getAttribute('data-value');
    const radioButton = document.querySelector(`input[type="radio"][value="${value}"]`);
    radioButton.checked = true;
}
// 리뷰 삭제
function deleteReview(boardNo) {
    $.ajax({

        url: contextPath + "/review/deleteReview",
        type: "POST",
        data: {
            "boardNo": boardNo
        },
        success(res) {
            // 페이지 새로고침
            location.reload(true);
        },
        error() {
            console.log("리뷰 삭제 오류");
        }
    });
}

// 리뷰 추천
function thumbsReview(reviewBoardNo, loginMemberNickName) {

    $.ajax({

        url: contextPath + "/review/thumbsReview",
        type: "POST",
        data: {
            "boardNo": reviewBoardNo,
            "loginMemberNickName": loginMemberNickName,
        },
        success(res) {
            let result = JSON.parse(res);
            console.log(res);
            console.log(result);

            if (result[0] == 1) {
                alert("리뷰를 추천하였습니다.");
                console.log("리뷰 추천 성공");
                console.log(`총 추천갯수 : ${result[1]}`)
                document.getElementById(`recommend${reviewBoardNo}`).innerHTML = `추천${result[1]}`
            } else {
                alert("리뷰 추천이 취소되었습니다.")
                console.log("리뷰 추천 취소됨");
                console.log(`총 추천갯수 : ${result[1]}`)
                document.getElementById(`recommend${reviewBoardNo}`).innerHTML = `추천${result[1]}`
            }
        },
        error() {
            console.log("리뷰 추천 에러");
        }



    });

}

// 리뷰 검색
function searchReview() {

    const searchReview = document.getElementById("searchReview");

    $.ajax({

        url: contextPath + "/review/searchReview",
        type: "POST",
        data: {
            "searchReview": searchReview.value
        },
        success(res) {
            const result = JSON.parse(res);

            document.querySelectorAll("#main-box").forEach((el) => {
                el.remove();
            });

			// 만약 이벤트 핸들러 객체가 존재한다면 삭제 후
				
			if(scrollHandler){
				scrollHandler.removeScrollListener();
			}
            // 화면 만들기

            result.forEach((review) => {
                let starText = "";
                if (review.profileImage == null) {
                    review.profileImage = "/resources/img/profile-default.jpg";
                }

                let memberBtn = "";
                if (memberNickname == review.memberNickname) {
                    memberBtn = `<div class='updateBtn' id='update${review.boardNo}${review.memberNickname}'>수정하기</div><div class='deleteBtn' id=delete${review.boardNo}${review.memberNickname}>삭제하기</div>`
                }

                if (review.reviewStar == 1) {
                    review.reviewStar = "★";
                    starText = "1.0";
                } else if (review.reviewStar == 2) {
                    review.reviewStar = "★★";
                    starText = "2.0";
                } else if (review.reviewStar == 3) {
                    review.reviewStar = "★★★";
                    starText = "3.0";
                } else if (review.reviewStar == 4) {
                    review.reviewStar = "★★★★";
                    starText = "4.0";
                } else if (review.reviewStar == 5) {
                    review.reviewStar = "★★★★★";
                    starText = "5.0";
                }
                document.querySelector("#startLine").insertAdjacentHTML("afterend",
                    `<div id="main-box" class=mapping${review.boardNo}>
                    <div class="content">
                <div class="titlebox">
                    <span class="title">${review.lectureName}</span>${memberBtn}
                    <span class="lecturer">강사</span>
                    <span class="name">${review.instructorName}</span>
                    <div class="recommend-btn" id="thumbs${review.boardNo}${review.memberNickname}">추천</div>
                    <div class="declaration-btn">신고</div>
                </div>
                <div class="classimgcontainer">
                    <img src="${contextPath}${review.classURL}" class="classimg">
                </div>
                <div class="reviewcontentbox">
                    <div class="reviewtitle">
                        <img src="${contextPath}${review.profileImage}" class="profileimg">
                        <div class="name1">
                            <div class="reviewer">${review.memberNickname}</div>
                            <div class="reviewScore">
                                <div class="star" style="color:gold">${review.reviewStar}</div>
                                <div class="starnum">(${starText})</div>
                            </div>
                        </div>
                        <div class="title1">
                            <div class="title1-reviewtitle">${review.boardTitle}</div>
                            <div class="title1-reviewsubtitle">
                                <div class="title1-reviewsubtitle-date color626262" id="${review.boardNo}${review.updateDate}">작성일 ${review.createdDate}</div>
                                <div class="title1-reviewsubtitle-recommend color595959" id="recommend${review.boardNo}">추천${review.thumbs}</div>
                                <div class="title1-reviewsubtitle-report color595959">신고${review.report}</div>
                            </div>
                        </div>
                    </div>
                    <div class="contentbox">
                        <div class="reviewcontext">${review.boardContent}
                        </div>
                        <div class="reviewtag">#${review.tag}</div>
                    </div>
                </div>
                </div>
                </div>`

                )




                if (review.updateDate) {
                    document.getElementById(`${review.boardNo}${review.updateDate}`).insertAdjacentHTML("afterbegin",
                        `<div class="title1-reviewsubtitle-update color626262">수정일 ${review.updateDate}</div>`
                    );
                }


                // 리뷰 작성자와 로그인 멤버가 일치해서 버튼이 필요한 경우 이벤트 리스너 추가
                // 수정하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`update${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        // 내가 선택한 boardno를 넘겨서 value들을 가져온후 그 값을 기반으로 글쓰기 페이지 생성
                        updateMylecture(`${review.boardNo}`);
                    })
                }

                // 삭제하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`delete${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                            deleteReview(review.boardNo);
                        }
                    })
                }

                // 추천하기 이벤트 추가
                if (document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`)) {
                    document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {

                        if (memberNickname) {
                            console.log(`리뷰 번호 : ${review.boardNo}, 추천할사람 닉네임 : ${memberNickname}`);

                            thumbsReview(review.boardNo, memberNickname);

                        } else {
                            alert("로그인 이후 추천을 할 수 있습니다.");
                        }

                    });
                }

            });

        },
        error() {
            console.log("리뷰 검색 에러");
        }

    });

    searchReview.value = "";
}


function scrollEvent(results, currentIndex, hasScrolled, scrollPositionBeforeLoad){



                // 스크롤 위치 리뷰 만들어지기 전 마지막 요소로 변경

                const moveHere = document.querySelectorAll(".reviewtag");

                // 마지막 요소 선택
                const lastMove = moveHere[moveHere.length - 1];




                // 두 번째 부터는 스크롤이 90%에 올때 마다 20개씩 추가 리뷰를 불러낸다.
                const scrollTop = window.scrollY; // 현재 스크롤 위치
                const windowHeight = window.innerHeight; // 현재 창의 높이
                const documentHeight = document.documentElement.scrollHeight; // 전체 문서 높이



                // 현재 스크롤 위치가 문서 전체 높이의 90% 이상일 때
                if (scrollTop + windowHeight > documentHeight * 0.95) {
                    if (!hasScrolled) { // 한 번만 실행되도록 체크
                        hasScrolled = true; // 처리 완료

                        // 리뷰 추가 전의 스크롤 위치 저장
                        scrollPositionBeforeLoad = scrollTop;

                        results[currentIndex].forEach((review) => {
                            let starText = "";
                            if (review.profileImage == null) {
                                review.profileImage = "/resources/img/profile-default.jpg";
                            }

                            let memberBtn = "";
                            if (memberNickname == review.memberNickname) {
                                memberBtn = `<div class='updateBtn' id='update${review.boardNo}${review.memberNickname}'>수정하기</div><div class='deleteBtn' id=delete${review.boardNo}${review.memberNickname}>삭제하기</div>`
                            }

                            if (review.reviewStar == 1) {
                                review.reviewStar = "★";
                                starText = "1.0";
                            } else if (review.reviewStar == 2) {
                                review.reviewStar = "★★";
                                starText = "2.0";
                            } else if (review.reviewStar == 3) {
                                review.reviewStar = "★★★";
                                starText = "3.0";
                            } else if (review.reviewStar == 4) {
                                review.reviewStar = "★★★★";
                                starText = "4.0";
                            } else if (review.reviewStar == 5) {
                                review.reviewStar = "★★★★★";
                                starText = "5.0";
                            }
                            document.querySelector("#startLine").insertAdjacentHTML("afterend",
                                `<div id="main-box" class=mapping${review.boardNo}>
                                <div class="content">
                            <div class="titlebox">
                                <span class="title">${review.lectureName}</span>${memberBtn}
                                <span class="lecturer">강사</span>
                                <span class="name">${review.instructorName}</span>
                                <div class="recommend-btn" id="thumbs${review.boardNo}${review.memberNickname}">추천</div>
                                <div class="declaration-btn">신고</div>
                            </div>
                            <div class="classimgcontainer">
                                <img src="${contextPath}${review.classURL}" class="classimg">
                            </div>
                            <div class="reviewcontentbox">
                                <div class="reviewtitle">
                                    <img src="${contextPath}${review.profileImage}" class="profileimg">
                                    <div class="name1">
                                        <div class="reviewer">${review.memberNickname}</div>
                                        <div class="reviewScore">
                                            <div class="star" style="color:gold">${review.reviewStar}</div>
                                            <div class="starnum">(${starText})</div>
                                        </div>
                                    </div>
                                    <div class="title1">
                                        <div class="title1-reviewtitle">${review.boardTitle}</div>
                                        <div class="title1-reviewsubtitle">
                                            <div class="title1-reviewsubtitle-date color626262" id="${review.boardNo}${review.updateDate}">작성일 ${review.createdDate}</div>
                                            <div class="title1-reviewsubtitle-recommend color595959" id="recommend${review.boardNo}">추천${review.thumbs}</div>
                                            <div class="title1-reviewsubtitle-report color595959">신고${review.report}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="contentbox">
                                    <div class="reviewcontext">${review.boardContent}
                                    </div>
                                    <div class="reviewtag">#${review.tag}</div>
                                </div>
                            </div>
                            </div>
                            </div>`

                            )




                            if (review.updateDate) {
                                document.getElementById(`${review.boardNo}${review.updateDate}`).insertAdjacentHTML("afterbegin",
                                    `<div class="title1-reviewsubtitle-update color626262">수정일 ${review.updateDate}</div>`
                                );
                            }


                            // 리뷰 작성자와 로그인 멤버가 일치해서 버튼이 필요한 경우 이벤트 리스너 추가
                            // 수정하기 이벤트 추가
                            if (memberBtn != "") {
                                document.getElementById(`update${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                                    // 내가 선택한 boardno를 넘겨서 value들을 가져온후 그 값을 기반으로 글쓰기 페이지 생성
                                    updateMylecture(`${review.boardNo}`);
                                })
                            }

                            // 삭제하기 이벤트 추가
                            if (memberBtn != "") {
                                document.getElementById(`delete${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                                    if (confirm("정말 삭제하시겠습니까?")) {
                                        deleteReview(review.boardNo);
                                    }
                                })
                            }

                            // 추천하기 이벤트 추가
                            if (document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`)) {
                                document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {

                                    if (memberNickname) {
                                        console.log(`리뷰 번호 : ${review.boardNo}, 추천할사람 닉네임 : ${memberNickname}`);

                                        thumbsReview(review.boardNo, memberNickname);

                                    } else {
                                        alert("로그인 이후 추천을 할 수 있습니다.");
                                    }

                                });
                            }

                        });

                        // 리뷰가 추가된 후 스크롤을 원래 위치로 이동
                        setTimeout(() => {
                            window.scrollTo({
                                top: scrollPositionBeforeLoad,
                                behavior: 'smooth'
                            });
                        }, 100); // 딜레이를 주어 리뷰가 추가된 후 스크롤 위치를 이동시킴

                        currentIndex++;
                    }
                } else {
                    hasScrolled = false; // 95% 지점을 지나면 다시 실행 가능
                }
            
}




// 스크롤 이벤트 nested 함수

function createScrollEventHandler(results, memberNickname, contextPath) {
    let currentIndex = 1; // 현재 리뷰의 인덱스
    let hasScrolled = false;
    let scrollPositionBeforeLoad = 0; // 리뷰 추가 전 스크롤 위치 저장

    // 스크롤 이벤트가 발생할 때 실행되는 함수
    function handleScroll() {

        const scrollTop = window.scrollY; // 현재 스크롤 위치
        const windowHeight = window.innerHeight; // 현재 창의 높이
        const documentHeight = document.documentElement.scrollHeight; // 전체 문서 높이

        if (scrollTop + windowHeight > documentHeight * 0.95) {
            if (!hasScrolled) { // 한 번만 실행되도록 체크
                hasScrolled = true; // 처리 완료

                scrollPositionBeforeLoad = scrollTop;
				let rvpoint = document.querySelectorAll(`#main-box`);
				
				let insertReview =document.querySelectorAll(`#main-box`)[rvpoint.length-1];
				
                results[currentIndex].forEach((review) => {
                    
                    let starText = "";
                    if (review.profileImage == null) {
                        review.profileImage = "/resources/img/profile-default.jpg";
                    }

                    let memberBtn = "";
                    if (memberNickname === review.memberNickname) {
                        memberBtn = `<div class='updateBtn' id='update${review.boardNo}${review.memberNickname}'>수정하기</div><div class='deleteBtn' id='delete${review.boardNo}${review.memberNickname}'>삭제하기</div>`;
                    }

                if (review.reviewStar == 1) {
                    review.reviewStar = "★";
                    starText = "1.0";
                } else if (review.reviewStar == 2) {
                    review.reviewStar = "★★";
                    starText = "2.0";
                } else if (review.reviewStar == 3) {
                    review.reviewStar = "★★★";
                    starText = "3.0";
                } else if (review.reviewStar == 4) {
                    review.reviewStar = "★★★★";
                    starText = "4.0";
                } else if (review.reviewStar == 5) {
                    review.reviewStar = "★★★★★";
                    starText = "5.0";
                }

                    insertReview.insertAdjacentHTML("afterend",
                        `<div id="main-box" class=mapping${review.boardNo}>
                            <div class="content">
                                <div class="titlebox">
                                    <span class="title">${review.lectureName}</span>${memberBtn}
                                    <span class="lecturer">강사</span>
                                    <span class="name">${review.instructorName}</span>
                                    <div class="recommend-btn" id="thumbs${review.boardNo}${review.memberNickname}">추천</div>
                                    <div class="declaration-btn">신고</div>
                                </div>
                                <div class="classimgcontainer">
                                    <img src="${contextPath}${review.classURL}" class="classimg">
                                </div>
                                <div class="reviewcontentbox">
                                    <div class="reviewtitle">
                                        <img src="${contextPath}${review.profileImage}" class="profileimg">
                                        <div class="name1">
                                            <div class="reviewer">${review.memberNickname}</div>
                                            <div class="reviewScore">
                                                <div class="star" style="color:gold">${review.reviewStar}</div>
                                                <div class="starnum">(${starText})</div>
                                            </div>
                                        </div>
                                        <div class="title1">
                                            <div class="title1-reviewtitle">${review.boardTitle}</div>
                                            <div class="title1-reviewsubtitle">
                                                <div class="title1-reviewsubtitle-date color626262" id="${review.boardNo}${review.updateDate}">작성일 ${review.createdDate}</div>
                                                <div class="title1-reviewsubtitle-recommend color595959" id="recommend${review.boardNo}">추천${review.thumbs}</div>
                                                <div class="title1-reviewsubtitle-report color595959">신고${review.report}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="contentbox">
                                        <div class="reviewcontext">${review.boardContent}</div>
                                        <div class="reviewtag">#${review.tag}</div>
                                    </div>
                                </div>
                            </div>
                        </div>`);

			
				if (review.updateDate) {
                    document.getElementById(`${review.boardNo}${review.updateDate}`).insertAdjacentHTML("afterbegin",
                        `<div class="title1-reviewsubtitle-update color626262">수정일 ${review.updateDate}</div>`
                    );
                }


                // 리뷰 작성자와 로그인 멤버가 일치해서 버튼이 필요한 경우 이벤트 리스너 추가
                // 수정하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`update${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        // 내가 선택한 boardno를 넘겨서 value들을 가져온후 그 값을 기반으로 글쓰기 페이지 생성
                        updateMylecture(`${review.boardNo}`);
                    })
                }

                // 삭제하기 이벤트 추가
                if (memberBtn != "") {
                    document.getElementById(`delete${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {
                        if (confirm("정말 삭제하시겠습니까?")) {
                            deleteReview(review.boardNo);
                        }
                    })
                }

                // 추천하기 이벤트 추가
                if (document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`)) {
                    document.getElementById(`thumbs${review.boardNo}${review.memberNickname}`).addEventListener("click", () => {

                        if (memberNickname) {
                            console.log(`리뷰 번호 : ${review.boardNo}, 추천할사람 닉네임 : ${memberNickname}`);

                            thumbsReview(review.boardNo, memberNickname);

                        } else {
                            alert("로그인 이후 추천을 할 수 있습니다.");
                        }

                    });
                }

                });

                // 리뷰가 추가된 후 스크롤을 원래 위치로 이동
                setTimeout(() => {
                    window.scrollTo({
                        top: scrollPositionBeforeLoad,
                        behavior: 'smooth'
                    });
                }, 100); // 딜레이를 주어 리뷰가 추가된 후 스크롤 위치를 이동시킴

                currentIndex++;
            }
        } else {
            hasScrolled = false; // 95% 지점을 지나면 다시 실행 가능
        }
    }

    // 이벤트 리스너 추가 함수
    function addScrollListener() {
        window.addEventListener("scroll", handleScroll);
    }

    // 이벤트 리스너 제거 함수
    function removeScrollListener() {
        window.removeEventListener("scroll", handleScroll);
    }

    // 이벤트 리스너 추가
    addScrollListener();

    // 반환 객체에 리스너 제거 함수를 포함
    return {
        removeScrollListener
    };
    
    // 이벤트 리스너를 제거
    // scrollHandler.removeScrollListener();
}

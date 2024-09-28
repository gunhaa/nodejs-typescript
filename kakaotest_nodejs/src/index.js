



// Kakao.Share.createCustomButton({
//     container: '#kakaotalk-btn',
//     templateId: 109793
// });

function shareMessage(title, description, time) {
    Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
            title: `${title}공대`,
            description: `${description} 
시간 : ${time}`,
            imageUrl:
                'https://i.imgur.com/8nLFCVP.png',
            link: {
                // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
                mobileWebUrl: 'https://lostark.inven.co.kr/',
                webUrl: 'https://lostark.inven.co.kr/',
            },
        },
        buttons: [
            {
                title: '일정 보러 가기',
                link: {
                    mobileWebUrl: 'https://comic.naver.com/index',
                    webUrl: 'https://comic.naver.com/index',
                },
            },
        ],
    });
}

document.querySelector("#kakaotalk-btn").addEventListener("click", startShare);

function startShare() {
    // ${APIKEY} VALUE로 변경
    Kakao.init("2b5bf62d28ef21ec4d52c711fae80f56");


    const title = document.querySelector("#btn2").value;
    const time = document.querySelector("#btn3").value;
    const description = document.querySelector("#btn4").value;

    shareMessage(title, description, time);

}




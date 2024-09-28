


async function useKOGPT() {
    const KOGPT_URL = "https://api.kakaobrain.com/v1/inference/kogpt/generation";

    const prompt = document.querySelector("#review").value;

    const API_KEY = "25a983cd43ace3ddc200c03b8b344578";

    let result="";

    const body = {
        prompt,
        max_tokens: 2048, // 생성할 결과의 최대 토큰 수
        temparature: 1, // 온도 설정
        top_p: 1, // 상위 확률 결정
        n: 1, // 생성할 결과 수(쿼터 차감)
    };

    // kogpt API 호출
    const response = await fetch(KOGPT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "KakaoAK " + API_KEY, // API Key
        },

        body: JSON.stringify(body),
    }).then((res)=>{
        if(!res.ok){
            console.log("api 오류임");
        };
        return res.json();
    }).then((res)=>{
        result = JSON.stringify(res);
        document.querySelector("#resultSet").innerHTML = result;
    });


}


document.querySelector("#reviewBtn").addEventListener("click", useKOGPT);
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const KOGPT_URL = "https://api.kakaobrain.com/v1/inference/kogpt/generation";
const API_KEY = "25a983cd43ace3ddc200c03b8b344578";

app.get('/', function(req, res){
    res.sendFile("./../html/review.html")
})

app.get('/generateText', function (req,res){

    res.sendFile("./../html/review.html");

});

app.post('/generateText', async (req, res) => {
    const prompt = req.body.prompt;

    const body = {
        prompt,
        max_tokens: 2048,
        temperature: 1,
        top_p: 1,
        n: 1
    };

    try {
        const response = await fetch(KOGPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'KakaoAK ' + API_KEY
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const result = await response.json();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('서버 오류');
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
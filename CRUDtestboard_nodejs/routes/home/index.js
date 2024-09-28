const express = require("express");
const router = express.Router();
const connection = require("../../conn.js");



router.get("/", (req, res) => res.render("home/home"));


router.post("/login", (req, res) => {

    const id = req.body.id;
    const pw = req.body.pw;
    const query = 'select * from member where id=? AND pw=?';



    connection.query(query, [id, pw], (error, results, fields) => {
        if (error) {
            console.error('ID/PW쪽 오류임 ', error);
            res.status(500).json({ error: error.message });
            return;
        }

        if (results.length > 0) {
            const user = results[0];

            const boarditem = [];

            const boardQuery = "select * from board";

            connection.query(boardQuery, (error, results, fields) => {
                if (error) {
                    console.error('ID/PW쪽 오류임 ', error);
                    res.status(500).json({ error: error.message });
                    return;
                }

                results.forEach((item) => {

                    boarditem.push(item);

                });

                // console.log(boarditem);
                res.render('home/login', {
                    user: user,
                    item: boarditem
                });

            });



        } else {

            res.render("home/loginfail");
        }
    });
});

router.get("/kogpt", (req, res) => {
    res.render("home/kogpt.ejs");
});

router.post("/kogpt", async (req, res) => {

    const KOGPT_URL = "https://api.kakaobrain.com/v1/inference/kogpt/generation";
    const API_KEY = "25a983cd43ace3ddc200c03b8b344578";



    const prompt =
`강의 후기를 긍정 또는 부정으로 분류합니다.
가격대비좀 부족한게많은듯=부정
강의자님이 강의를 잘해요=긍정
ㅠㅠ약간 후회가 됩니다..=부정
이전 강의 듣고 또 듣습니다!=긍정
${req.body.prompt}=`

    // res.send({
    //     prompt : prompt
    // });
    const body = {
        'prompt': prompt,
        //답변 토큰
        'max_tokens': 1,
        // 1로 갈수록 재미없음
        'temperature': 0.4,
        // 상위 확률만 고려
        'top_p': 0.1,
        // 답변 갯수
        // 'n': 1
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
            throw new Error({
                msg: '요청 실패'
            });
        }

        const result = await response.json();
        res.send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({
            msg: '서버 오류'
        });
    }

});





router.get("/login/write", (req, res) => {
    res.render("home/write.ejs");
});

router.post("/login/write", (req, res) => {

    const title = req.body.title;
    const description = req.body.description;

    const writeQuery = "insert into board (BOARD_TITLE, BOARD_DESCRIPTION) values(? , ?)";

    connection.query(writeQuery, [title, description], (err, results, fields) => {
        if (err) {
            console.error('ID/PW쪽 오류임 ', err);
            res.status(500).json({ error: err.message });
            return;
        }

        // console.log(results);
        // 결과
        // ResultSetHeader {
        //     fieldCount: 0,
        //     affectedRows: 1,
        //     insertId: 6,
        //     info: '',
        //     serverStatus: 2,
        //     warningStatus: 0,
        //     changedRows: 0
        //   }
        //         fieldCount: 쿼리 결과의 필드 수입니다. 여기서는 0으로 표시되므로 필드가 없음을 나타냅니다.
        // affectedRows: 쿼리에 의해 영향을 받은 행(row)의 수입니다. INSERT 쿼리를 실행했으므로 새로운 행이 1개 삽입되었습니다.
        // insertId: 삽입된 행의 ID입니다. 여기서는 6번째 ID가 삽입되었다는 의미입니다.
        // info: 추가적인 정보가 있는 경우 여기에 표시됩니다. 여기서는 빈 문자열("")이므로 추가 정보가 없음을 나타냅니다.
        // serverStatus: 서버 상태 코드입니다. 여기서 2는 SERVER_STATUS_AUTOCOMMIT을 나타내며, 자동 커밋이 활성화되어 있음을 의미합니다.
        // warningStatus: 경고 상태 코드입니다. 여기서는 0으로 표시되므로 경고가 없음을 의미합니다.
        // changedRows: 변경된 행의 수입니다. 여기서는 INSERT 쿼리이므로 변경된 행이 없어서 0으로 표시됩니다.


        // console.log(title);
        // console.log(description);
    });

    res.render("home/login");

});


router.post("/login/delete", (req, res) => {

    const del = req.body.delnum;

    const delQuery = "delete from board where BOARD_NO = ?";

    connection.query(delQuery, [del], (err, results, fields) => {
        if (err) {
            console.error('ID/PW쪽 오류임 ', err);
            res.status(500).json({ error: err.message });
            return;
        }

        if (results.affectedRows > 0) {
            res.json("성공했음");
        }

    });



});

module.exports = router;
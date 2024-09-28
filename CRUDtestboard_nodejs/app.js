
const express = require("express");
const app = express();
const connection = require("./conn.js")


// connection.query('SELECT * FROM MEMBER', (error, results, fields) => {
//     if (error) throw error;
//     console.log('사용자 정보: ', results);
// });

// connection.end();



app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.json());
//app.use 미들웨어를 등록해주는 메소드
app.use(express.urlencoded({ extended: false }));
// 정적파일의 위치 만들기 js 모음
app.use(express.static('js'));

const home = require("./routes/home")
app.use("/" , home);
app.use("/login" , home); 
app.use("/login/write", home);
app.use("/login/delete", home);


app.listen(3000, () => {
    console.log("서버 가동");
});





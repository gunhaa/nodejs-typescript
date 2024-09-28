
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: 'localhost',  // MySQL 호스트
    user: 'root',       // MySQL 사용자 이름
    password: '1234',   // MySQL 비밀번호
    database: 'mysql4',   // 연결할 데이터베이스 이름
    authPlugins: {
        mysql_clear_password: () => () => Buffer.from('password')
    }
});
// MySQL 연결
connection.connect((err) => {
    if (err) {
        console.error('MySQL 연결 오류: ' + err.stack);
        return;
    }
    console.log('MySQL 연결 ID: ' + connection.threadId);
});

module.exports = connection;
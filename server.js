const express = require('express'); // express
const app = express(); //express → result Application
const port = process.env.PORT || 5000;
const fs = require('fs');

app.use(express.urlencoded({ extended: false })); //Body-Parser #parse data's body

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

// DB setting
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database,
});
connection.connect();

// multer 이용 파일 받아 db에 심기
const multer = require('multer');
const upload = multer({ dest: './upload' });
app.use('/image', express.static('./upload'));
app.post('/api/customers', upload.single('image'), (req, res) => {
  let sql = 'INSERT INTO customer VALUES (null, ?, ?, ?, ?, ?)';
  let image = '/image/' + req.file.filename;
  // file name은 multer lib가 겹치지 않는 이름으로 알아서 할당해줌
  let name = req.body.name;
  let birthday = req.body.birthday;
  let gender = req.body.gender;
  let job = req.body.job;
  let params = [image, name, birthday, gender, job];
  connection.query(sql, params, (err, rows, fields) => {
    console.log(err);
    res.send(rows);
  });
});

//table 대소문자 구분
app.get('/api/customers', (req, res) => {
  connection.query('SELECT * FROM customer', (err, rows, fields) => {
    res.send(rows);
  });
});

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

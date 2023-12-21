import mysql from "mysql"

const db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'root',
  database:'kasirku'
})
db.connect((error:any) => {
  if (error) {
    console.log(error)
  }
  console.log('Connected to MySQL database!');
});
export default db;
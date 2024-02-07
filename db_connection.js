import mysql from "mysql2";
// Config dotnev
import "dotenv/config";

// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "",
// });
var pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
  })
  .promise();

//Create database
const [rows] = await pool.query("CREATE DATABASE IF NOT EXISTS mydb");
console.log("Database created");
console.log(rows);

// con.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });

pool = mysql
  .createPool({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "myDb",
  })
  .promise();

var sql =
  "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), spendings INT, savings INT)";
const result = await pool.query(sql);
console.log("Table created");

export async function addUser(username, password, spendings, savings) {
  if (await findUser(username, password)) {
    console.log("User already exists");
    return undefined;
  }
  var sql =
    "INSERT INTO users (username, password, spendings, savings) VALUES (?, ?, ?, ?)";
  const [rows] = await pool.query(sql, [
    username,
    password,
    spendings,
    savings,
  ]);
  console.log("1 record inserted, ID: ");
  console.log(rows);
  return rows;
}

export async function findUser(username, password) {
  var sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  const [rows] = await pool.query(sql, [username, password]);
  console.log("Find user: ");
  console.log(rows[0]);
  return rows[0];
  //   con.connect(function (err) {
  //     if (err) throw err;
  //     con.query(
  //       "SELECT * FROM users WHERE username = ? AND password = ?",
  //       [username, password],
  //       function (error, result, fields) {
  //         if (err) throw err;
  //         console.log("Find user: ");
  //         console.log(result);
  //         return result;
  //       }
  //     );
  //   });
}

export async function updateUserValues(username, password, spendings, savings) {
  console.log("spendings" + spendings);
  var sql =
    "UPDATE users SET spendings = ?, savings = ? WHERE username = ? AND password = ?";
  const [rows] = await pool.query(
    sql,
    [parseFloat(spendings), parseFloat(savings), username + "", password + ""],
    function (err, result) {
      if (err) throw err;
      console.log(result.affectedRows + " record(s) updated");
    }
  );
}

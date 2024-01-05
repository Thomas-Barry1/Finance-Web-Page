import mysql from "mysql2";

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});

con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "mydb",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql =
    "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), spendings INT, savings INT)";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
  });
});

export function addUser(username, password) {
  con.connect(function (err) {
    if (err) throw err;
    if (findUser(username, password) != undefined) {
      console.log("User already exists");
    }
    console.log("Connected!");
    var sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    con.query(sql, [username, password], function (err, result) {
      if (err) throw err;
      console.log("1 record inserted, ID: " + result.insertId);
    });
  });
}

export function findUser(username, password) {
  con.connect(function (err) {
    if (err) throw err;
    con.query(
      "SELECT * FROM accounts WHERE username = ? AND password = ?",
      [username, password],
      function (error, result, fields) {
        if (err) throw err;
        console.log(result);
        return result;
      }
    );
  });
}

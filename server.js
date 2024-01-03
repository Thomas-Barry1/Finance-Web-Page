import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";
import { addUser, findUser } from "./db_connection.js";

const app = express();
const PORT = 3000;

//Initialize variables to 0
var spendings = 0;
var savings = 0;

// //Create connnection to database
// const db = mysql.createConnection({
//   host: "localhost",

//   user: "root",

//   password: "simplilearn",

//   database: "nodemysql",
// });

// // Connect to MySQL
// db.connect((err) => {
//   if (err) {
//     throw err;
//   }
//   console.log("MySql Connected");
// });

// Make static available to public
app.use("/static", express.static("public"));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Serve the Tool Page
app.get("/toolPg", (req, res) => {
  res.sendFile(__dirname + "/toolPg.html");
});

// Serve the Login Page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Serve the About Page
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/about.html");
});

// Serve the Savings Tool Planner Page
app.get("/savings-goal-planner", (req, res) => {
  res.sendFile(__dirname + "/savingsProgress.html");
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// Handle POST request
app.post("/submit", (req, res) => {
  var selection = Number(req.body.selection),
    amount = parseFloat(req.body.amount),
    savingsPercent = parseFloat(req.body.savingsPercent);
  console.log("Received data:", selection, amount, savingsPercent);

  var responseData = { message: "Data received successfully" };
  switch (selection) {
    case 1:
      spendings += amount * (1 - savingsPercent);
      savings += amount * savingsPercent;
      responseData = { message: "Added Money" };
      break;
    case 2:
      responseData = { message: "" + spendings };
      break;
    case 3:
      responseData = { message: "" + savings };
      break;
    case 4:
      spendings -= amount;
      responseData = { message: "Subtracted Money" };
      break;
    case 5: //Reset all values
      spendings = 0;
      savings = 0;
      responseData = { message: "Savings and Spending Cleared" };
    default:
  }
  res.json(responseData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

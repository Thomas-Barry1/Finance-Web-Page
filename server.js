import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";
import { addUser, findUser } from "./db_connection.js";

// For ES6 modules
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = 3000;

//Initialize variables to 0
var spendings = 0;
var savings = 0;

//Initialize __dirname variable since modules don't have it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make static available to public
app.use("/static", express.static("public"));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/index.html"));
});

// Serve the Tool Page
app.get("/toolPg", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/toolPg.html"));
});

// Serve the Login Page
app.get("/login", (req, res) => {
  addUser("John", "Doe");
  res.sendFile(path.join(__dirname, "/html/login.html"));
});

// Serve the Create Login Page
app.get("/newUsr", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/newUsr.html"));
});

// Serve the About Page
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/about.html"));
});

// Serve the Savings Tool Planner Page
app.get("/savings-goal-planner", (req, res) => {
  res.sendFile(path.join(__dirname, "/html/savingsProgress.html"));
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

// http://localhost:3000/auth Log user in
app.post("/auth", async function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;

  // Ensure the input fields exist and are not empty
  if (username && password) {
    try {
      // Execute SQL query that'll select the account from the database based on the specified username and password
      var results = await findUser(username, password);
      console.log("Results in server auth post: " + results);

      // If the account exists
      if (results) {
        // Authenticate the user
        spendings = results.spendings;
        savings = results.savings;
        // Redirect to home page
        response.redirect("/");
      } else {
        response.send("Incorrect Username and/or Password!");
      }
    } catch (error) {
      console.error("Error while querying the database:", error);
      response.send("Error occurred during authentication.");
    } finally {
      // response.end();
    }
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

// http://localhost:3000/auth Log user in
app.post("/register", async function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    var results = await addUser(username, password);
    // If the account exists
    if (results) {
      // Authenticate the user
      spendings = 0;
      savings = 0;
      // Redirect to home page
      response.redirect("/");
    } else {
      response.send("Incorrect Username and/or Password!");
    }
    response.end();
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

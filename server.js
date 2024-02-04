import express from "express";
import session from "express-session";
import path from "path";
import bodyParser from "body-parser";
import { addUser, findUser, updateUserValues } from "./db_connection.js";

// For ES6 modules
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const PORT = 3000;

//Set up session
app.use(express.json());
app.use(
  session({
    secret: "your-secret-key", // Replace with a strong and secure key
    resave: false,
    saveUninitialized: true,
  })
);

//Initialize variables to 0 or nothing
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
  // addUser("John", "Doe", 20, 20);
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

app.get("/getData", (req, res) => {
  // Simulating data retrieval from a database or another source

  res.json({
    spendings: req.session.user.spendings,
    savings: req.session.user.savings,
    username: req.session.user.username,
  });
});

app.use(express.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

// Handle POST request
app.post("/submit", (req, res) => {
  var spendings = parseFloat(req.body.spendings),
    savings = parseFloat(req.body.savings);
  console.log("Received data:", spendings, savings);

  global.spendings = spendings;
  global.savings = savings;

  var username = req.session.user.username;
  var password = req.session.user.password;
  console.log("Username:" + req.session.user.username);
  console.log("Password:" + req.session.user.password);
  console.log("Spendings" + spendings);
  console.log("Savings:" + savings);
  if (username && password && spendings && savings) {
    console.log("Call updateVal function");
    updateUserValues(username, password, spendings, savings);
  }
  var responseData = { message: "Data received successfully" };

  res.json(responseData);
});

// http://localhost:3000/auth Log user in
app.post("/auth", async (request, response) => {
  let user = request.body.username;
  let password = request.body.password;

  if (user && password) {
    try {
      var results = await findUser(user, password);

      if (results) {
        // Store user information in the session
        request.session.user = {
          username: request.body.username,
          password: request.body.password,
          spendings: results.spendings,
          savings: results.savings,
        };

        console.log(
          "User information stored in session:",
          request.session.user
        );

        response.redirect("/");
      } else {
        response.send("Incorrect Username and/or Password!");
      }
    } catch (error) {
      console.error("Error while querying the database:", error);
      response.send("Error occurred during authentication.");
    }
  } else {
    response.send("Please enter Username and Password!");
  }
});

// http://localhost:3000/register Register new user
app.post("/register", async function (request, response) {
  // Capture the input fields
  let username = request.body.username;
  let password = request.body.password;
  // Ensure the input fields exists and are not empty
  if (username && password) {
    // Execute SQL query that'll select the account from the database based on the specified username and password
    var results = await addUser(username, password, spendings, savings);
    // If the account exists
    if (results) {
      // Authenticate the user
      spendings = 0;
      savings = 0;
      request.session.user = {
        username: request.body.username,
        password: request.body.password,
        spendings: spendings,
        savings: savings,
      };
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

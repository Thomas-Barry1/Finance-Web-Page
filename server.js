const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

var spendings = 0;
var savings = 0;

// Make static available to public
app.use("/static", express.static("public"));

// Serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
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
    default:
  }

  // Simulate some processing
  //   const responseData = { message: "Data received successfully" };
  res.json(responseData);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

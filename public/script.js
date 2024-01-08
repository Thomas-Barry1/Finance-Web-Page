var spendings = 0;
var savings = 0;

// Fetch data from the server
async function fetchData() {
  try {
    const response = await fetch("/getData");
    const data = await response.json();
    spendings = data.spendings;
    savings = data.savings;

    // Update the HTML with the retrieved variables
    // document.getElementById(
    //   "variable1"
    // ).innerText = `Variable 1: ${data.variable1}`;
    // document.getElementById(
    //   "variable2"
    // ).innerText = `Variable 2: ${data.variable2}`;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the fetchData function when the page loads
window.onload = fetchData;

//TODO: Switch to get spendings and savings data from server
document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get form values
    var selection = Number(document.getElementById("selection").value);
    var amount = parseFloat(document.getElementById("amount").value);
    var savingsPercent = parseFloat(
      document.getElementById("savingsPercent").value
    );

    var responseData = { message: "Data received successfully" };
    switch (selection) {
      case 1:
        spendings += amount * (1 - savingsPercent / 100);
        savings += (amount * savingsPercent) / 100;
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

    document.getElementById("result").innerText =
      "Result: " + responseData.message;

    /* TODO
    // Create request body
    var requestBody = {
      selection: selection,
      amount: amount,
      savingsPercent: savingsPercent,
    };

    // Send POST request to the server
    fetch("/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the response data on the webpage
        document.getElementById("result").innerText = data.message;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
      */
  });

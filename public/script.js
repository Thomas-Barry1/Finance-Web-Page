document
  .getElementById("calculatorForm")
  .addEventListener("submit", function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get form values
    var selection = document.getElementById("selection").value;
    var amount = document.getElementById("amount").value;
    var savingsPercent = document.getElementById("savingsPercent").value;

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
  });

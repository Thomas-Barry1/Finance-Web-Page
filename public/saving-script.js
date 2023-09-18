// document.getElementById("plus-button").addEventListener("click", move());
var width = 0;
var total = 100; //Default value is 100
function move() {
  var elem = document.getElementById("myBar");
  var currTotal = parseFloat(document.getElementById("total").value);
  if (currTotal != total) {
    width = 0; //Reset to accomodate new total
    total = currTotal;
    elem.style.width = width + "%";
    elem.innerHTML = width + "%";
  } else {
    if (width >= total) {
      width = 0;
    } else {
      width += parseFloat(document.getElementById("progress-amnt").value);
    }
    elem.style.width = (width * 100) / total + "%";
    elem.innerHTML = (width * 100) / total + "%";
  }
}

function addBar() {
  // document.getElementsByClassName("progress-bar").
  console.log("TODO");
}

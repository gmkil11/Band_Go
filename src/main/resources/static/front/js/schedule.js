document.addEventListener("DOMContentLoaded", function () {
  const hourDropdown = document.getElementById("hour-dropdown");
  const minuteDropdown = document.getElementById("minute-dropdown");

  // Populate hours
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    hourDropdown.appendChild(option);
  }

  // Populate minutes
  for (let i = 0; i < 60; i += 5) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : i;
    option.text = i < 10 ? `0${i}` : i;
    minuteDropdown.appendChild(option);
  }
});

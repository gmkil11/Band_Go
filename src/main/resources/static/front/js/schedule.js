document.addEventListener("DOMContentLoaded", function () {
  const datePicker =document.getElementById("datepicker");
  const today = new Date()
  const year = today.getFullYear();
  const month = ('0' + (today.getMonth() + 1)).slice(-2);
  const day = ('0' + today.getDate()).slice(-2);
  datePicker.value = year + '-' + month + '-' + day

  const startHourDropdown = document.getElementById("start-hour-dropdown");
  const startMinuteDropdown = document.getElementById("start-minute-dropdown");

  // Populate hours
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    startHourDropdown.appendChild(option);
  }

  // Populate minutes
  for (let i = 0; i < 60; i += 5) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : i;
    option.text = i < 10 ? `0${i}` : i;
    startMinuteDropdown.appendChild(option);
  }

  const endHourDropdown = document.getElementById("end-hour-dropdown");
  const endMinuteDropdown = document.getElementById("end-minute-dropdown");

  // Populate hours
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    endHourDropdown.appendChild(option);
  }

  // Populate minutes
  for (let i = 0; i < 60; i += 5) {
    const option = document.createElement("option");
    option.value = i < 10 ? `0${i}` : i;
    option.text = i < 10 ? `0${i}` : i;
    endMinuteDropdown.appendChild(option);
  }
});

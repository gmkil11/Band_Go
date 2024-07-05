document.addEventListener("DOMContentLoaded", function () {
  $(document).ready(function () {
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    $.datetimepicker.setLocale("kr");
    $("#startTime").datetimepicker({
      step: 30,
      minDate: 0,
    });
    $("#endTime").datetimepicker({
      step: 30,
      minDate: startTime.value,
    });
  });
});

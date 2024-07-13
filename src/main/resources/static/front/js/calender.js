document.addEventListener("DOMContentLoaded", function () {
  $(document).ready(function () {
    const startTime = document.getElementById("startTime");
    const endTime = document.getElementById("endTime");
    $.datetimepicker.setLocale("en");
    $("#startTime").datetimepicker({
      step: 30,
      minDate: 0,
    });
    $("#endTime").datetimepicker({
      step: 30,
      minDate: startTime.value,
    });
  });

  // 초기화할 날짜 및 시간 형식
  const initialDate = new Date();
  const formattedDate = initialDate
    .toISOString()
    .slice(0, 16)
    .replace("T", " ");

  // DateTimePicker 초기화
  $("#datetimepicker").datetimepicker({
    format: "Y-m-d H:i", // 원하는 날짜 및 시간 형식 설정
    step: 30, // 시간 간격 설정 (예: 30분 간격)
    value: formattedDate, // 초기값 설정
    onChangeDateTime: function (dp, $input) {
      // input 값이 변경될 때 span의 innerHTML 업데이트
      const selectedDate = $input.val();
      $("#datetime-display").text(selectedDate);
    },
  });

  // 아이콘 클릭 시 DateTimePicker 표시
  $("#datetimepicker-icon").on("click", function () {
    $("#datetimepicker").datetimepicker("show"); // DateTimePicker 표시
  });
});

document.addEventListener("DOMContentLoaded", function () {
  $(document).ready(function () {
    $.datetimepicker.setLocale("kr");
  });

  // 초기화할 날짜 및 시간 형식

  // DateTimePicker 초기화
  $("#start-datetimepicker").datetimepicker({
    format: "Y-m-d H:i", // 원하는 날짜 및 시간 형식 설정
    step: 30, // 시간 간격 설정 (예: 30분 간격)
    onChangeDateTime: function (dp, $input) {
      // input 값이 변경될 때 span의 innerHTML 업데이트
      const selectedDate = $input.val();
      $("#start-datetime-display").text(selectedDate);
    },
  });

  // DateTimePicker 초기화
  $("#end-datetimepicker").datetimepicker({
    format: "Y-m-d H:i", // 원하는 날짜 및 시간 형식 설정
    step: 30, // 시간 간격 설정 (예: 30분 간격)
    onChangeDateTime: function (dp, $input) {
      // input 값이 변경될 때 span의 innerHTML 업데이트!
      const selectedDate = $input.val();
      $("#end-datetime-display").text(selectedDate);
    },
  });

  // 아이콘 클릭 시 DateTimePicker 표시
  $("#start-datetimepicker-icon").on("click", function () {
    $("#start-datetimepicker").datetimepicker("show"); // DateTimePicker 표시
  });

  // 아이콘 클릭 시 DateTimePicker 표시
  $("#end-datetimepicker-icon").on("click", function () {
    $("#end-datetimepicker").datetimepicker("show"); // DateTimePicker 표시
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const datePicker = document.getElementById("datepicker");
  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + (today.getMonth() + 1)).slice(-2);
  const day = ("0" + today.getDate()).slice(-2);
  datePicker.value = year + "-" + month + "-" + day;

  const startHourDropdown = document.getElementById("start-hour-dropdown");
  const startMinuteDropdown = document.getElementById("start-minute-dropdown");
  const startAmPmDropdown = document.getElementById("start-AmPm-dropdown");
  const endAmPmDropdown = document.getElementById("end-AmPm-dropdown");

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

  $.datepicker.setDefaults({
    dateFormat: "yy-mm-dd",
    prevText: "이전 달",
    nextText: "다음 달",
    monthNames: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    monthNamesShort: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    dayNames: ["일", "월", "화", "수", "목", "금", "토"],
    dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
    dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
    showMonthAfterYear: true,
    yearSuffix: "년",
  });

  $(function () {
    function updateDatepickerIcons(inst) {
      var prevButton = inst.dpDiv.find(".ui-datepicker-prev");
      var nextButton = inst.dpDiv.find(".ui-datepicker-next");

      // Remove existing icon
      prevButton.children(".ui-icon").remove();
      nextButton.children(".ui-icon").remove();

      // Add custom icon
      prevButton.append('<span class="custom-prev-icon"></span>');
      nextButton.append('<span class="custom-next-icon"></span>');
    }

    $("#datepicker").datepicker({
      prevText: "",
      nextText: "",
      showButtonPanel: true,
      closeText: "확인",
      beforeShow: function (input, inst) {
        setTimeout(function () {
          updateDatepickerIcons(inst);
        }, 1);
      },
      onChangeMonthYear: function (year, month, inst) {
        setTimeout(function () {
          updateDatepickerIcons(inst);
        }, 1);
      },
    });
  });

  // TODO
  /**
   * 0. 공통부분
   *    - startTime과 EndTime의 시간차 표시
   * 1. startAmPm의 값이 오전일 경우
   *    - startHour의 값을 받아옴
   *    - endHour의 옵션값을 startHour보다 큰 값부터 시작되게 옵션 재설정
   *    - startMinuet의 값을 받아옴
   *    - endMinuet의 옵션값을 endMinuet보다 큰 값부터 시작되게  옵션 재설정
   *    - 만약 startHour과 EndHour이 같다면 endminuet의 값이 startMinuet의 값보다 크게 옵션 재설정
   * 2. statAmPm의 값이 오후일 경우
   *    - startHour의 값을 받아옴
   *    - endHour의 옵션값을 startHour보다 큰 값부터 시작되게 옵션 재설정
   *    - startMinuet의 값을 받아옴
   *    - endMinuet의 옵션값을 endMinuet보다 큰 값부터 시작되게  옵션 재설정
   *    - 만약 startHour과 EndHour이 같다면 endminuet의 값이 startMinuet의 값보다 크게 옵션 재설정
   *    - statAmPm이 오후이고 endAmPm이 오전일 경우에는 시간차 표시하는 부분이 다음날이라고 생각하고 계산
   *
   */
  function updateEndTimeOptions() {
    if (startAmPmDropdown.value === "AM") {
    }
  }

  startAmPmDropdown.addEventListener("change", updateEndTimeOptions);
  startHourDropdown.addEventListener("change", updateEndTimeOptions);
  startMinuteDropdown.addEventListener("change", updateEndTimeOptions);
});

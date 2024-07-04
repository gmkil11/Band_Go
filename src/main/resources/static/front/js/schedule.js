document.addEventListener("DOMContentLoaded", async function () {
  const groupId = document.getElementById("group_id_span").innerText;

  if (groupId) {
    renderScheduleMembers(await getUserList(groupId)); // 스케줄 멤버 렌더링 함수 호출
  }

  hideSpinner();

  function getTime(meridiem, hour, minute) {
    let adjustedHour = hour;

    if (meridiem === "PM" && hour !== 12) {
      adjustedHour += 12;
    } else if (meridiem === "AM" && hour === 12) {
      adjustedHour = 0;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}T${String(adjustedHour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00`;
  }

  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      /* 시간 선택 파트 시작 */
      const startMeridiem = document.getElementById(
        "start-meridiem-dropdown",
      ).value;
      const startHour = parseInt(
        document.getElementById("start-hour-dropdown").value,
      );
      const startMinute = parseInt(
        document.getElementById("start-minute-dropdown").value,
      );

      const endMeridiem = document.getElementById(
        "end-meridiem-dropdown",
      ).value;
      const endHour = parseInt(
        document.getElementById("end-hour-dropdown").value,
      );
      const endMinute = parseInt(
        document.getElementById("end-minute-dropdown").value,
      );

      const startTime = getTime(startMeridiem, startHour, startMinute);
      const endTime = getTime(endMeridiem, endHour, endMinute);

      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);

      /* 시간 선택 파트 끝 */

      /* 유저 선택 파트 시작 */
      const selectedUserIds = Array.from(
        document.querySelectorAll(".user-checkbox:checked"),
      ).map((checkbox) => checkbox.value);
      console.log("Selected User IDs:", selectedUserIds);

      /* 유저 선택 파트 끝 */

      /* 노래 선택 파트 시작 */
      const songs = document.getElementById("schedule_songs").value;
      /* 노래 선택 파트 끝 */

      /* 장소 선택 파트 시작 */
      const place = document.getElementById("schedule_place").value;
      /* 장소 선택 파트 끝 */

      /* update_at 파트 시작 */
      let today = new Date();
      const updateTime = today.getFullYear();
      /* update_at 파트 끝 */

      const { data, error } = await client.from("group_schedule").insert([
        {
          group_id: groupId,
          place: place,
          datetime: startTime,
          users: selectedUserIds,
          songs: songs,
          update_at: startTime,
        },
      ]);
      if (error) {
        console.error("Error insert schedule ", error);
      } else {
        console.log("insert schedule successfully:", data);
      }
    });

  function renderScheduleMembers(users) {
    const tableBody = document.getElementById("userTableBody");
    if (!tableBody) return; // tableBody가 없으면 함수 종료

    tableBody.innerHTML = ""; // 기존 내용을 초기화

    users.forEach((user) => {
      console.log("group_id:", user.group_id);
      const row = document.createElement("tr");
      row.classList.add("user-row"); // 클래스 추가

      const img = document.createElement("img");
      img.src = "/img/icons/my_profile.svg";
      row.appendChild(img);

      const div = document.createElement("div");
      div.classList.add("user-text-field");
      row.appendChild(div);

      const nameCell = document.createElement("td");
      nameCell.textContent = user.user_name;
      nameCell.classList.add("user_name_cell");
      div.appendChild(nameCell);

      const introduceCell = document.createElement("td");
      introduceCell.textContent = user.introduce;
      introduceCell.classList.add("introduce_cell");
      div.appendChild(introduceCell);

      let sessions = [];
      try {
        if (user.session) {
          sessions = JSON.parse(user.session);
          console.log(user.user_name, sessions);
        }
      } catch (e) {
        console.error("세션 정보를 파싱하는데 실패했습니다:", e);
      }

      const sessionBox = createSessionBox(sessions); // 유저의 세션 정보에 맞는 박스 생성
      div.appendChild(sessionBox);

      const checkboxCell = document.createElement("td");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = user.id;
      checkbox.classList.add("user-checkbox");
      checkbox.checked = true;
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);

      tableBody.appendChild(row);
    });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const groupId = document.getElementById("group_id_span").innerText;

  if (groupId) {
    renderScheduleMembers(await getUserList(groupId)); // 스케줄 멤버 렌더링 함수 호출
  }

  hideSpinner();

  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      /* 시간 선택 파트 시작 */

      const start_time = document.getElementById("startTime").value;
      const end_time = document.getElementById("endTime").value;
      const formatted_start_time = new Date(start_time).toISOString();
      const formatted_end_time = new Date(end_time).toISOString();

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
          start_time: formatted_start_time,
          end_time: formatted_end_time,
          users: selectedUserIds,
          songs: songs,
          update_at: formatted_start_time,
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

    users.forEach((user, index) => {
      console.log("group_id:", user.group_id);
      const row = document.createElement("tr");
      row.classList.add(`user-row`); // 클래스 추가
      row.classList.add(`user-row-${index}`);

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
      checkbox.classList.add(`user-checkbox`);
      checkbox.classList.add(`user-checkbox-${index}`);
      checkbox.checked = true;
      checkboxCell.appendChild(checkbox);
      row.appendChild(checkboxCell);

      row.addEventListener("click", () => {
        checkbox.checked = !checkbox.checked; // 체크박스 체크 상태 토글
      });

      tableBody.appendChild(row);
    });
  }

  document.querySelector(".add_songs").addEventListener("click", function () {
    const songPopup = document.querySelector(".popup_form");
    showOverlay();
    songPopup.style.display = "block";
    const overlay = document.getElementById("overlay");
    overlay.addEventListener("click", function () {
      hideOverlay();
      songPopup.style.display = "none";
    });
    const cancelButton = document.getElementById("popup_cancel_button");
    cancelButton.addEventListener("click", function () {
      hideOverlay();
      songPopup.style.display = "none";
    });
  });
});

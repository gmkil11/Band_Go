document.addEventListener("DOMContentLoaded", async function () {
  const groupId = document.getElementById("group_id_span").innerText;
  const songPopup = document.querySelector(".popup_form");
  let songIndex = 0;
  let songsList = []; // 곡 목록을 저장할 배열

  showSpinner();

  if (groupId) {
    renderScheduleMembers(await getUserList(groupId)); // 스케줄 멤버 렌더링 함수 호출
    hideOverlay();
  }

  document
    .querySelector("form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      /* 시간 선택 파트 시작 */
      const start_time = document.getElementById("startTime").value;
      const end_time = document.getElementById("endTime").value;

      // 유효한 날짜와 시간인지 확인
      const formatted_start_time = isValidDate(start_time)
        ? new Date(start_time).toISOString()
        : null;
      const formatted_end_time = isValidDate(end_time)
        ? new Date(end_time).toISOString()
        : null;

      if (!formatted_start_time || !formatted_end_time) {
        alert("올바른 날짜와 시간을 입력해 주세요.");
        return; // 날짜가 유효하지 않으면 함수 종료
      }

      /* 유저 선택 파트 시작 */
      const selectedUserIds = Array.from(
        document.querySelectorAll(".user-checkbox:checked"),
      ).map((checkbox) => checkbox.value);
      console.log("Selected User IDs:", selectedUserIds);

      /* 노래 선택 파트 시작 */
      const songs = JSON.stringify(songsList); // JSON 객체를 문자열로 변환
      console.log("Songs JSON:", songs);

      /* 장소 선택 파트 시작 */
      const place = document.getElementById("schedule_place").value;

      /* update_at 파트 시작 */
      let today = new Date();
      const updateTime = today.getFullYear();

      if (!document.querySelector(".popup_form").querySelector(".error")) {
        const { data, error } = await client.from("group_schedule").insert([
          {
            group_id: groupId,
            place: place,
            start_time: formatted_start_time,
            end_time: formatted_end_time,
            users: selectedUserIds,
            songs: songs, // JSON 문자열을 삽입
            update_at: formatted_start_time,
          },
        ]);
        if (error) {
          console.error("Error insert schedule ", error);
        } else {
          console.log("insert schedule successfully:", data);
        }
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

  function updateSongListMessage() {
    const songList = document.getElementById("song_list");
    const emptyMessage = document.getElementById("song_empty_message");

    // song_list_item 클래스를 가진 자식 요소가 있는지 확인
    const hasSongs = songList.querySelectorAll(".song_list_item").length > 0;

    if (hasSongs) {
      emptyMessage.style.display = "none";
    } else {
      emptyMessage.style.display = "block";
    }
  }

  document.querySelector(".add_songs").addEventListener("click", function () {
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

  document
    .getElementById("addSongButton")
    .addEventListener("click", function () {
      const title = document.getElementById("songTitle").value;
      const artist = document.getElementById("songArtist").value;
      let details = document.getElementById("songDetails").value;
      const songList = document.getElementById("song_list");

      validateNullInput(
        document.querySelector(".song_title_box"),
        document.getElementById("songTitle"),
        null,
        document.querySelector(".song_title_error_box"),
      );

      validateNullInput(
        document.querySelector(".song_artist_box"),
        document.getElementById("songArtist"),
        null,
        document.querySelector(".song_artist_error_box"),
      );

      const sanitizedDetails = sanitizeInput(details);

      if (!document.querySelector(".popup_form").querySelector(".error")) {
        const songItem = document.createElement("div");
        songItem.classList.add(`song_list_item`);
        songItem.classList.add(`song_list_${songIndex}`);
        songItem.dataset.index = songIndex; // 인덱스를 데이터 속성으로 추가
        songItem.innerHTML = `
        <p class="song_header"><strong>노래 제목:</strong> ${title} <button class="delete_song_button">삭제</button></p>
        <p><strong>아티스트:</strong> ${artist}</p>
        <p><strong>참고 사항:</strong> ${sanitizedDetails}</p>
      `;
        songList.appendChild(songItem);

        // 새로운 곡을 songsList 배열에 추가
        songsList.push({
          title: title,
          artist: artist,
          details: sanitizedDetails,
        });

        document.getElementById("songTitle").value = "";
        document.getElementById("songArtist").value = "";
        document.getElementById("songDetails").value = "";
        hideOverlay();
        songPopup.style.display = "none";

        updateSongListMessage();

        songIndex++;
        console.log(songsList);
      } else {
        console.log("모든 필드를 입력해주세요.");
      }
    });

  document
    .getElementById("song_list")
    .addEventListener("click", function (event) {
      // 클릭된 요소가 삭제 버튼인지 확인
      if (
        event.target &&
        event.target.classList.contains("delete_song_button")
      ) {
        // 클릭된 삭제 버튼의 부모 요소인 노래 아이템 찾기
        const songItem = event.target.closest(".song_list_item");
        if (songItem) {
          // 노래 아이템에서 인덱스를 추출
          const songIndex = parseInt(songItem.dataset.index, 10);
          console.log("Deleting song with index:", songIndex);

          // 배열에서 해당 곡을 제거
          songsList = songsList.filter((song, index) => index !== songIndex);

          // 노래 아이템 제거
          songItem.remove();
          updateSongListMessage(); // 삭제 후 메시지 업데이트
          console.log(songsList);
        }
      }
    });

  // 날짜가 유효한지 확인하는 함수
  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()); // 유효한 날짜인지 확인
  }
});

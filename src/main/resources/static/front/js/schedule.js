document.addEventListener("DOMContentLoaded", async function () {
  const groupIdElement = document.getElementById("group_id_span");
  const scheduleUuidElement = document.getElementById("schedule_uuid_span");
  const groupId = groupIdElement ? groupIdElement.innerText : null;
  const scheduleUuid = scheduleUuidElement
    ? scheduleUuidElement.innerText
    : null;
  const songPopup = document.querySelector(".popup_form");
  let songIndex = 0;
  let songsList = []; // 곡 목록을 저장할 배열
  let scheduleUsers = []; // 스케줄에 포함된 유저 목록을 저장할 배열

  showSpinner();

  if (groupId) {
    renderScheduleMembers(await getUserList(groupId)); // 스케줄 멤버 렌더링 함수 호출
    hideOverlay();
  }

  if (scheduleUuid) {
    // 스케줄 UUID가 있는 경우 기존 스케줄 데이터를 가져와서 필드에 채워넣기
    const scheduleData = await getScheduleData(scheduleUuid);
    if (scheduleData) {
      document.getElementById("schedule-title").value = scheduleData.title;

      // 날짜를 span에 표시하기
      const startDate = new Date(scheduleData.start_time);
      const endDate = new Date(scheduleData.end_time);

      document.getElementById("start-datetime-display").innerHTML =
        startDate.toLocaleString(); // 시작 시간
      document.getElementById("end-datetime-display").innerHTML =
        endDate.toLocaleString(); // 종료 시간

      document.getElementById("start-datetimepicker").value =
        scheduleData.start_time;
      document.getElementById("end-datetimepicker").value =
        scheduleData.end_time;

      // 나머지 데이터도 채워넣기
      document.getElementById("schedule_place").value = scheduleData.place;
      songsList = Array.isArray(scheduleData.songs) ? scheduleData.songs : [];
      scheduleUsers = Array.isArray(scheduleData.users)
        ? scheduleData.users
        : [];
      updateSongList();
      updateUserCheckboxes(); // 체크박스 상태 업데이트
    }
  }

  const form = document.querySelector("form");
  if (form) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      /* 시간 선택 파트 시작 */
      const start_time = document.getElementById("start-datetimepicker").value;
      const end_time = document.getElementById("end-datetimepicker").value;

      // 유효한 날짜와 시간인지 확인
      const formatted_start_time = isValidDate(start_time)
        ? new Date(start_time).toISOString()
        : null;
      const formatted_end_time = isValidDate(end_time)
        ? new Date(end_time).toISOString()
        : null;

      validateNullInput(
        document.getElementById("start-datetime-display"),
        document.getElementById("start-datetimepicker"),
        null,
        document.querySelector(".start_time_error_box"),
      );
      validateNullInput(
        document.getElementById("end-datetime-display"),
        document.getElementById("end-datetimepicker"),
        null,
        document.querySelector(".end_time_error_box"),
      );

      /* 일정 제목 시작 */
      const title = document.getElementById("schedule-title").value;
      validateNullInput(
        document.querySelector(".schedule_title_box"),
        document.getElementById("schedule-title"),
        null,
        document.querySelector(".schedule_title_error_box"),
      );

      validateNullInput(
        document.querySelector(".schedule_place_box"),
        document.getElementById("schedule_place"),
        null,
        document.querySelector(".place_error_box"),
      );

      /* 유저 선택 파트 시작 */
      const selectedUserIds = Array.from(
        document.querySelectorAll(".user-checkbox:checked"),
      ).map((checkbox) => checkbox.value);

      /* 노래 선택 파트 시작 */
      const songs = JSON.stringify(songsList); // JSON 객체를 문자열로 변환

      /* 장소 선택 파트 시작 */
      const place = document.getElementById("schedule_place").value;

      /* update_at 파트 시작 */
      let today = new Date();
      const updateTime = today.getFullYear();

      if (
        !document.querySelector(".popup_form").querySelector(".error") &&
        !document.querySelector(".add_schedule_form").querySelector(".error")
      ) {
        let data, error;
        if (scheduleUuid) {
          // 스케줄 수정
          ({ data, error } = await client
            .from("group_schedule")
            .update([
              {
                group_id: groupId,
                place: place,
                title: title,
                start_time: formatted_start_time,
                end_time: formatted_end_time,
                users: selectedUserIds,
                songs: songs, // JSON 문자열을 삽입
                update_at: formatted_start_time,
              },
            ])
            .eq("schedule_uuid", scheduleUuid));
        } else {
          // 스케줄 생성
          ({ data, error } = await client.from("group_schedule").insert([
            {
              group_id: groupId,
              place: place,
              title: title,
              start_time: formatted_start_time,
              end_time: formatted_end_time,
              users: selectedUserIds,
              songs: songs, // JSON 문자열을 삽입
              update_at: formatted_start_time,
            },
          ]));
        }

        if (error) {
          console.error("Error saving schedule ", error);
        } else {
          console.log("Schedule saved successfully:", data);
        }
      }
    });
  } else {
    console.error("Form element not found.");
  }

  function renderScheduleMembers(users) {
    const tableBody = document.getElementById("userTableBody");
    if (!tableBody) return; // tableBody가 없으면 함수 종료

    tableBody.innerHTML = ""; // 기존 내용을 초기화

    users.forEach((user, index) => {
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

  function updateUserCheckboxes() {
    // 각 체크박스의 체크 상태를 업데이트하는 함수
    const checkboxes = document.querySelectorAll(".user-checkbox");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = scheduleUsers.includes(checkbox.value);
    });
  }

  function updateSongList() {
    const songList = document.getElementById("song_list");
    if (!songList) {
      console.error("Element with id 'song_list' not found.");
      return;
    }
    songsList.forEach((song, index) => {
      const songItem = document.createElement("div");
      songItem.classList.add(`song_list_item`);
      songItem.classList.add(`song_list_${index}`);
      songItem.dataset.index = index; // 인덱스를 데이터 속성으로 추가
      songItem.innerHTML = `
            <p class="song_header"><strong>노래 제목:</strong> ${song.title} <button type="button" class="delete_song_button">삭제</button></p>
            <p><strong>아티스트:</strong> ${song.artist}</p>
            <p><strong>참고 사항:</strong> ${song.details}</p>
          `;
      songList.appendChild(songItem);
    });
    updateSongListMessage();
  }

  function updateSongListMessage() {
    const songList = document.getElementById("song_list");
    const emptyMessage = document.getElementById("song_empty_message");

    // song_empty_message 요소가 존재하는지 확인
    if (!emptyMessage) {
      console.error("Element with id 'song_empty_message' not found.");
      return;
    }

    // song_list_item 클래스를 가진 자식 요소가 있는지 확인
    const hasSongs = songList.querySelectorAll(".song_list_item").length > 0;

    if (hasSongs) {
      emptyMessage.style.display = "none";
    } else {
      emptyMessage.style.display = "block";
    }
  }

  const addSongsButton = document.querySelector(".add_songs");
  const closeSongPopupButton = document.getElementById("popup_cancel_button");
  const addSongButton = document.getElementById("addSongButton");

  if (addSongsButton) {
    addSongsButton.addEventListener("click", function () {
      showOverlay();
      songPopup.style.display = "block";
      const overlay = document.getElementById("overlay");
      if (overlay) {
        overlay.addEventListener("click", hideOverlay);
      }
    });
  } else {
    console.error("Element with class 'add_songs' not found.");
  }

  if (closeSongPopupButton) {
    closeSongPopupButton.addEventListener("click", function () {
      hideOverlay();
      songPopup.style.display = "none";
    });
  } else {
    console.error("Element with class 'close_song_popup_button' not found.");
  }

  if (addSongButton) {
    addSongButton.addEventListener("click", function () {
      const title = document.getElementById("songTitle").value;
      const artist = document.getElementById("songArtist").value;
      let details = document.getElementById("songDetails").value;
      const youtubeLink = document.getElementById("youtubeLink").value;

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
              <p class="song_header"><strong>노래 제목:</strong> ${title} <button type="button" class="delete_song_button">삭제</button></p>
              <p><strong>아티스트:</strong> ${artist}</p>
              <p><strong>참고 사항:</strong> ${sanitizedDetails}</p>
            `;
        songList.appendChild(songItem);

        // 새로운 곡을 songsList 배열에 추가
        songsList.push({
          title: title,
          artist: artist,
          details: sanitizedDetails,
          youtube: youtubeLink,
        });

        document.getElementById("songTitle").value = "";
        document.getElementById("songArtist").value = "";
        document.getElementById("songDetails").value = "";
        hideOverlay();
        songPopup.style.display = "none";

        updateSongListMessage();

        songIndex++;
      } else {
        console.log("모든 필드를 입력해주세요.");
      }
    });
  } else {
    console.error("Element with class 'add_song_button' not found.");
  }

  const songList = document.getElementById("song_list");
  if (songList) {
    songList.addEventListener("click", function (event) {
      if (
        event.target &&
        event.target.classList.contains("delete_song_button")
      ) {
        const songItem = event.target.closest(".song_list_item");
        if (songItem) {
          const songIndex = parseInt(songItem.dataset.index, 10);

          songsList = songsList.filter((song, index) => index !== songIndex);
          songItem.remove();
          updateSongListMessage();
        }
      }
    });
  } else {
    console.error("Element with id 'song_list' not found.");
  }

  // 날짜가 유효한지 확인하는 함수
  function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
});

async function getScheduleData(uuid) {
  try {
    const { data, error } = await client
      .from("group_schedule")
      .select("*")
      .eq("schedule_uuid", uuid)
      .single();
    if (error) {
      console.error("Error fetching schedule data:", error);
      return null;
    }
    // songs가 문자열로 되어 있다면 JSON.parse로 배열로 변환
    if (data && data.songs) {
      data.songs = JSON.parse(data.songs);
    }
    return data;
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    return null;
  }
}

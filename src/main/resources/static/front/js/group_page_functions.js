// group_page_functions.js

function setupEventListeners(groupId, userId) {
  const profileEditButton = document.querySelector(".profile_edit_button");
  if (profileEditButton) {
    profileEditButton.addEventListener("click", function () {
      window.location.href = "http://localhost:8080/group/edit"; // 수정해야함
    });
  }

  const addScheduleButton = document.getElementById("add_schedule_span");
  if (addScheduleButton) {
    addScheduleButton.addEventListener("click", function () {
      window.location.href = `http://localhost:8080/group/schedule?groupId=${groupId}`;
    });
  }

  const inviteButton = document.getElementById("invite_user");
  if (inviteButton) {
    inviteButton.addEventListener("click", renderInviteUser);
  }

  const inviteCancelButton = document.getElementById("invite_cancel_button");
  if (inviteCancelButton) {
    inviteCancelButton.addEventListener("click", hideInviteUser);
  }

  const copyIcon = document.querySelector(".copy_icon");
  if (copyIcon) {
    copyIcon.addEventListener("click", function () {
      copyInviteLink();
    });
  }
}

async function getScheduleList(groupId) {
  let { data: group_schedule_data, error } = await client
    .from("group_schedule")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    console.log(
      "group_schedule 테이블에서 일정 목록을 가져오는데 실패했습니다.",
      error,
    );
  } else {
    console.log("group에 해당 되는 일정:", group_schedule_data);

    return group_schedule_data;
  }
}

function renderUsers(users) {
  const tableBody = document.getElementById("userTableBody");
  if (!tableBody) return; // tableBody가 없으면 함수 종료

  tableBody.innerHTML = ""; // 기존 내용을 초기화

  users.forEach((user) => {
    console.log("group_id:", user.group_id);
    const row = document.createElement("tr");
    row.classList.add("user-row"); // 클래스 추가

    row.addEventListener("click", () => {
      /*window.location.href = `http://localhost:8080/group/${group.group_id}`;*/
    });

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

    tableBody.appendChild(row);
  });
}

async function getUserNames(userIds) {
  const { data: userProfiles, error } = await client
    .from("user_profile")
    .select("user_name") // 필요한 필드만 선택
    .in("id", userIds); // UID 배열로 쿼리

  if (error) {
    console.error("Error fetching user profiles", error);
    return [];
  }

  return userProfiles.map((profile) => profile.user_name); // 유저 이름 배열 반환
}

async function renderSchedules(schedules, groupId) {
  const tableBody = document.getElementById("scheduleTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  for (const schedule of schedules) {
    const row = document.createElement("tr");
    row.classList.add("schedule-row");

    const headerDiv = document.createElement("div");
    headerDiv.classList.add("schedule_header");

    // uuid
    const scheduleUuid = document.createElement("td");
    scheduleUuid.textContent = schedule.schedule_uuid;
    scheduleUuid.classList.add("schedule_uuid");
    scheduleUuid.style.display = "none";
    headerDiv.appendChild(scheduleUuid);

    // 제목 셀
    const titleCell = document.createElement("td");
    titleCell.textContent = schedule.title;
    titleCell.classList.add("schedule_title");
    headerDiv.appendChild(titleCell);

    // 날짜 셀
    const dateCell = document.createElement("td");
    dateCell.classList.add("schedule_time");
    dateCell.innerHTML = `
      <img src="/img/icons/calender.svg" class="schedule_icon" alt="Calendar Icon">
      ${formatDate(schedule.start_time)} ~ ${formatDate(schedule.end_time)} (${calculateDuration(schedule.start_time, schedule.end_time)}시간)
    `;
    headerDiv.appendChild(dateCell);

    // 장소 셀
    const placeCell = document.createElement("td");
    placeCell.classList.add("schedule_place");
    placeCell.innerHTML = `
      <img src="/img/icons/location.svg" class="schedule_icon" alt="Location Icon">
      ${schedule.place}
    `;
    headerDiv.appendChild(placeCell);

    // 화살표 셀
    const arrowCell = document.createElement("td");
    const arrowIcon = document.createElement("span");
    arrowIcon.textContent = "↓";
    arrowIcon.classList.add("arrow-icon");
    arrowCell.appendChild(arrowIcon);

    // 행에 div와 화살표 추가
    row.appendChild(headerDiv);
    row.appendChild(arrowCell);
    tableBody.appendChild(row);

    // 세부 사항 행 생성
    const detailsRow = document.createElement("tr");
    const detailsCell = document.createElement("td");
    detailsCell.colSpan = 4; // 수정: 5에서 4로 변경
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("schedule-details");

    // Songs
    let songsHtml = "";
    try {
      const scheduleSongs = JSON.parse(schedule.songs);
      scheduleSongs.forEach((song, index) => {
        const youtubeIframe = song.youtube
          ? `<div class="youtube-video-container">
              <iframe src="https://www.youtube.com/embed/${getYouTubeVideoId(song.youtube)}" title="${song.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>`
          : "";

        songsHtml += `
          <div class="schedule_songs_value">
            <div class="songs_header">
              <span class="songs_index">${index + 1}</span>
            </div>
            <div class="songs_body">
              <div class="songs_title_box">
                <span class="songs_title">노래 제목</span>
                <span class="songs_title_value">${song.title}</span>
              </div>
              <div class="songs_artist_box">
                <span class="songs_artist">아티스트</span>
                <span class="songs_artist_value">${song.artist}</span>
              </div>
              ${
                song.details
                  ? `<div class="songs_details_box">
                <span class="songs_details">상세 항목: ${song.details}</span>
              </div>`
                  : ""
              }
              ${youtubeIframe}
            </div>
          </div>`;
      });
    } catch (e) {
      console.error("Parsing schedule songs failed:", e);
    }

    // Users
    let userNamesText = "";
    if (Array.isArray(schedule.users)) {
      const userNames = await getUserNames(schedule.users);
      userNamesText = userNames.join(", ");
    }

    // 수정 버튼 생성
    const editButton = document.createElement("button");
    editButton.textContent = "수정";
    editButton.classList.add("edit-button");

    // 수정 버튼 클릭 이벤트 리스너 추가
    editButton.addEventListener("click", (event) => {
      event.stopPropagation(); // 클릭 이벤트가 행으로 전달되지 않도록 방지
      const uuid = schedule.schedule_uuid;
      window.location.href = `http://localhost:8080/group/schedule?groupId=${groupId}&uuid=${uuid}`;
    });

    // 버튼을 detailsDiv에 추가
    const editButtonContainer = document.createElement("div");
    editButtonContainer.classList.add("edit_button_container");
    editButtonContainer.appendChild(editButton);

    detailsDiv.innerHTML = `
      <div class="songs_container">${songsHtml}</div>
      <div class="members_container">
        <span class="members">참가 멤버: ${userNamesText}</span>
      </div>
    `;
    detailsDiv.appendChild(editButtonContainer);

    detailsCell.appendChild(detailsDiv);
    detailsRow.appendChild(detailsCell);
    tableBody.appendChild(detailsRow);

    // 클릭 이벤트 리스너는 schedule-details가 생성된 후에 추가
    row.addEventListener("click", () => {
      const details = detailsDiv;
      const arrow = arrowIcon;
      if (details.classList.contains("open")) {
        details.classList.remove("open");
        arrow.classList.remove("open");
      } else {
        details.classList.add("open");
        arrow.classList.add("open");
      }
    });
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, "0")}월 ${String(date.getDate()).padStart(2, "0")}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function calculateDuration(startTime, endTime) {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  return Math.abs(endDate - startDate) / 36e5;
}

function getYouTubeVideoId(url) {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : "";
}

function createSessionBox(sessions) {
  const sessionBox = document.createElement("div");
  sessionBox.classList.add("profile_session_box", "group_page_session_box");

  const sessionButtonBox = document.createElement("div");
  sessionButtonBox.classList.add(
    "rows",
    "session_button_box",
    "group_page_session_button",
  );
  sessionBox.appendChild(sessionButtonBox);

  const sessionTypes = [
    {
      class: "vocal_box",
      imgSrc: "/img/icons/vocal.svg",
      text: "vocal",
      textValue: "보컬",
    },
    {
      class: "guitar_box",
      imgSrc: "/img/icons/guitar.svg",
      text: "guitar",
      textValue: "기타",
    },
    {
      class: "bass_box",
      imgSrc: "/img/icons/bass.svg",
      text: "bass",
      textValue: "베이스",
    },
    {
      class: "drum_box",
      imgSrc: "/img/icons/drum.svg",
      text: "drum",
      textValue: "드럼",
    },
    {
      class: "keyboard_box",
      imgSrc: "/img/icons/keyboard.svg",
      text: "keyboard",
      textValue: "건반",
    },
    {
      class: "brass_box",
      imgSrc: "/img/icons/brass.svg",
      text: "brass",
      textValue: "관악",
    },
  ];

  sessionTypes.forEach((session) => {
    if (sessions.includes(session.text)) {
      const label = document.createElement("label");
      label.classList.add(
        "session_buttons",
        "session_checked",
        "session_label",
      );

      const img = document.createElement("img");
      img.src = session.imgSrc;
      img.alt = session.text;
      label.appendChild(img);

      const textNode = document.createTextNode(session.textValue);
      label.appendChild(textNode);

      sessionButtonBox.appendChild(label);
    }
  });

  return sessionBox;
}

function renderInviteUser() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.display = "block";
    overlay.style.opacity = "1";
  }

  const inviteForm = document.querySelector(".invite_form");
  if (inviteForm) {
    inviteForm.style.display = "flex";
  }
}

function hideInviteUser() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.display = "none";
    overlay.style.opacity = "0";
  }

  const inviteForm = document.querySelector(".invite_form");
  if (inviteForm) {
    inviteForm.style.display = "none";
  }
}

function generateInviteLink(span, groupId, userId) {
  if (span) {
    span.textContent = `http://localhost:8080/group/invite?groupId=${groupId}&userId=${userId}`;
  }
}

function copyInviteLink() {
  const copyMessage = document.getElementById("copy_message");
  const textToCopy = document.getElementById("invite_link_span")?.innerText;

  if (!textToCopy) return;

  window.navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      if (copyMessage) {
        // 복사 성공 시 메시지 표시
        copyMessage.style.opacity = "1";
        copyMessage.style.transform = "translateX(-50%) translateY(0)";

        // 2초 후 메시지 숨김
        setTimeout(() => {
          copyMessage.style.opacity = "0";
          copyMessage.style.transform = "translateX(-50%) translateY(10px)";
        }, 2000);
      }
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

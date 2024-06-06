document.addEventListener("DOMContentLoaded", async function () {
  // 로딩 스피너 표시
  document.getElementById("spinner").style.display = "block";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.opacity = "1";

  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;

  await putSpanValue();
  await getGroups();

  async function putSpanValue() {
    try {
      let { data: user_profile, error } = await client
        .from("user_profile")
        .select("*")
        .eq("id", loggedInUserId)
        .limit(1)
        .single(); // 단일 레코드를 가져오도록 설정

      if (error) {
        console.error("Error fetching user profile:", error);
        // 오류 처리
      } else {
        // user_profile 데이터를 사용하여 프로필 설정 등의 작업 수행
        console.log("User profile:", user_profile);

        const userNameSpan = document.getElementById("user_name");
        const locationSpan = document.getElementById("location");
        const introduceSpan = document.getElementById("introduce");

        userNameSpan.innerHTML = user_profile.user_name;
        locationSpan.innerHTML = user_profile.location;
        introduceSpan.innerHTML = user_profile.introduce;

        console.log("세션 항목", user_profile.session);
        const sessionButtons = document.querySelectorAll(".session_buttons");
        const userSessions = user_profile.session;

        if (user_profile.session) {
          sessionButtons.forEach((button) => {
            const sessionName = button.querySelector("img").alt;
            if (userSessions.includes(sessionName)) {
              button.classList.remove("session_no_checked");
              button.classList.add("session_checked");
            }
          });
        }

        const profileEditButton = document.querySelector(
          ".profile_edit_button",
        );
        profileEditButton.addEventListener("click", function () {
          window.location.href = "http://localhost:8080/profile-edit";
        });

        const isPublicSpan = document.getElementById("is_public_span");

        if (user_profile.is_public) {
          isPublicSpan.innerHTML = "프로필 공개";
        } else {
          isPublicSpan.innerHTML = "프로필 비공개";
        }
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      // 오류 처리
    }
  }

  async function getGroups() {
    try {
      let { data: user_group_profile, error } = await client
        .from("user_groups")
        .select("*")
        .eq("user_id", loggedInUserId);

      if (error) {
        console.error("Error fetching user-group profile:", error);
        // 오류 처리
      } else {
        // user_profile 데이터를 사용하여 프로필 설정 등의 작업 수행
        console.log("유저가 소속되어 있는 그룹:", user_group_profile);

        // user_group_profile은 배열 형태이므로 각 요소의 group_id를 사용하여 groups 테이블에서 조회
        let groupProfiles = [];

        for (const userGroup of user_group_profile) {
          try {
            let { data: group_profile, error } = await client
              .from("groups")
              .select("*")
              .eq("group_id", userGroup.group_id);

            if (error) {
              console.error("Error fetching group profile:", error);
              // 오류 처리
            } else {
              console.log("그룹목록:", group_profile);
              groupProfiles.push(...group_profile); // 여러 개의 그룹이 반환될 수 있으므로 배열 병합
            }
          } catch (error) {
            console.error("Error getting group profile:", error);
            // 오류 처리
          }
        }

        // 최종 그룹 목록
        console.log("최종 그룹 목록:", groupProfiles);
        renderGroups(groupProfiles);

        // groupProfiles 배열을 사용하여 추가 작업 수행 가능
        // 예: groupProfiles 데이터를 화면에 렌더링하거나 다른 로직 처리
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      // 오류 처리
    } finally {
      // 로딩 스피너 숨김
      document.getElementById("spinner").style.display = "none";
      overlay.style.opacity = "0"; // 투명도를 0으로 설정하여 사라지도록 함
      setTimeout(() => {
        overlay.style.display = "none"; // 로딩 중 오버레이 숨김
      }, 500); // 0.5초 후에 오버레이 숨김
    }
  }

  function renderGroups(groups) {
    const tableBody = document.getElementById("groupTableBody");
    tableBody.innerHTML = ""; // 기존 내용을 초기화

    groups.forEach((group) => {
      console.log("group_id:", group.group_id);
      const row = document.createElement("tr");
      row.classList.add("group-row"); // 클래스 추가

      row.addEventListener("click", () => {
        window.location.href = `http://localhost:8080/group/${group.group_id}`;
      });

      const img = document.createElement("img");
      img.src = "/img/icons/my_profile.svg";
      row.appendChild(img);

      const div = document.createElement("div");
      div.classList.add("group-text-field");

      row.appendChild(div);

      const nameCell = document.createElement("td");
      nameCell.textContent = group.group_name;
      div.appendChild(nameCell);

      const introduceCell = document.createElement("td");
      introduceCell.textContent = group.group_introduce;
      div.appendChild(introduceCell);

      tableBody.appendChild(row);
    });
  }
});

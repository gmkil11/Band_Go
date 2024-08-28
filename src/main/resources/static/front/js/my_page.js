document.addEventListener("DOMContentLoaded", async function () {
  showSpinner();


  console.log(getLoggedInUserId());
  const loggedInUserId = getLoggedInUserId()

  await putSpanValue();
  await getGroups();

  document
    .querySelector(".create_group_button")
    .addEventListener("click", function () {
      window.location.href = `http://localhost:8080/group/create`;
    });

  async function putSpanValue() {
    try {
      let { data: user_profile, error } = await client
        .from("user_profile")
        .select("*")
        .eq("id", loggedInUserId)
        .limit(1)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
      } else {
        console.log("User profile:", user_profile);

        const userNameSpan = document.getElementById("user_name");
        const locationSpan = document.getElementById("location");
        const introduceSpan = document.getElementById("introduce");

        userNameSpan.innerHTML = user_profile.user_name;
        locationSpan.innerHTML = user_profile.location;
        introduceSpan.innerHTML = user_profile.introduce;

        const sessionBox = document.querySelector(".profile_session_box");

        const sessionMap = {
          vocal: "#보컬",
          guitar: "#기타",
          bass: "#베이스",
          drum: "#드럼",
          keyboard: "#건반",
          brass: "#관악",
        };

        let userSessions = user_profile.session
          ? user_profile.session.split(",").map((s) => s.trim())
          : [];

        try {
          userSessions = JSON.parse(user_profile.session);
        } catch (error) {
          userSessions = user_profile.session
            .split(",")
            .map((s) => s.trim().toLowerCase());
        }

        if (Array.isArray(userSessions) && userSessions.length > 0) {
          sessionBox.innerHTML = "";
          userSessions.forEach((session) => {
            const normalizedSession = session.trim().toLowerCase();
            if (sessionMap[normalizedSession]) {
              const sessionLabel = document.createElement("span");
              sessionLabel.className = "session_label";
              sessionLabel.textContent = sessionMap[normalizedSession];
              sessionBox.appendChild(sessionLabel);
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
    }
    await getUserImg(loggedInUserId);
  }

  async function getGroups() {
    try {
      let { data: user_group_profile, error } = await client
        .from("user_groups")
        .select("*")
        .eq("user_id", loggedInUserId);

      if (error) {
        console.error("Error fetching user-group profile:", error);
      } else {
        console.log("유저가 소속되어 있는 그룹:", user_group_profile);

        let groupProfiles = [];

        for (const userGroup of user_group_profile) {
          try {
            let { data: group_profile, error: groupError } = await client
              .from("groups")
              .select("*")
              .eq("group_id", userGroup.group_id);

            if (groupError) {
              console.error("Error fetching group profile:", groupError);
            } else {
              let { data: group_members, error: memberError } = await client
                .from("user_groups")
                .select("user_id")
                .eq("group_id", userGroup.group_id);

              if (memberError) {
                console.error("Error fetching group members:", memberError);
              } else {
                console.log("그룹 멤버 목록:", group_members);
                groupProfiles.push({
                  ...group_profile[0],
                  members: group_members,
                });
              }
            }
          } catch (error) {
            console.error("Error getting group profile:", error);
          }
        }

        console.log("최종 그룹 목록:", groupProfiles);

        // 모든 이미지가 로드될 때까지 기다림
        await renderGroups(groupProfiles);
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
    } finally {
      hideSpinner(); // 그룹 렌더링과 이미지 로드가 완료된 후 스피너 숨김
    }
  }

  async function renderGroups(groups) {
    const tableBody = document.getElementById("groupTableBody");
    tableBody.innerHTML = ""; // 기존 내용을 초기화

    // 모든 그룹 카드의 이미지 로드가 완료될 때까지 기다림
    await Promise.all(
      groups.map(async (group) => {
        const card = document.createElement("div");
        card.classList.add("group-card");

        card.addEventListener("click", () => {
          window.location.href = `http://localhost:8080/group/${group.group_id}`;
        });

        const img = document.createElement("img");
        img.classList.add("group-card-image");

        // 그룹 이미지 가져오기
        const { data: imgData } = await client.storage
          .from("group_profile_images")
          .download(`public/${group.group_id}`);

        if (imgData) {
          img.src = URL.createObjectURL(imgData);
        } else {
          img.src = "/img/icons/my_profile.svg"; // 이미지가 없거나 오류가 발생할 경우 기본 이미지 설정
        }

        card.appendChild(img);

        const content = document.createElement("div");
        content.classList.add("group-card-content");

        const title = document.createElement("div");
        title.classList.add("group-card-title");
        title.textContent = group.group_name;
        content.appendChild(title);

        const intro = document.createElement("div");
        intro.classList.add("group-card-intro");
        intro.textContent = group.group_introduce;
        content.appendChild(intro);

        // 멤버 리스트 추가
        const memberList = document.createElement("div");
        memberList.classList.add("group-card-members");

        const memberNames = await Promise.all(
          group.members.map(async (member) => {
            let { data: user, error } = await client
              .from("user_profile")
              .select("user_name")
              .eq("id", member.user_id)
              .single();

            if (error) {
              console.error("Error fetching user name:", error);
              return "알 수 없는 사용자";
            } else {
              return user.user_name;
            }
          }),
        );

        let memberNamesText = memberNames.join(", ");
        if (memberNamesText.length > 25) {
          memberNamesText = memberNamesText.slice(0, 22) + "...";
        }

        memberList.textContent = memberNamesText;
        content.appendChild(memberList);

        card.appendChild(content);
        tableBody.appendChild(card);
      }),
    );
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  // 로딩 스피너 표시
  document.getElementById("spinner").style.display = "block";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.opacity = "1";

  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;
  const invitedGroupId = document.getElementById(
    "invited_group_id_span",
  ).innerText;
  const invitedUserId = document.getElementById(
    "invited_user_id_span",
  ).innerText;
  const groupNameSpan = document.getElementById("group_name_span");
  const groupIntroduceSpan = document.getElementById("group_introduce_span");
  const invitedUser = document.getElementById("invited_user");
  const invitedGroup = document.getElementById("invited_group");
  const acceptButton = document.querySelector(".accept_button");
  const denyButton = document.querySelector(".deny_button");

  await getGroupAndUserInfo();

  acceptButton.addEventListener("click", saveUserIntoGroup);

  denyButton.addEventListener("click", function () {
    window.location.href = "http://localhost:8080";
  });

  async function getGroupAndUserInfo() {
    const { data: groupData, error: groupError } = await client
      .from("groups")
      .select("*")
      .eq("group_id", invitedGroupId)
      .single();
    if (groupError) {
      console.log("그룹 정보를 가져오는데 에러가 발새했습니다.", groupError);
    } else {
      groupNameSpan.innerHTML = groupData.group_name;
      groupIntroduceSpan.innerHTML = groupData.group_introduce;
    }

    const { data: userData, error: userError } = await client
      .from("user_profile")
      .select("*")
      .eq("id", invitedUserId)
      .single();
    if (userError) {
      console.log("유저 정보를 가져오는데 에러가 발새했습니다.", groupError);
    } else {
      invitedUser.innerHTML = userData.user_name;
      invitedGroup.innerHTML = groupData.group_name;
    }
    hideSpinner();
  }

  async function saveUserIntoGroup() {
    // 먼저 중복 여부를 확인
    const { data: existingUserGroup, error: selectError } = await client
      .from("user_groups")
      .select("*")
      .eq("user_id", loggedInUserId)
      .eq("group_id", invitedGroupId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      console.error("Error checking existing user group", selectError);
      return; // 오류가 발생하면 함수를 종료
    }

    if (existingUserGroup) {
      console.log("User is already in the group.");
      hideSpinner();
      return; // 중복된 경우 함수를 종료
    }

    // 중복이 아닌 경우에만 삽입
    const { data, error } = await client
      .from("user_groups")
      .insert([
        {
          user_id: loggedInUserId,
          group_id: invitedGroupId,
          role: "member",
        },
      ])
      .select();

    if (error) {
      console.error("Error saving user to group", error);
      // 오류 처리
    } else {
      // user_profile 데이터를 사용하여 프로필 설정 등의 작업 수행
      console.log("Group invite profile:", data);
      hideSpinner();
    }
  }

  function hideSpinner() {
    // 로딩 스피너 숨김
    document.getElementById("spinner").style.display = "none";
    overlay.style.opacity = "0"; // 투명도를 0으로 설정하여 사라지도록 함
    setTimeout(() => {
      overlay.style.display = "none"; // 로딩 중 오버레이 숨김
    }, 500); // 0.5초 후에 오버레이 숨김
  }
});

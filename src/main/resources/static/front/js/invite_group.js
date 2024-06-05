document.addEventListener("DOMContentLoaded", async function () {
  // 로딩 스피너 표시
  document.getElementById("spinner").style.display = "block";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.opacity = "1";

  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;
  const groupId = document.getElementById("group_id_span");

  console.log(groupId.innerText);

  await saveUserIntoGroup();

  async function saveUserIntoGroup() {
    const { data, error } = await client
      .from("user_groups")
      .insert([
        {
          user_id: loggedInUserId,
          group_id: groupId.innerText,
          role: "member",
        },
      ])
      .select();

    if (error) {
      console.error("Error save user to group", error);
      // 오류 처리
    } else {
      // user_profile 데이터를 사용하여 프로필 설정 등의 작업 수행
      console.log("group invite profile:", data);
      // 로딩 스피너 숨김
      document.getElementById("spinner").style.display = "none";
      overlay.style.opacity = "0"; // 투명도를 0으로 설정하여 사라지도록 함
      setTimeout(() => {
        overlay.style.display = "none"; // 로딩 중 오버레이 숨김
      }, 500); // 0.5초 후에 오버레이 숨김
    }
  }
});

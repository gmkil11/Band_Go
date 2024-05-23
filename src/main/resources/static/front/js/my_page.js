document.addEventListener("DOMContentLoaded", async function () {
  const userNameSpan = document.getElementById("user_name");
  const locationSpan = document.getElementById("location");
  const introduce = document.getElementById("introduce");
  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;

  await putSpanValue();

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

        sessionButtons.forEach((button) => {
          const sessionName = button.querySelector("img").alt;
          if (userSessions.includes(sessionName)) {
            button.classList.remove("session_no_checked");
            button.classList.add("session_checked");
          }
        });
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      // 오류 처리
    }
  }
});

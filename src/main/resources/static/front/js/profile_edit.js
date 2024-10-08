document.addEventListener("DOMContentLoaded", async function () {
  if (!(await user_group_functions())) {
    window.location.href = "http://localhost:8080/login";
  }

  const introduce = document.getElementById("introduce_input");
  const introduceSpan = document.getElementById("introduce_check_length");
  introduce.addEventListener("input", async function () {
    checkTextLength(introduce, introduceSpan, 100);
  });

  const profileEditForm = document.getElementById("profile_edit_form");
  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;
  console.log("로그인 되어있는 유저:", loggedInUserId);

  await getUserValue();

  checkPublicButton();
  checkSessionButton();
  checkTextLength(introduce, introduceSpan, 100);

  console.log(getUserValue());

  // 원래 닉네임 입력 시 중복 된다고 하는 에러를 막기 위한 변수
  const originalUserName = document.getElementById("user_name_input").value;

  // 프로필 이미지 함수 시작
  const imgInput = document.getElementById("profile_image");
  imgInput.addEventListener("change", async function (event) {
    renderImage(event, "profile_picture_img");
    showSpinner();
    await uploadProfileImage(event, loggedInUserId);
    hideSpinner();
  });

  async function getUserValue() {
    showSpinner();
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

        const userNameInput = document.getElementById("user_name_input");
        const locationInput = document.getElementById("location_input");
        const introduceInput = document.getElementById("introduce_input");
        const publicCheckRadio = document.getElementById("public");
        const noPublicCheckRadio = document.getElementById("no_public");
        const sessionCheckboxes = document.querySelectorAll(
          'input[name="session[]"]',
        );

        userNameInput.value = user_profile.user_name;
        locationInput.value = user_profile.location;
        introduceInput.value = user_profile.introduce;

        if (user_profile.is_public) {
          publicCheckRadio.checked = true;
        }

        if (!user_profile.is_public) {
          noPublicCheckRadio.checked = true;
        }

        console.log("세션 항목", user_profile.session);
        // 체크된 세션 항목에 대해 체크를 설정
        Array.from(sessionCheckboxes).forEach((checkbox) => {
          if (user_profile.session.includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      }
    } catch (error) {
      console.error("Error getting user profile:", error);
      // 오류 처리
    }
    await getUserImg(loggedInUserId);
    hideSpinner();
  }

  const publicButtonBox = document.querySelector(".public_button_box");

  publicButtonBox.addEventListener("click", checkPublicButton);

  function checkPublicButton() {
    const publicButtonBox = document.querySelector(".public_button");
    const publicButton = document.getElementById("public");
    const nonPublicButtonBox = document.querySelector(".no_public_button");
    const nonPublicButton = document.getElementById("no_public");

    if (publicButton.checked) {
      publicButtonBox.classList.add("public_checked");
      nonPublicButtonBox.classList.add("public_no_checked");
      publicButtonBox.classList.remove("public_no_checked");
      nonPublicButtonBox.classList.remove("public_checked");
    }

    if (nonPublicButton.checked) {
      publicButtonBox.classList.add("public_no_checked");
      nonPublicButtonBox.classList.add("public_checked");
      publicButtonBox.classList.remove("public_checked");
      nonPublicButtonBox.classList.remove("public_no_checked");
    }
  }

  const sessionButtonBox = document.querySelector(".session_button_box");

  sessionButtonBox.addEventListener("click", checkSessionButton);
  function checkSessionButton() {
    const vocal = document.getElementById("vocal");
    const vocalBox = document.querySelector(".vocal_box");
    const guitar = document.getElementById("guitar");
    const guitarBox = document.querySelector(".guitar_box");
    const bass = document.getElementById("bass");
    const bassBox = document.querySelector(".bass_box");
    const drum = document.getElementById("drum");
    const drumBox = document.querySelector(".drum_box");
    const keyboard = document.getElementById("keyboard");
    const keyboardBox = document.querySelector(".keyboard_box");
    const brass = document.getElementById("brass");
    const brassBox = document.querySelector(".brass_box");

    if (vocal.checked) {
      vocalBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!vocal.checked) {
      vocalBox.classList.replace("session_checked", "session_no_checked");
    }

    if (guitar.checked) {
      guitarBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!guitar.checked) {
      guitarBox.classList.replace("session_checked", "session_no_checked");
    }

    if (bass.checked) {
      bassBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!bass.checked) {
      bassBox.classList.replace("session_checked", "session_no_checked");
    }

    if (drum.checked) {
      drumBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!drum.checked) {
      drumBox.classList.replace("session_checked", "session_no_checked");
    }

    if (keyboard.checked) {
      keyboardBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!keyboard.checked) {
      keyboardBox.classList.replace("session_checked", "session_no_checked");
    }

    if (brass.checked) {
      brassBox.classList.replace("session_no_checked", "session_checked");
    }
    if (!brass.checked) {
      brassBox.classList.replace("session_checked", "session_no_checked");
    }
  }

  profileEditForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const userName = document.getElementById("user_name_input");
    const userNameBox = document.querySelector(".name_input_box");
    const userNameIcon = document.getElementById("user_name_icon");
    const userNameError = document.querySelector(".user_name_error_box");
    const userNameErrorSpan = document.querySelector(".name_error_span");
    const location = document.getElementById("location_input");
    const locationBox = document.querySelector(".location_input_box");
    const locationIcon = document.getElementById("location_icon");
    const locationError = document.querySelector(".location_error_box");
    const introduce = document.getElementById("introduce_input");
    const introduceBox = document.querySelector(".introduce_input_box");
    const introduceIcon = document.getElementById("introduce_icon");
    const introduceError = document.querySelector(".introduce_error_box");
    const isPublic = document.querySelector(
      'input[name="is_public"]:checked',
    ).value;
    const sessionCheckboxes = document.querySelectorAll(
      'input[name="session[]"]:checked',
    );
    const checkedSessions = Array.from(sessionCheckboxes).map(
      (checkbox) => checkbox.value,
    );

    console.log("username", userName.value);
    console.log("location", location.value);
    console.log("introduce", introduce.value);
    console.log("isPublic", isPublic.value);
    console.log("Checked sessions:", checkedSessions);

    validateNullInput(userNameBox, userName, userNameIcon, userNameError);
    validateNullInput(locationBox, location, locationIcon, locationError);
    validateNullInput(introduceBox, introduce, introduceIcon, introduceError);

    console.log("originalName:", originalUserName.value);
    console.log("inputtedUserName:", userName.value);
    if (originalUserName !== userName.value) {
      await checkDuplicateUserName(
        userName,
        userNameBox,
        userNameIcon,
        userNameError,
        userNameErrorSpan,
      );
    }
    if (!profileEditForm.querySelector(".error")) {
      const { data: userNameData, error: updateNameError } = await client
        .from("users")
        .update({
          user_name: userName.value,
        })
        .eq("id", loggedInUserId);

      // 사용자 프로필 정보 업데이트
      const { data: userProfileData, error: updateProfileError } = await client
        .from("user_profile")
        .update({
          location: location.value,
          introduce: introduce.value,
          is_public: isPublic,
          session: checkedSessions,
          updated_at: new Date(),
        })
        .eq("id", loggedInUserId);

      if (updateNameError || updateProfileError) {
        console.error("Error updating user Name profile:", updateNameError);
        console.error("Error updating user profile:", updateProfileError);
      } else {
        console.log("User name updated successfully:", userNameData);
        console.log("User profile updated successfully:", userProfileData);
        window.location.href = "http://localhost:8080/mypage";
        // 업데이트가 성공한 후에 작업 수행.
      }
    }
  });

  const cancelButton = document.querySelector(".cancel_button");
  cancelButton.addEventListener("click", goToMainPage);
  function goToMainPage() {
    /*window.location.href = "http://localhost:8080";*/
    window.history.back();
  }
});

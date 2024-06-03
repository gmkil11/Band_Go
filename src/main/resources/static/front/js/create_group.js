document.addEventListener("DOMContentLoaded", async function () {
  if (!(await checkLogin())) {
    window.location.href = "http://localhost:8080/login";
  }

  const groupEditForm = document.getElementById("group_edit_form");
  const authInfo = await client.auth.getSession();
  const loggedInUserId = authInfo.data.session.user.id;

  console.log("로그인 되어있는 유저:", loggedInUserId);

  const publicButtonBox = document.querySelector(".public_button_box");

  const originalGroupName = document.getElementById("group_name_input").value;
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

  groupEditForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const groupName = document.getElementById("group_name_input");
    const groupNameInputBox = document.querySelector(".group_input_box");
    const groupNameIcon = document.getElementById("group_name_icon");
    const groupNameError = document.querySelector(".group_name_error_box");
    const groupNameErrorSpan = document.querySelector(".name_error_span");
    const groupIntroduce = document.getElementById("introduce_input");
    const isPublic = document.querySelector(
      'input[name="is_public"]:checked',
    ).value;
    const groupUuid = document.querySelector(".group_uuid").innerText;

    console.log("groupname", groupName);
    console.log("introduce", groupIntroduce);
    console.log("isPublic", isPublic);
    console.log("uuid:", groupUuid);

    console.log("originalGroupName :", originalGroupName);
    console.log("inputtedGroupName: ", groupName.value);
    await checkDuplicateGroupName(
      groupName,
      groupNameInputBox,
      groupNameIcon,
      groupNameError,
      groupNameErrorSpan,
    );

    if (!groupEditForm.querySelector(".error")) {
      const { data: userGroupData, error: userGroupError } = await client
        .from("user_groups")
        .insert({
          user_id: loggedInUserId,
          group_id: groupUuid,
          role: "master",
        });

      // 그룹 생성
      const { data: userProfileData, error: updateProfileError } = await client
        .from("groups")
        .insert({
          group_id: groupUuid,
          group_name: groupName.value,
          group_introduce: groupIntroduce.value,
          is_public: isPublic,
          /*updated_at: new Date(),*/
        });

      if (userGroupError || updateProfileError) {
        console.error("Error updating user Name profile:", userGroupError);
        console.error("Error updating user profile:", updateProfileError);
      } else {
        console.log("User name updated successfully:", userGroupData);
        console.log("User profile updated successfully:", userProfileData);

        /*window.location.href = "http://localhost:8080/mypage";*/
        // 업데이트가 성공한 후에 작업 수행.
      }
    }
  });

  const cancelButton = document.querySelector(".cancel_button");
  cancelButton.addEventListener("click", goToMainPage);
  function goToMainPage() {
    window.location.href = "http://localhost:8080";
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const groupId = document.getElementById("group_id_span").textContent.trim();

  if (groupId) {
    // 그룹 정보 불러오기
    await getGroupValue(groupId);
    console.log("Updating group with ID:", groupId);
  }

  const groupEditForm = document.getElementById("group_edit_form");

  // 그룹 이미지 함수 시작
  const imgInput = document.getElementById("group_image");
  imgInput.addEventListener("change", async function (event) {
    renderImage(event, "group_picture_img");
    showSpinner();
    await uploadGroupImage(event, groupId);
    hideSpinner();
  });

  getGroupImg(groupId);

  groupEditForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const groupName = document.getElementById("group_name_input").value;
    const groupIntroduce = document.getElementById("introduce_input").value;
    const isPublic = document.querySelector(
      'input[name="is_public"]:checked',
    ).value;

    // 서버로 데이터 전송
    if (groupId) {
      // 그룹 수정 로직
      await updateGroup(groupId, groupName, groupIntroduce, isPublic);
    }

    // 페이지 이동 또는 성공 메시지 표시
    window.location.href = `http://localhost:8080/group/${groupId}`;
  });

  const cancelButton = document.querySelector(".cancel_button");
  cancelButton.addEventListener("click", () => window.history.back());

  async function getGroupValue(groupId) {
    try {
      let { data: group, error } = await client
        .from("groups")
        .select("*")
        .eq("group_id", groupId)
        .single();

      if (error) {
        console.error("Error fetching group:", error);
      } else {
        document.getElementById("group_name_input").value = group.group_name;
        document.getElementById("introduce_input").value =
          group.group_introduce;
        document.getElementById(
          group.is_public ? "public" : "no_public",
        ).checked = true;
      }
    } catch (error) {
      console.error("Error getting group:", error);
    }
  }

  async function updateGroup(groupId, groupName, groupIntroduce, isPublic) {
    try {
      console.log("Group ID:", groupId);
      console.log("Group Name:", groupName);
      console.log("Group Introduce:", groupIntroduce);
      console.log("Is Public:", isPublic);

      const { data, error } = await client
        .from("groups")
        .update({
          group_name: groupName,
          group_introduce: groupIntroduce,
          is_public: isPublic,
          updated_at: new Date(),
        })
        .eq("group_id", groupId);

      if (error) {
        console.error("Error updating group:", error);
      } else {
        console.log("Group updated successfully:", data);
      }
    } catch (error) {
      console.error("Error updating group:", error);
    }
  }
});

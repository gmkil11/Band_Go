document.addEventListener("DOMContentLoaded", async function () {
  const profileEditButton = document.querySelector(".profile_edit_button");

  profileEditButton.addEventListener("click", function () {
    window.location.href = "http://localhost:8080/group/edit"; // 수정해야함
  });

  await getUserList();

  async function getUserList() {
    const groupId = document.getElementById("group_id_span").innerText;

    let { data: user_groups, error } = await client
      .from("user_groups")
      .select("*")
      .eq("group_id", groupId);

    if (error) {
      console.log(
        "user_groups 테이블에서 유저 목록을 가져오는데 실패했습니다.",
        error,
      );
    } else {
      console.log("user_groups 해당 되는 유저id:", user_groups);

      // user_id 목록을 수집
      const userIds = user_groups.map((userGroup) => userGroup.user_id);

      let { data: user_profiles, error: profileError } = await client
        .from("user_profile")
        .select("*")
        .in("id", userIds);

      if (profileError) {
        console.log(
          "user_profile 테이블에서 유저 프로필을 가져오는데 실패했습니다.",
          profileError,
        );
        return;
      }

      console.log("user_profiles:", user_profiles);
      renderUsers(user_profiles);
    }
  }

  function renderUsers(users) {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = ""; // 기존 내용을 초기화

    users.forEach((users) => {
      console.log("group_id:", users.group_id);
      const row = document.createElement("tr");
      row.classList.add("user-row"); // 클래스 추가

      row.addEventListener("click", () => {
        /*window.location.href = `http://localhost:8080/group/${group.group_id}`;*/
      });

      const img = document.createElement("img");
      img.src = "/img/icons/my_profile.svg";
      row.appendChild(img);

      const div = document.createElement("div");
      div.classList.add("group-text-field");

      row.appendChild(div);

      const nameCell = document.createElement("td");
      nameCell.textContent = users.user_name;
      div.appendChild(nameCell);

      const introduceCell = document.createElement("td");
      introduceCell.textContent = users.introduce;
      div.appendChild(introduceCell);

      tableBody.appendChild(row);
    });
  }
});

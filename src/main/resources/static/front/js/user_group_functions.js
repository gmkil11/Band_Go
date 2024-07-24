async function user_group_functions() {
  const authInfo = await client.auth.getSession();
  const session = authInfo.data.session;
  if (session === null) {
    console.log("로그인 상태 확인 -> 비로그인 상태");
    return false;
  } else {
    console.log("로그인 상태 확인 -> 로그인 상태 user_id:", session.user.id);
    return true;
  }
}

async function getLoggedInUserId() {
  const authInfo = await client.auth.getSession();
  const session = authInfo.data.session;
  const userId = session.user.id;
  console.log("userId:", userId);
  return userId;
}

async function getUserList(groupId) {
  let { data: user_groups, error } = await client
    .from("user_groups")
    .select("*")
    .eq("group_id", groupId);

  if (error) {
    console.log(
      "user_groups 테이블에서 유저 목록을 가져오는데 실패했습니다",
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

    // user_profiles 배열을 정렬하여 master 역할이 있는 유저를 먼저 오게 함
    user_profiles.sort((a, b) => {
      const userA = user_groups.find((userGroup) => userGroup.user_id === a.id);
      const userB = user_groups.find((userGroup) => userGroup.user_id === b.id);
      if (userA.role === "master") return -1;
      if (userB.role === "master") return 1;
      return 0;
    });

    return user_profiles;
  }
}

async function getGroupName(groupId) {
  const { data: groupName, error } = await client
    .from("groups")
    .select("group_name")
    .eq("group_id", groupId)
    .single(); // single()을 사용하여 단일 객체를 반환

  if (error) {
    console.error("그룹명을 가져오는데 에러가 발생했습니다.:", error.message);
    return "";
  }
  return groupName.group_name;
}

async function getUserById(userId) {
  let { data: user_data, error } = await client
    .from("user_profile")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.log("유저 정보를 가져오는데 실패했습니다.");
  } else {
    console.log(user_data);
    return user_data;
  }
}

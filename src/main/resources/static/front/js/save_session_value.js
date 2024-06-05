function saveSessionValue(userId) {
  if (userId) {
    sessionStorage.setItem("user_id", userId);
    console.log("세션에 성공적으로 값을 저장했습니다.", userId);
  } else {
    console.log("userId 값이 들어오지 않았습니다.");
  }
}

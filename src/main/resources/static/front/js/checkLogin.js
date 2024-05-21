async function checkLogin() {
    const authInfo = await client.auth.getSession();
    const session = authInfo.data.session;

    if (session === null) {
        console.log("로그인 상태 확인 -> 비로그인 상태")
        return false
    } else {
        console.log("로그인 상태 확인 -> 로그인 상태")
        return true
    }



}


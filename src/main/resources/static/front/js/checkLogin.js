async function checkLogin() {
    console.log("로그인 상태 체크함")
    const authInfo = await client.auth.getSession();
    const session = authInfo.data.session;
    if (session === null) {
        return false
    } else {
        return true
    }
}
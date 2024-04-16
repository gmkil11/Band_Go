document.addEventListener('DOMContentLoaded', async function () {
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    const authInfo = await client.auth.getSession();
    const session = authInfo.data.session;

    console.log("로그인 페이지 진입.");
    if (session != null) {
        window.location.href = "http://localhost:8080"
    }


    async function signInWithKaKao() {
        const {data, error} = await client.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: "http://localhost:8080/",
            },
        });
    }

    document
        .querySelector("#login_by_kakao")
        .addEventListener("click", signInWithKaKao, console.log("카카오로그인 시도"));


    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        console.log(email.value, password.value);
        const {data, error} = await client.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error) {
            console.error('로그인에 실패했습니다:', error.message);
        } else {
            console.log('로그인이 완료되었습니다:', data);
            window.location.href = "http://localhost:8080"
            // 회원가입 성공 시 다음 페이지로 이동하거나 다른 동작을 수행할 수 있습니다.
            signupButton.setAttribute('type', 'submit'); // 버튼 타입을 submit으로 변경
        }
    });
});
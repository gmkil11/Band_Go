document.addEventListener('DOMContentLoaded', async function () {
    const loginForm = document.getElementById('loginForm');
    const email = document.getElementById('email');
    const emailInputBox = document.querySelector(".email_input_error");
    const emailErrorBox = document.querySelector(".email_error_box");
    const password = document.getElementById('password');
    const passwordInputBox = document.querySelector(".pw_input_error");
    const pwErrorBox = document.querySelector(".pw_error_box");

    const authInfo = await client.auth.getSession();
    const session = authInfo.data.session;



    console.log("로그인 페이지 진입.");
    /*로그인 되어있을 시 메인페이지로 리다이렉션*/
    if (session != null) {
        window.location.href = "http://localhost:8080"
    }


    /*카카오 로그인*/
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
        .addEventListener("click", signInWithKaKao);


    /*이메일 로그인*/
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const emailValue = email.value;
        const passwordValue = password.value;

        if (emailValue === "" || passwordValue === "") {
            if (emailValue === "") {
                // 이매일 재입력시 해당 에러 스타일 삭제하기
                console.log("이메일이 입력되지 않았습니다.");
                if (emailInputBox) {
                    emailInputBox.style.border = '1px solid darkred';
                    emailErrorBox.style.display = 'block';
                }
            }
            if (passwordValue === "") {
                // 패스워드 재입력시 해당 에러 스타일 삭제하기
                console.log("비밀번호가 입력되지 않았습니다.");
                if (passwordInputBox) {
                    passwordInputBox.style.border = '1px solid darkred';
                    pwErrorBox.style.display = 'block';
                }
            }
            return; // 입력값이 없을 경우 함수 종료
        }

        // 이메일과 비밀번호가 모두 입력된 경우
        try {
            const { data, error } = await client.auth.signInWithPassword({
                email: emailValue,
                password: passwordValue
            });

            if (error) {
                console.error('로그인에 실패했습니다:', error.message);
                // 로그인 실패 시 처리 (예: 오류 메시지 표시)
            } else {
                console.log('로그인이 완료되었습니다:', data);
                window.location.href = "http://localhost:8080";
                // 로그인 성공 시 처리 (예: 페이지 이동)
            }

        } catch (error) {
            console.error('로그인 요청 중 오류 발생:', error.message);
            // 로그인 요청 자체에 오류가 발생한 경우 처리
        }
    });


});
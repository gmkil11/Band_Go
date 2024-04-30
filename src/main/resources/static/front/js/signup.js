document.addEventListener('DOMContentLoaded', function() {

    const nameInput = document.getElementById('name')
    const nameInputBox = document.querySelector(".name_input_box");
    const emailInput = document.getElementById('email');
    const emailInputBox = document.querySelector(".email_input_box");
    const phoneInput = document.getElementById('phone')
    const phoneInputBox = document.querySelector(".mobile_input_box");
    const passwordInput = document.getElementById('password');
    const passwordInputBox = document.querySelector(".pw_input_box");
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const pwCheckInputBox = document.querySelector(".pwCheck_input_box");
    const passwordMatchMessage = document.getElementById('passwordMatchMsg');
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('submitButton');
    const errorBox = document.querySelector(".error_box");
    const errorBoxSpan = document.querySelector(".error_box_span");



    async function validateUserName() {
        const {
            data: { user },
        } = await client.auth.getUser()
        let metadata = user.user_metadata
        console.log(user)

    }

    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.textContent = '❌';
        } else {
            passwordMatchMessage.textContent = '✅';
        }

        if (validatePasswordFormat()) {
            console.log('정규화된 비밀번호입니다.')
            errorBox.style.color = "white"
            errorBox.style.background = "white"
            errorBox.style.padding = "0px"
            errorBoxSpan.style.display = "none"
        } else {
            console.log('정규회되지 않은 비밀번호입니다.')
            errorBoxSpan.textContent = "최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함되어야합니다.";
            errorBox.style.color = "black"
            errorBox.style.background = "orange"
            errorBox.style.padding = "20px"
            errorBoxSpan.style.display = "block"
        }
    }

    function validatePasswordFormat() {
        // 최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(confirmPasswordInput.value);
    }

    function validateCheckbox() {
        if (signupForm.querySelector('.unchecked')) {
            console.log('체크박스가 체크되지 않았습니다.');
            errorBoxSpan.textContent = "체크박스 항목을 확인해주세요.";
            errorBox.style.color = "black"
            errorBox.style.background = "orange"
            errorBox.style.padding = "20px"
            errorBoxSpan.style.display = "block"
            return false;
        } else {
            console.log('모든 체크박스가 체크되었습니다.');
            errorBox.style.color = "white"
            errorBox.style.background = "white"
            errorBox.style.padding = "0px"
            errorBoxSpan.style.display = "none"
            return true;
        }
    }

    function validateNullInput() {
        if (nameInput.value === "") {
            nameInputBox.classList.add('error');
            console.log("사용자명 입력안됨");
        } else {
            console.log("사용자명 입력되었음!");
            nameInputBox.classList.remove('error');
        }

        if (emailInput.value === "") {
            emailInputBox.classList.add('error');
            console.log("이메일 입력안됨");
        } else {
            console.log("이메일 입력되었음!");
            emailInputBox.classList.remove('error');
        }

        if (passwordInput.value === "") {
            passwordInputBox.classList.add('error');
            console.log("비밀번호 입력안됨");
        } else {
            console.log("비밀번호 입력되었음!");
            passwordInputBox.classList.remove('error');
        }

        if (confirmPasswordInput.value === "") {
            pwCheckInputBox.classList.add('error');
            console.log("비밀번호 확인 입력안됨");
        } else {
            console.log("비밀번호 확인 입력되었음!");
            pwCheckInputBox.classList.remove('error');
        }

        if (phoneInput.value === "") {
            console.log("휴대전화 입력안됨");
            phoneInputBox.classList.add('error');
        } else {
            console.log("휴대전화 입력되었음!");
            phoneInputBox.classList.remove('error');
        }
    }


    confirmPasswordInput.addEventListener('input', validatePassword);

    signupForm.addEventListener('submit', async function(event) {
        signupButton.setAttribute('type', ''); // 버튼 타입을 null로 변경
        event.preventDefault();
        validateUserName();
        validatePassword(); // 비밀번호 일치 여부 검증
        validateNullInput(); // 인풋 null 여부 검증


        if (validateCheckbox() && !signupForm.querySelector('.error') && passwordInput.value === confirmPasswordInput.value) {
            const { user, error } = await client.auth.signUp({

                email: emailInput.value,
                password: passwordInput.value,
                options: {
                    data: {
                        display_name:nameInput.value,
                        user_name: nameInput.value,
                        phone: phoneInput.value,
                    }
                }
            });

            if (error) {
                console.error('회원가입에 실패했습니다:', error.message);
                if (error.message.includes('registered')) {
                    errorBoxSpan.textContent = "이미 가입된 이메일입니다.";
                    emailInputBox.classList.add('error');
                }
                errorBox.style.display= "block"
                errorBox.style.color = "black"
                errorBox.style.background = "orange"
                errorBox.style.padding = "20px"
                errorBoxSpan.style.display = "block"

            } else {
                console.log('회원가입이 완료되었습니다:', user);
                // 회원가입 성공 시 다음 페이지로 이동하거나 다른 동작을 수행할 수 있습니다.
                signupButton.setAttribute('type', 'submit'); // 버튼 타입을 submit으로 변경
            }
        }
    });
});



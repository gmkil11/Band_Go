document.addEventListener('DOMContentLoaded', function() {

    const nameInput = document.getElementById('name')
    const nameInputBox = document.querySelector(".name_input_box");
    const emailInput = document.getElementById('email');
    const emailInputBox = document.querySelector(".email_input_box");
    const phoneInput = document.getElementById('phone')
    const phoneInputBox = document.querySelector(".mobile_input_box");
    const passwordInput = document.getElementById('password');
    const passwordInputBox = document.querySelector(".pw_input_box");
    const passwordErrorIcon = document.getElementById('passwordErrorIcon');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const pwCheckInputBox = document.querySelector(".pwCheck_input_box");
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('submitButton');
    const errorBox = document.querySelector(".error_box");
    const errorBoxSpan = document.querySelector(".error_box_span");
    const agreeBox = document.querySelector(".agreeBox");


    async function checkDuplicateUserName() {
        try {
            if (nameInput.value === "") {
                nameInputBox.classList.add('error');
                nameInput.classList.add('error');
                nameInput.classList.replace('placeholder', 'error_placeholder');
                console.log("사용자명 입력안됨");
                return false; // 사용자명이 입력되지 않은 경우 false를 반환하여 함수 종료
            } else {

                let {data: users, error} = await client
                    .from('users')
                    .select('user_name')
                    .eq('user_name', nameInput.value);

                console.log('users:', JSON.stringify(users));

                if (error) {
                    console.error('중복 확인 중 오류가 발생했습니다:', error.message);
                    return false;
                }

                if (users && users.length > 0) {
                    showErrorBox(); // 에러박스 표시
                    errorBoxSpan.textContent = "이미 존재하는 회원명입니다.";
                    nameInputBox.classList.add('error');
                    nameInput.classList.add('error');
                    emailInput.classList.replace('placeholder', 'error_placeholder');
                    console.log('이미 존재하는 회원명입니다.');
                    return false;
                }

                console.log('사용 가능한 회원명입니다.');
                nameInputBox.classList.remove('error');
                nameInput.classList.remove('error');
                nameInput.classList.replace('error_placeholder', 'placeholder');
                hideErrorBox(); // 에러박스 숨김
                return true;
            }
        } catch (error) {
            console.error('중복 확인 중 오류가 발생했습니다:', error.message);
            return false;
        }
    }






    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordErrorIcon.style.display = 'block';
            pwCheckInputBox.classList.add('error');
            confirmPasswordInput.classList.add('error');
            confirmPasswordInput.classList.replace('placeholder', 'error_placeholder');
        } else {
            passwordErrorIcon.style.display = 'none';
            pwCheckInputBox.classList.remove('error');
            confirmPasswordInput.classList.remove('error');
            confirmPasswordInput.classList.replace('error_placeholder', 'placeholder');
        }

        if (validatePasswordFormat()) {
            console.log('정규화된 비밀번호입니다.')
            passwordInputBox.classList.remove('error');
            passwordInput.classList.remove('error');
            passwordInput.classList.replace('error_placeholder', 'placeholder');
            hideErrorBox();
        } else {
            console.log('정규회되지 않은 비밀번호입니다.')
            showErrorBox();
            passwordInputBox.classList.add('error');
            passwordInput.classList.add('error');
            passwordInput.classList.replace('placeholder', 'error_placeholder');
            errorBoxSpan.textContent = "최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함되어야합니다.";
        }
    }

    function validatePasswordFormat() {
        // 최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(passwordInput.value);
    }

    function validateCheckbox() {
        if (signupForm.querySelector('.unchecked')) {
            console.log('체크박스가 체크되지 않았습니다.');
            agreeBox.classList.add('error');
            agreeBox.style.border = 'none';
            agreeBox.style.backgroundColor = "#FFFFFF";
            showErrorBox();
            errorBoxSpan.textContent = "체크박스 항목을 확인해주세요.";
            return false;
        } else {
            console.log('모든 체크박스가 체크되었습니다.');
            agreeBox.classList.remove('error');
            hideErrorBox();
            return true;
        }
    }

    function validateNullInput() {

        if (emailInput.value === "") {
            emailInputBox.classList.add('error');
            emailInput.classList.add('error');
            emailInput.classList.replace('placeholder', 'error_placeholder');
            console.log("이메일 입력안됨");
        } else {
            console.log("이메일 입력되었음!");
            emailInputBox.classList.remove('error');
            emailInput.classList.remove('error');
            emailInput.classList.replace('error_placeholder', 'placeholder');
        }

        if (passwordInput.value === "") {
            passwordInputBox.classList.add('error');
            passwordInput.classList.add('error');
            passwordInput.classList.replace('placeholder', 'error_placeholder');
            console.log("비밀번호 입력안됨");
        } else {
            console.log("비밀번호 입력되었음!");
            passwordInputBox.classList.remove('error');
            passwordInput.classList.remove('error');
            passwordInput.classList.replace('error_placeholder', 'placeholder');
        }

        if (confirmPasswordInput.value === "") {
            pwCheckInputBox.classList.add('error');
            confirmPasswordInput.classList.add('error');
            confirmPasswordInput.classList.replace('placeholder', 'error_placeholder');
            console.log("비밀번호 확인 입력안됨");
        } else {
            console.log("비밀번호 확인 입력되었음!");
            pwCheckInputBox.classList.remove('error');
            confirmPasswordInput.classList.remove('error');
            confirmPasswordInput.classList.replace('error_placeholder', 'placeholder');
        }

        if (phoneInput.value === "") {
            console.log("휴대전화 입력안됨");
            phoneInputBox.classList.add('error');
            phoneInput.classList.add('error');
            phoneInput.classList.replace('placeholder', 'error_placeholder');
        } else {
            console.log("휴대전화 입력되었음!");
            phoneInputBox.classList.remove('error');
            phoneInput.classList.remove('error');
            phoneInput.classList.replace('error_placeholder', 'placeholder');
        }
    }

    function showErrorBox() {
        console.log("showErrorBox 함수가 호출되었습니다.");
        errorBox.style.color = "black";
        errorBox.style.background = "orange";
        errorBox.style.padding = "20px";
        errorBoxSpan.style.display = "block";
    }

    function hideErrorBox() {
        console.log("hideErrorBox 함수가 호출되었습니다.");
        errorBox.style.color = "white";
        errorBox.style.background = "white";
        errorBox.style.padding = "0px";
        errorBoxSpan.style.display = "none";
    }

    passwordInput.addEventListener('input', validatePassword);

    signupForm.addEventListener('submit', async function(event) {
        signupButton.setAttribute('type', ''); // 버튼 타입을 null로 변경
        event.preventDefault();
        validatePassword(); // 비밀번호 일치 여부 검증
        validateNullInput(); // 인풋 null 여부 검증
        validateCheckbox(); // 체크박스 검증
        await checkDuplicateUserName();


        if (!signupForm.querySelector('.error') && passwordInput.value === confirmPasswordInput.value) {
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
        } else {
            console.log('error 항목이 존재합니다.')
        }
    });
});



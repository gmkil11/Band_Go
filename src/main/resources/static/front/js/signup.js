document.addEventListener('DOMContentLoaded', function() {

    const nameInput = document.getElementById('name')
    const nameInputBox = document.querySelector(".name_input_box");
    const emailInput = document.getElementById('email');
    const emailInputBox = document.querySelector(".email_input_box");
    const phoneInput = document.getElementById('phone')
    const phoneInputBox = document.querySelector(".phone_input_box");
    const passwordInput = document.getElementById('password');
    const passwordInputBox = document.querySelector(".password_input_box");
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const pwCheckInputBox = document.querySelector(".pwCheck_input_box");
    const passwordMatchMessage = document.getElementById('passwordMatchMsg');
    const signupForm = document.getElementById('signupForm');
    const signupButton = document.getElementById('submitButton');



    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.textContent = '비밀번호가 일치하지 않습니다.';
        } else {
            passwordMatchMessage.textContent = '';
        }
    }






    confirmPasswordInput.addEventListener('input', validatePassword);

    signupForm.addEventListener('submit', async function(event) {
        signupButton.setAttribute('type', ''); // 버튼 타입을 null로 변경
        event.preventDefault();
        validatePassword(); // 비밀번호 일치 여부 검증


        if (nameInput.value === "" || emailInput.value === "" || passwordInput.value === "" || confirmPasswordInput.value === "" || phoneInput.value === "" ){
            if(nameInput.value === "") {
                if (emailInputBox) {
                    nameInputBox.style.border = 'darkred solid 1px';
                    console.log("사용자명 입력")
                } else {
                    nameInputBox.style.border = 'black solid 1px'
                }
            } if (emailInput.value === "") {
                if(emailInput) {
                    emailInputBox.style.border = 'darkred solid 1px';
                    console.log("이메일 입력")
                } else {
                    emailInputBox.style.border = 'black solid 1px';
                }
            } if (passwordInput.value === "") {
                if (passwordInputBox) {
                    passwordInputBox.style.border = 'darkred solid 1px';
                    console.log("비밀번호 입력")
                } else {
                    passwordInputBox.style.border = 'black solid 1px';
                }
            } if (confirmPasswordInput.value === "") {
                if (pwCheckInputBox) {
                    pwCheckInputBox.style.border = 'darkred solid 1px';
                    console.log("비밀번호 확인 입력")
                } else {
                    pwCheckInputBox.style.border = 'black solid 1px';
                }
            } if (phoneInput.value === "") {
                if (phoneInputBox) {
                    console.log("휴대전화 입력")
                    phoneInputBox.style.border = 'darkred solid 1px';
                } else {
                    phoneInputBox.style.border = 'black solid 1px'
                }
            }

        }

        if (passwordInput.value === confirmPasswordInput.value) {
            const { user, error } = await client.auth.signUp({

                email: emailInput.value,
                password: passwordInput.value,
                options: {
                    data: {
                        first_name: nameInput.value,
                        phone: phoneInput.value,
                    }
                }
            });

            if (error) {
                console.error('회원가입에 실패했습니다:', error.message);
            } else {
                console.log('회원가입이 완료되었습니다:', user);
                // 회원가입 성공 시 다음 페이지로 이동하거나 다른 동작을 수행할 수 있습니다.
                signupButton.setAttribute('type', 'submit'); // 버튼 타입을 submit으로 변경
            }
        }
    });
});



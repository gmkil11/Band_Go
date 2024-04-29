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



    function validatePassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            passwordMatchMessage.textContent = '❌';
        } else {
            passwordMatchMessage.textContent = '✅';
        }
    }






    confirmPasswordInput.addEventListener('input', validatePassword);

    signupForm.addEventListener('submit', async function(event) {
        signupButton.setAttribute('type', ''); // 버튼 타입을 null로 변경
        event.preventDefault();
        validatePassword(); // 비밀번호 일치 여부 검증

        // 에러 클래스가 있는지 확인하고, 있으면 회원가입을 막음
        if (signupForm.querySelector('.error')) {
            console.log('에러가 있으므로 회원가입을 실행하지 않습니다.');
            return;
        }

        if (nameInput.value === "" || emailInput.value === "" || passwordInput.value === "" || confirmPasswordInput.value === "" || phoneInput.value === "" ){
            if(nameInput.value === "") {
                nameInputBox.classList.add('error');
                console.log("사용자명 입력안됨")
            } else {
                console.log("사용자명 입력되었음!")
                nameInputBox.classList.remove('error');
            }

            if (emailInput.value === "") {
                emailInputBox.classList.add('error');
                console.log("이메일 입력안됨")
            } else {
                console.log("이메일 입력되었음!")
                emailInputBox.classList.remove('error');
            }

            if (passwordInput.value === "") {
                passwordInputBox.classList.add('error');
                console.log("비밀번호 입력안됨")
            } else {
                console.log("비밀번호 입력되었음!")
                passwordInputBox.classList.remove('error');
            }

            if (confirmPasswordInput.value === "") {
                pwCheckInputBox.classList.add('error');
                console.log("비밀번호 확인 입력안됨")
            } else {
                console.log("비밀번호 확인 입력되었음!")
                pwCheckInputBox.classList.remove('error');
            }

            if (phoneInput.value === "") {
                console.log("휴대전화 입력안됨")
                phoneInputBox.classList.add('error');
            } else {
                console.log("휴대전화 입력되었음!")
                phoneInputBox.classList.remove('error');
            }

        }

        if (!signupForm.querySelector('.error') && passwordInput.value === confirmPasswordInput.value) {
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



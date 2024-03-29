document.addEventListener('DOMContentLoaded', function() {

    const nameInput = document.getElementById('name')
    const phoneInput = document.getElementById('phone')
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
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

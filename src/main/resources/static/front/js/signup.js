document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("name");
  const nameInputBox = document.querySelector(".name_input_box");
  const nameInputIcon = document.getElementById("nameIcon");
  const nameError = document.querySelector(".name_error_box");
  const nameErrorSpan = document.querySelector(".name_error_span");
  const emailInput = document.getElementById("email");
  const emailInputBox = document.querySelector(".email_input_box");
  const emailInputIcon = document.getElementById("emailIcon");
  const emailError = document.querySelector(".email_error_box");
  const passwordInput = document.getElementById("password");
  const passwordInputBox = document.querySelector(".pw_input_box");
  const passwordIcon = document.getElementById("passwordIcon");
  const passwordError = document.querySelector(".pw_error_box");
  const passwordErrorIcon = document.getElementById("passwordErrorIcon");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const confirmPasswordInputBox = document.querySelector(".pwCheck_input_box");
  const confirmPasswordIcon = document.getElementById("confirmPasswordIcon");
  const confirmPasswordError = document.querySelector(".confirmPw_error_box");
  const phoneInput = document.getElementById("phone");
  const phoneInputBox = document.querySelector(".mobile_input_box");
  const phoneIcon = document.getElementById("phoneIcon");
  const phoneError = document.querySelector(".phone_error_box");
  const signupForm = document.getElementById("signupForm");
  const signupButton = document.getElementById("submitButton");
  const errorBox = document.querySelector(".error_box");
  const errorBoxSpan = document.querySelector(".error_box_span");
  const agreeBox = document.querySelector(".agreeBox");

  /*async function checkDuplicateUserName() {
    try {
      if (nameInput.value === "") {
        handleInputError(nameInputBox, nameInput, nameInputIcon, nameError);
        console.log("사용자명 입력안됨");
        return false; // 사용자명이 입력되지 않은 경우 false를 반환하여 함수 종료
      } else {
        let { data: users, error } = await client
          .from("users")
          .select("user_name")
          .eq("user_name", nameInput.value);

        console.log("users:", JSON.stringify(users));

        if (error) {
          console.error("중복 확인 중 오류가 발생했습니다:", error.message);
          return false;
        }

        if (users && users.length > 0) {
          resetInputError(nameInputBox, nameInput, nameInputIcon, nameError);
          showErrorBox(); // 에러박스 표시
          errorBoxSpan.textContent = "이미 존재하는 닉네임입니다.";
          nameInputBox.classList.add("error");
          nameInput.classList.add("error");
          nameInput.classList.replace("placeholder", "error_placeholder");
          handleIconError(nameInputIcon);
          console.log("이미 존재하는 닉네임입니다.");
          return false;
        }

        console.log("사용 가능한 닉네임입니다.");
        nameInputBox.classList.remove("error");
        nameInput.classList.remove("error");
        nameInput.classList.replace("error_placeholder", "placeholder");
        nameError.style.display = "none";
        resetIconError(nameInputIcon);
        hideErrorBox(); // 에러박스 숨김
        return true;
      }
    } catch (error) {
      console.error("중복 확인 중 오류가 발생했습니다:", error.message);
      return false;
    }
  }*/

  async function checkDuplicatePhone() {
    try {
      if (phoneInput.value === "") {
        handleInputError(phoneInputBox, phoneInput, phoneIcon, phoneError);
        console.log("휴대폰 입력안됨");
        return false; // 사용자명이 입력되지 않은 경우 false를 반환하여 함수 종료
      } else {
        if (!validatePhoneNumber(phoneInput.value)) {
          resetInputError(phoneInputBox, phoneInput, phoneIcon, phoneError);
          showErrorBox(errorBox, errorBoxSpan); // 에러박스 표시
          errorBoxSpan.textContent = "올바른 전화번호 형식을 사용해주세요.";
          phoneInputBox.classList.add("error");
          phoneInput.classList.add("error");
          phoneInput.classList.replace("placeholder", "error_placeholder");
          handleIconError(phoneIcon);
          console.log("올바른 전화번호 형식이 아닙니다.");
          return false;
        }

        let { data: users, error } = await client
          .from("users")
          .select("phone")
          .eq("phone", phoneInput.value);

        console.log("phone:", JSON.stringify(users));

        if (error) {
          console.error("중복 확인 중 오류가 발생했습니다:", error.message);
          return false;
        }

        if (users && users.length > 0) {
          resetInputError(phoneInputBox, phoneInput, phoneIcon, phoneError);
          showErrorBox(errorBox, errorBoxSpan); // 에러박스 표시
          errorBoxSpan.textContent = "이미 존재하는 전화번호입니다.";
          phoneInputBox.classList.add("error");
          phoneInput.classList.add("error");
          phoneInput.classList.replace("placeholder", "error_placeholder");
          handleIconError(phoneIcon);
          console.log("이미 존재하는 전화번호입니다.");
          return false;
        }

        console.log("사용 가능한 휴대전화번호입니다.");
        phoneInputBox.classList.remove("error");
        phoneInput.classList.remove("error");
        phoneInput.classList.replace("error_placeholder", "placeholder");
        phoneError.style.display = "none";
        resetIconError(phoneIcon);
        hideErrorBox(errorBox, errorBoxSpan); // 에러박스 숨김
        return true;
      }
    } catch (error) {
      console.error("중복 확인 중 오류가 발생했습니다:", error.message);
      return false;
    }
  }

  function validatePassword() {
    if (passwordInput.value !== confirmPasswordInput.value) {
      console.log("비밀번호가 다릅니다.");
      passwordErrorIcon.style.display = "block";
      confirmPasswordInputBox.classList.add("error");
      confirmPasswordInput.classList.add("error");
      confirmPasswordInput.classList.replace(
        "placeholder",
        "error_placeholder",
      );
      handleIconError(confirmPasswordIcon);
    } else {
      console.log("비밀번호가 일치합니다.");
      passwordErrorIcon.style.display = "none";
      confirmPasswordInputBox.classList.remove("error");
      confirmPasswordInput.classList.remove("error");
      confirmPasswordInput.classList.replace(
        "error_placeholder",
        "placeholder",
      );
      resetIconError(confirmPasswordIcon);
    }

    if (validatePasswordFormat()) {
      console.log("정규화된 비밀번호입니다.");
      passwordInputBox.classList.remove("error");
      passwordInput.classList.remove("error");
      passwordInput.classList.replace("error_placeholder", "placeholder");
      resetIconError(passwordIcon);
      hideErrorBox(errorBox, errorBoxSpan);
    } else {
      console.log("정규회되지 않은 비밀번호입니다.");
      showErrorBox(errorBox, errorBoxSpan);
      passwordInputBox.classList.add("error");
      passwordInput.classList.add("error");
      passwordInput.classList.replace("placeholder", "error_placeholder");
      errorBoxSpan.textContent =
        "최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함되어야합니다.";
      handleIconError(passwordIcon);
    }
  }

  function validatePasswordFormat() {
    // 최소 8글자 이상, 영문 대소문자, 숫자, 특수문자 중 최소 한 글자 이상 포함
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(passwordInput.value);
  }

  function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  }

  function validateCheckbox() {
    if (signupForm.querySelector(".unchecked")) {
      console.log("체크박스가 체크되지 않았습니다.");
      agreeBox.classList.add("error");
      agreeBox.style.border = "none";
      agreeBox.style.backgroundColor = "#FFFFFF";
      showErrorBox(errorBox, errorBoxSpan);
      errorBoxSpan.textContent = "체크박스 항목을 확인해주세요.";
      return false;
    } else {
      console.log("모든 체크박스가 체크되었습니다.");
      agreeBox.classList.remove("error");
      hideErrorBox(errorBox, errorBoxSpan);
      return true;
    }
  }

  /*
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
*/

  passwordInput.addEventListener("input", validatePassword);
  confirmPasswordInput.addEventListener("input", validatePassword);

  phoneInput.addEventListener("focus", function (event) {
    if (event.target.value === "") {
      event.target.value = "010-"; // 전화번호 입력란이 비어있을 때만 "010" 입력
    }
  });

  // 휴대폰 형식 자동 완성
  phoneInput.addEventListener("input", function (event) {
    let phoneNumber = event.target.value.replace(/[^0-9]/g, ""); // 입력된 값에서 숫자만 추출

    // 전화번호가 11자리 이상으로 입력되려고 하면 입력 막음
    if (phoneNumber.length >= 11) {
      phoneNumber = phoneNumber.slice(0, 11); // 11자리 이상 입력되면 초과된 부분을 컷
    }

    if (phoneNumber.length > 3 && phoneNumber.length <= 7) {
      // 입력된 숫자가 3보다 크고 7이하면
      phoneNumber = phoneNumber.replace(/(\d{3})(\d{1,4})/, "$1-$2"); //010-**** 형식으로 변경
    } else if (phoneNumber.length > 7) {
      // 입력된 숫자가 7보다 크면
      phoneNumber = phoneNumber.replace(/(\d{3})(\d{4})(\d{1,4})/, "$1-$2-$3"); //010-****-**** 형식으로 변경
    }

    event.target.value = phoneNumber; // 변환된 번호를 다시 입력 값으로 설정
  });

  signupForm.addEventListener("submit", async function (event) {
    signupButton.setAttribute("type", ""); // 버튼 타입을 null로 변경
    event.preventDefault();

    validatePassword(); // 비밀번호 일치 여부 검증
    validateNullInput(emailInputBox, emailInput, emailInputIcon, emailError); // 이메일 인풋 null 여부 검증
    validateNullInput(
      passwordInput,
      passwordInput,
      passwordIcon,
      passwordError,
    ); // 비밀번호 인풋 null 여부 검증
    validateNullInput(
      confirmPasswordInputBox,
      confirmPasswordInput,
      confirmPasswordIcon,
      confirmPasswordError,
    ); //비밀번호 확인 인풋 null 여부 검증
    validateCheckbox(); // 체크박스 검증

    await checkDuplicatePhone();
    await checkDuplicateUserName(
      nameInput,
      nameInputBox,
      nameInputIcon,
      nameError,
      nameErrorSpan,
      errorBoxSpan,
      errorBox,
    );

    if (
      !signupForm.querySelector(".error") &&
      passwordInput.value === confirmPasswordInput.value
    ) {
      const { user, error } = await client.auth.signUp({
        email: emailInput.value,
        password: passwordInput.value,
        options: {
          data: {
            display_name: nameInput.value,
            user_name: nameInput.value,
            phone: phoneInput.value,
          },
        },
      });

      if (error) {
        console.error("회원가입에 실패했습니다:", error.message);
        if (error.message.includes("registered")) {
          errorBoxSpan.textContent = "이미 가입된 이메일입니다.";
          handleInputError(emailInputBox, emailInput, emailInputIcon, errorBox);
          emailError.style.display = "none";
        }
        errorBox.style.display = "block";
        errorBox.style.color = "black";
        errorBox.style.background = "orange";
        errorBox.style.padding = "20px";
        errorBoxSpan.style.display = "block";
      } else {
        console.log("회원가입이 완료되었습니다:", user);
        // 회원가입 성공 시 로그인 된 상태로 메인페이지 이동
        const { data, error } = await client.auth.signInWithPassword({
          email: emailInput.value,
          password: passwordInput.value,
        });

        if (error) {
          console.error("로그인에 실패했습니다:", error.message);
          window.location.href = "http://localhost:8080/login";
        } else {
          console.log("로그인이 완료되었습니다:", data);
          window.location.href = "http://localhost:8080/profileEdit";
        }
      }
    } else {
      console.log("error 항목이 존재합니다.");
    }
  });
});

document.addEventListener("DOMContentLoaded", async function () {
  const loginForm = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const emailInputBox = document.querySelector(".email_input_error");
  const emailInputBoxIcon = document.getElementById("emailIcon");
  const emailErrorBox = document.querySelector(".email_error_box");
  const emailErrorSpan = document.getElementById("emailErrorSpan");
  const password = document.getElementById("password");
  const passwordInputBox = document.querySelector(".pw_input_error");
  const passwordInputBoxIcon = document.getElementById("passwordIcon");
  const pwErrorBox = document.querySelector(".pw_error_box");
  const passwordErrorSpan = document.getElementById("passwordErrorSpan");
  const errorBox = document.querySelector(".error_box");
  const errorBoxSpan = document.querySelector(".error_box_span");

  console.log("로그인 페이지 진입.");

  /*로그인 시 메인페이지로 리다이렉션*/
  const authInfo = await client.auth.getSession();
  const session = authInfo.data.session;
  if (session != null) {
    console.log(session);
    window.location.href = "http://localhost:8080";
  }

  /*카카오 로그인*/
  async function signInWithKaKao() {
    const { data, error } = await client.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: "http://localhost:8080/",
      },
    });
    if (error) {
      console.error("로그인에 실패했습니다:", error.message);
      displayErrorBox();
    } else {
      console.log("로그인이 완료되었습니다:", data.url);
      window.location.href = "http://localhost:8080";
    }
  }

  document
    .querySelector("#login_by_kakao")
    .addEventListener("click", signInWithKaKao);

  function validateEmailFormat() {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
    return emailRegex.test(email.value);
  }

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailValue = email.value;
    const passwordValue = password.value;

    if (emailValue === "" || passwordValue === "") {
      if (emailValue === "") {
        console.log("이메일이 입력되지 않았습니다.");
        handleInputError(
          emailInputBox,
          email,
          emailInputBoxIcon,
          emailErrorBox,
          emailErrorSpan,
          "이메일이 입력되지 않았습니다.",
        );
      } else {
        if (!validateEmailFormat()) {
          console.log("이메일 형식이 잘못되었습니다.");
          handleInputError(
            emailInputBox,
            email,
            emailInputBoxIcon,
            emailErrorBox,
            emailErrorSpan,
            "이메일 형식이 잘못되었습니다.",
          );
        } else {
          resetInputError(
            emailInputBox,
            email,
            emailInputBoxIcon,
            emailErrorBox,
          );
        }
      }
      if (passwordValue === "") {
        console.log("비밀번호가 입력되지 않았습니다.");
        handleInputError(
          passwordInputBox,
          password,
          passwordInputBoxIcon,
          pwErrorBox,
          passwordErrorSpan,
          "비밀번호가 입력되지 않았습니다.",
        );
      } else {
        resetInputError(
          passwordInputBox,
          password,
          passwordInputBoxIcon,
          pwErrorBox,
        );
      }
      return; // 입력값이 없을 경우 함수 종료
    }

    // 이메일과 비밀번호가 모두 입력된 경우
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });

      if (error) {
        console.error("로그인에 실패했습니다:", error.message);
        displayErrorBox();
      } else {
        console.log("로그인이 완료되었습니다:", data);
        saveSessionValue(data.session.user.id);
        window.location.href = "http://localhost:8080";
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error.message);
      // 로그인 요청 자체에 오류가 발생한 경우 처리
    }
  });

  function handleInputError(
    inputBox,
    inputElement,
    iconElement,
    errorBox,
    errorSpan,
    errorSpanText,
  ) {
    inputBox.style.border = "1px solid #D23123";
    inputBox.style.backgroundColor = "#FFEBEB";
    inputElement.style.backgroundColor = "#FFEBEB";
    iconElement.style.filter =
      "invert(20%) sepia(93%) saturate(3205%) hue-rotate(354deg) brightness(89%) contrast(83%)";
    errorBox.style.display = "flex";
    errorBox.style.color = "#D23123";
    inputElement.classList.replace("placeholder", "error_placeholder");
    errorSpan.innerHTML = errorSpanText;
  }

  function resetInputError(inputBox, inputElement, iconElement, errorBox) {
    inputBox.style.border = "1px solid #76819C";
    inputBox.style.backgroundColor = "#FFFFFF";
    inputElement.style.backgroundColor = "#FFFFFF";
    iconElement.style.filter =
      "invert(54%) sepia(12%) saturate(692%) hue-rotate(185deg) brightness(91%) contrast(89%)";
    errorBox.style.display = "none";
    inputElement.classList.replace("error_placeholder", "placeholder");
  }

  function displayErrorBox() {
    errorBox.style.display = "block";
    errorBox.style.color = "black";
    errorBox.style.background = "orange";
    errorBox.style.padding = "20px";
    errorBoxSpan.style.display = "block";
  }
});

async function checkDuplicateUserName(
  nameInput,
  nameInputBox,
  nameInputIcon,
  nameError,
  nameErrorSpan,
  errorBoxSpan = null,
  errorBox = null,
) {
  try {
    if (nameInput.value === "") {
      handleInputError(
        nameInputBox,
        nameInput,
        nameInputIcon,
        nameError,
        errorBox,
      );

      console.log("사용자명 입력안됨");
      nameErrorSpan.innerHTML = "회원명이 입력되지 않았습니다.";
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
        resetInputError(
          nameInputBox,
          nameInput,
          nameInputIcon,
          nameError,
          errorBox,
        );
        if (errorBoxSpan && errorBox) {
          // errorBoxSpan과 errorBox가 전달된 경우에만 에러박스 표시
          showErrorBox(errorBox, errorBoxSpan); // 에러박스 표시
          errorBoxSpan.textContent = "이미 존재하는 회원명입니다.";
        }
        handleInputError(
          nameInputBox,
          nameInput,
          nameInputIcon,
          nameError,
          errorBox,
        );
        /*        nameInputBox.classList.add("error");
        nameInput.classList.add("error");
        nameInput.classList.replace("placeholder", "error_placeholder");*/
        handleIconError(nameInputIcon);
        nameErrorSpan.innerHTML = "이미 존재하는 회원명입니다.";
        console.log("이미 존재하는 회원명입니다.");
        return false;
      }

      console.log("사용 가능한 회원명입니다.");
      resetInputError(
        nameInputBox,
        nameInput,
        nameInputIcon,
        nameError,
        errorBox,
      );
      /*      nameInputBox.classList.remove("error");
      nameInput.classList.remove("error");
      nameInput.classList.replace("error_placeholder", "placeholder");
      nameError.style.display = "none";*/
      resetIconError(nameInputIcon);
      if (errorBoxSpan && errorBox) {
        // errorBoxSpan과 errorBox가 전달된 경우에만 에러박스 숨김
        hideErrorBox(errorBox, errorBoxSpan); // 에러박스 숨김
      }
      return true;
    }
  } catch (error) {
    console.error("중복 확인 중 오류가 발생했습니다:", error.message);
    return false;
  }
}

function validateNullInput(inputBox, input, inputIcon, inputError) {
  if (input.value === "") {
    handleInputError(inputBox, input, inputIcon, inputError);
    console.log("인풋 항목 입력안됨");
  } else {
    console.log("인풋 항목 입력되었음!");
    resetInputError(inputBox, input, inputIcon, inputError);
  }
}

function handleInputError(inputBox, inputElement, iconElement, errorBox) {
  inputBox.classList.add("error");
  inputElement.classList.add("error");
  handleIconError(iconElement);
  errorBox.style.display = "flex";
  errorBox.style.color = "#D23123";
  inputElement.classList.replace("placeholder", "error_placeholder");
}

function resetInputError(inputBox, inputElement, iconElement, errorBox) {
  inputBox.classList.remove("error");
  inputElement.classList.remove("error");
  resetIconError(iconElement);
  errorBox.style.display = "none";
  inputElement.classList.replace("error_placeholder", "placeholder");
}

function handleIconError(Icon) {
  Icon.style.filter =
    "invert(20%) sepia(93%) saturate(3205%) hue-rotate(354deg) brightness(89%) contrast(83%)";
}

function resetIconError(Icon) {
  Icon.style.filter =
    "invert(54%) sepia(12%) saturate(692%) hue-rotate(185deg) brightness(91%) contrast(89%)";
}

function showErrorBox(errorBox, errorBoxSpan) {
  console.log("showErrorBox 함수가 호출되었습니다.");
  errorBox.style.color = "black";
  errorBox.style.background = "orange";
  errorBox.style.padding = "20px";
  errorBoxSpan.style.display = "block";
}

function hideErrorBox(errorBox, errorBoxSpan) {
  console.log("hideErrorBox 함수가 호출되었습니다.");
  errorBox.style.color = "white";
  errorBox.style.background = "white";
  errorBox.style.padding = "0px";
  errorBoxSpan.style.display = "none";
}

function checkTextLength(inputElement, spanElement, maximumLength) {
  if (inputElement.value.length <= maximumLength) {
    spanElement.innerHTML = inputElement.value.length + "/" + maximumLength;
  } else {
    inputElement.value = inputElement.value.substring(0, maximumLength);
  }
}

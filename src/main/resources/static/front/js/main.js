document.addEventListener('DOMContentLoaded', async function () {

    document.querySelector("#loggedIn").style.display = "none";
    document.querySelector("#NotLoggedIn").style.display = "none";

    // `checkLogin()` 함수를 await 키워드와 함께 호출하여 비동기적으로 실행합니다.
    if (await checkLogin()) {
        document.querySelector("#loggedIn").style.display = "inline";
    } else {
        document.querySelector("#NotLoggedIn").style.display = "inline";
    }

    var dropdown1 = document.querySelector(".dropdown_bar1");
    var dropdownContent1 = document.querySelector(".dropdown_content1");
    var dropdown2 = document.querySelector(".dropdown_bar2");
    var dropdownContent2 = document.querySelector(".dropdown_content2");

    dropdown1.addEventListener("click", function () {
        if (dropdownContent1.style.display === "block") {
            dropdownContent1.style.display = "none";
        } else {
            dropdownContent1.style.display = "block";
            dropdownContent2.style.display = "none";
        }
    });

    dropdown2.addEventListener("click", function () {
        if (dropdownContent2.style.display === "block") {
            dropdownContent2.style.display = "none";
        } else {
            dropdownContent2.style.display = "block";
            dropdownContent1.style.display = "none";
        }
    });

})

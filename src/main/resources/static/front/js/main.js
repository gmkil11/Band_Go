document.addEventListener("DOMContentLoaded", async function () {
  /*document.querySelector("#loggedIn").style.display = "none";
  document.querySelector("#NotLoggedIn").style.display = "none";

  if (await user_group_functions()) {
    document.querySelector("#loggedIn").style.display = "flex";
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
  });*/
  const sideMenuButton = document.querySelector(".side_menu_button");
  const sideMenu = document.querySelector(".side-nav");
  const sideMenuContent = document.querySelector(".side-nav-contents-box");
  const sideMenuCloseButton = document.querySelector(".side-nav-close-button");
  const overlay = document.getElementById("overlay");
  const popup = document.querySelectorAll(".popup");

  sideMenuButton.addEventListener("click", function () {
    console.log("사이드 메뉴 버튼 클릭됨");
    showOverlay();
    sideMenu.style.width = "20%";
    setTimeout(() => {
      sideMenuContent.style.display = "flex";
    }, 100);
  });
  sideMenuCloseButton.addEventListener("click", function () {
    console.log("사이드 메뉴 닫기 버튼 클릭됨");
    hideOverlay();
    sideMenu.style.width = "0%";
    setTimeout(() => {
      sideMenuContent.style.display = "none";
    }, 100);
  });
  overlay.addEventListener("click", function () {
    hideOverlay();
    sideMenu.style.width = "0%";
    setTimeout(() => {
      sideMenuContent.style.display = "none";
      popup.forEach((popup) => {
        popup.style.display = "none";
      });
    }, 100);
  });
});

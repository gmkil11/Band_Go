document.addEventListener("DOMContentLoaded", async () => {
  const regionSelectPopUp = document.getElementById(
    "region_selection_container",
  );
  const locationInput = document.getElementById("location_input");
  const sidoList = document.getElementById("sido_list");
  const gugunList = document.getElementById("gugun_list");

  let { data: regions, error } = await client.from("regions").select("*");

  if (error) {
    console.log("지역 정보를 불러오는데 오류가 발생했습니다:", error);
    return;
  }

  locationInput.addEventListener("click", function () {
    showOverlay();
    regionSelectPopUp.style.display = "flex";
  });

  document
    .getElementById("popup_cancel_button")
    .addEventListener("click", function () {
      hideOverlay();
      regionSelectPopUp.style.display = "none";
    });

  // 시/도 목록 가져오기
  const sidoOptions = [...new Set(regions.map((region) => region.province))];
  console.log("Sido options:", sidoOptions); // 시/도 옵션 콘솔 출력
  populateList(sidoList, sidoOptions);

  function populateList(listElement, items) {
    listElement.innerHTML = "";
    items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      li.classList.add("list_item");
      listElement.appendChild(li);
    });
  }

  function clearSelected(listElement) {
    const selected = listElement.querySelector(".selected");
    if (selected) {
      selected.classList.remove("selected");
    }
  }

  sidoList.addEventListener("click", (event) => {
    if (event.target.classList.contains("list_item")) {
      clearSelected(sidoList);
      event.target.classList.add("selected");
      const selectedSido = event.target.textContent;
      console.log("Selected Sido:", selectedSido); // 선택된 시/도 콘솔 출력
      const gugunOptions = regions
        .filter((region) => region.province === selectedSido)
        .map((region) => region.city);
      console.log("Gugun options:", gugunOptions); // 구/군 옵션 콘솔 출력
      populateList(gugunList, gugunOptions);
      gugunList.style.display = "block";
      document.getElementById("gugun_container").style.display = "block";
      selectedAddress.textContent = "";
    }
  });

  gugunList.addEventListener("click", (event) => {
    if (event.target.classList.contains("list_item")) {
      clearSelected(gugunList);
      event.target.classList.add("selected");
      const selectedSido = sidoList.querySelector(".selected").textContent;
      const selectedGugun = event.target.textContent;
      document.querySelector(".popup_form").style.display = "none";
      document.getElementById("overlay").style.display = "none";
      locationInput.value = `${selectedSido} ${selectedGugun}`;
    }
  });
});

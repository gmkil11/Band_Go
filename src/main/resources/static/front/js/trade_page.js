document.addEventListener("DOMContentLoaded", async function () {
  const categorySlugs = {
    guitar: "기타",
    acoustic: "어쿠스틱",
    bass: "베이스",
    effect: "이펙터",
    amplifier: "앰프",
    recording: "레코딩",
    drum: "드럼",
    classical: "클래식",
  };

  const categories = {
    기타: 1,
    어쿠스틱: 2,
    베이스: 3,
    이펙터: 4,
    앰프: 5,
    레코딩: 6,
    드럼: 7,
    클래식: 8,
  };

  // URL에서 필터 정보 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get("category");
  const mCategorySlug = urlParams.get("mcategory");
  const minPrice = urlParams.get("minprice");
  const maxPrice = urlParams.get("maxprice");
  const status = urlParams.get("status");

  // 대분류 변경 시 중분류를 업데이트하는 코드
  document
    .getElementById("category")
    .addEventListener("change", async function () {
      const categorySlug = this.value;
      console.log("Selected Category Slug:", categorySlug); // 슬러그 확인용 로그
      const categoryName = categorySlugs[categorySlug];
      console.log("Selected Category Name:", categoryName); // 대분류 이름 확인용 로그
      const parentCategoryId = categories[categoryName];
      console.log("Selected Category ID:", parentCategoryId); // ID 확인용 로그
      const mCategorySelect = document.getElementById("mCategory");

      console.log("Selected Category ID:", parentCategoryId); // 확인용 로그

      if (parentCategoryId) {
        // 중분류를 가져오기 위해 API 호출
        const subCategories = await getSubCategories(parentCategoryId);

        console.log("Fetched Subcategories:", subCategories); // 확인용 로그

        // 중분류 옵션 초기화
        mCategorySelect.innerHTML = '<option value="">전체</option>';

        // 새로운 중분류 옵션 추가
        subCategories.forEach((subCategory) => {
          const option = document.createElement("option");
          option.value = subCategory.id;
          option.textContent = subCategory.name;
          mCategorySelect.appendChild(option);
        });
      } else {
        mCategorySelect.innerHTML = '<option value="">전체</option>';
      }
    });

  // 필터가 적용되었는지 확인
  const filterApplied =
    categorySlug || mCategorySlug || minPrice || maxPrice || status;

  // 필터가 적용된 경우 인디케이터 색상을 변경
  if (filterApplied) {
    const filterIndicator = document.querySelector(".is_filter_on");
    if (filterIndicator) {
      filterIndicator.style.backgroundColor = "#ADE863";
    }

    // 필터 인풋 필드에 URL 파라미터 값을 적용
    if (categorySlug) {
      document.getElementById("category").value = categorySlug;

      // 대분류가 선택되었을 때 중분류 옵션을 로드
      const categoryName = categorySlugs[categorySlug];
      const parentCategoryId = categories[categoryName];

      if (parentCategoryId) {
        // 중분류를 가져오기 위해 API 호출
        const subCategories = await getSubCategories(parentCategoryId);

        const mCategorySelect = document.getElementById("mCategory");
        mCategorySelect.innerHTML = '<option value="">전체</option>';

        // 중분류 옵션 추가
        subCategories.forEach((subCategory) => {
          const option = document.createElement("option");
          option.value = subCategory.id;
          option.textContent = subCategory.name;
          mCategorySelect.appendChild(option);
        });

        // 중분류 값 설정 (중분류가 로드된 후에 설정해야 함)
        if (mCategorySlug) {
          document.getElementById("mCategory").value = mCategorySlug;
        }
      }
    }

    if (minPrice) {
      document.getElementById("minPrice").value = formatPriceValue(minPrice);
    }
    if (maxPrice) {
      document.getElementById("maxPrice").value = formatPriceValue(maxPrice);
    }
    if (status) document.getElementById("status").value = status;
  }

  const limit = 5;

  // URL 파라미터에 따라 필터링된 결과 가져오기
  if (categorySlug) {
    const categoryName = categorySlugs[categorySlug];
    const locatorSpan = document.querySelector(".locator_span");

    if (categoryName) {
      const locationElement = document.createElement("span");
      locationElement.innerHTML = " &nbsp;>&nbsp; ";

      const categoryLink = document.createElement("a");
      categoryLink.textContent = categoryName;
      categoryLink.href = `http://localhost:8080/trade?category=${categorySlug}`;

      locatorSpan.appendChild(locationElement); // " > " 추가
      locatorSpan.appendChild(categoryLink); // 카테고리 링크 추가

      const parentCategoryId = categories[categoryName];
      const categoryIds = await getSubCategoryIds(parentCategoryId); // ID 배열만 사용
      categoryIds.push(parentCategoryId);

      const filter = {
        categoryIds: categoryIds,
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        status: status,
        subCategoryIds: mCategorySlug ? [parseInt(mCategorySlug)] : [], // 중분류 필터 추가
      };

      const products = await fetchProducts(limit, filter);
      renderCategory(categoryName, products);
    } else {
      console.error("Invalid category slug provided:", categorySlug);
    }
  } else {
    const filter = {
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      status: status,
    };

    for (let [categoryName, parentCategoryId] of Object.entries(categories)) {
      const categoryIds = await getSubCategoryIds(parentCategoryId); // ID 배열만 사용
      categoryIds.push(parentCategoryId);

      filter.categoryIds = categoryIds;

      const products = await fetchProducts(limit, filter);
      renderCategory(categoryName, products);
    }
  }

  // 상품 추가 페이지 리다이랙션 기능
  const tradeAddBtn = document.querySelector(".add-trade-area");
  tradeAddBtn.addEventListener("click", function () {
    window.location.href = `http://localhost:8080/trade/add`;
  });

  // 필터링 팝업과 필터 기능
  const filterPopup = document.getElementById("filterPopup");
  const filterBtn = document.querySelector(".filter-btn-area");
  const closeBtn = document.querySelector(".close-btn");
  const filterReset = document.getElementById("filterReset");

  filterReset.addEventListener("click", function () {
    document.getElementById("category").value = "";
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("status").value = "";
  });

  filterBtn.addEventListener("click", function () {
    filterPopup.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    filterPopup.style.display = "none";
  });

  document.getElementById("minPrice").addEventListener("input", function () {
    formatPriceInput(this);
  });

  document.getElementById("maxPrice").addEventListener("input", function () {
    formatPriceInput(this);
  });

  // 가격 입력 필드에 백스페이스 처리를 위한 이벤트 리스너 추가
  document.getElementById("minPrice").addEventListener("keydown", function (e) {
    if (e.key === "Backspace") {
      let inputValue = this.value.replace(/[^\d]/g, "");
      inputValue = inputValue.slice(0, -1); // 마지막 숫자 제거

      if (inputValue.length > 0) {
        this.value = new Intl.NumberFormat().format(inputValue) + "원";
      } else {
        this.value = "";
      }

      e.preventDefault();
    }
  });

  document.getElementById("maxPrice").addEventListener("keydown", function (e) {
    if (e.key === "Backspace") {
      let inputValue = this.value.replace(/[^\d]/g, "");
      inputValue = inputValue.slice(0, -1); // 마지막 숫자 제거

      if (inputValue.length > 0) {
        this.value = new Intl.NumberFormat().format(inputValue) + "원";
      } else {
        this.value = "";
      }

      e.preventDefault();
    }
  });

  document.getElementById("applyFilter").addEventListener("click", function () {
    const category = document.getElementById("category").value;
    const mCategory = document.getElementById("mCategory").value;
    let minPrice = document
      .getElementById("minPrice")
      .value.replace(/[^0-9]/g, "");
    let maxPrice = document
      .getElementById("maxPrice")
      .value.replace(/[^0-9]/g, "");
    const status = document.getElementById("status").value;

    const queryString = new URLSearchParams({
      category: category || "",
      mcategory: mCategory || "", // 중분류 파라미터 추가
      minprice: minPrice || "",
      maxprice: maxPrice || "",
      status: status || "",
    }).toString();

    window.location.href = `http://localhost:8080/trade?${queryString}`;
  });
});

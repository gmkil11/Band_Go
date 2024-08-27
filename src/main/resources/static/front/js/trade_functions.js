document.addEventListener("DOMContentLoaded", async function () {
  // URL에서 필터 정보 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const categorySlug = urlParams.get("category");
  const mCategorySlug = urlParams.get("mcategory");
  const minPrice = urlParams.get("minprice");
  const maxPrice = urlParams.get("maxprice");
  const status = urlParams.get("status");

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
    if (categorySlug) document.getElementById("category").value = categorySlug;
    if (mCategorySlug)
      document.getElementById("mCategory").value = mCategorySlug;
    if (minPrice) document.getElementById("minPrice").value = minPrice;
    if (maxPrice) document.getElementById("maxPrice").value = maxPrice;
    if (status) document.getElementById("status").value = status;
  }

  // 카테고리 이름과 슬러그 매핑
  const categoryNames = {
    기타: "guitar",
    어쿠스틱: "acoustic",
    베이스: "bass",
    이펙터: "effect",
    앰프: "amplifier",
    레코딩: "recording",
    드럼: "drum",
    클래식: "classical",
  };

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

  const limit = 5;

  // Slug 변환 함수
  function convertToSlug(text) {
    if (!text) {
      console.error("No text provided for slug conversion");
      return null;
    }

    const englishText = categoryNames[text] || text;

    return englishText
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // 상품들을 렌더링하는 함수
  function renderCategory(categoryName, products) {
    console.log("Rendering category:", categoryName);
    const tradeOffers = document.querySelector(".trade-offers");

    const categorySection = document.createElement("div");
    categorySection.classList.add("category-section");

    const header = document.createElement("div");
    header.classList.add("category-header");

    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = categoryName;

    const moreButton = document.createElement("button");
    moreButton.classList.add("more-button");
    moreButton.textContent = "더보기";

    // 더보기 버튼 클릭 시 해당 카테고리 페이지로 이동
    const categorySlug = convertToSlug(categoryName);
    moreButton.addEventListener("click", () => {
      if (categorySlug) {
        window.location.href = `http://localhost:8080/trade?category=${categorySlug}`;
      } else {
        console.error("Category slug is empty or undefined");
      }
    });

    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.appendChild(categoryTitle);
    header.appendChild(moreButton);

    categorySection.appendChild(header);

    const productElementArea = document.createElement("div");
    productElementArea.classList.add("product-item-area");

    products.forEach(async (product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-item");

      const imgSrc = await getProductThumbImg(product);

      productElement.innerHTML = `
        <div class="product-thumbnail-image-area">
          <img class="product-thumbnail-image" src="${imgSrc}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="product-price">${product.price.toLocaleString()}원</p>
          <p class="product-status">상태: ${product.status}</p>
        </div>`;

      productElementArea.appendChild(productElement);
    });

    categorySection.appendChild(productElementArea);
    tradeOffers.appendChild(categorySection);
  }

  // 상품 데이터 가져오는 함수
  async function fetchProducts(limit = 5, filter = {}) {
    try {
      let query = client.from("product").select("*");

      if (filter.categoryIds && filter.categoryIds.length > 0) {
        query = query.in("category_id", filter.categoryIds);
      }

      if (filter.status) {
        query = query.eq("status", filter.status);
      }

      if (filter.minPrice) {
        query = query.gte("price", filter.minPrice);
      }

      if (filter.maxPrice) {
        query = query.lte("price", filter.maxPrice);
      }

      query = query.order("created_at", { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data: products, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        return [];
      }

      return products;
    } catch (error) {
      console.error("Unexpected error fetching products:", error);
      return [];
    }
  }

  // 특정 카테고리의 모든 하위 카테고리 ID를 가져오는 함수
  async function getCategoryIds(parentId) {
    try {
      const { data: categories, error } = await client
        .from("category")
        .select("id")
        .eq("parent_id", parentId);

      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }

      return categories.map((category) => category.id);
    } catch (error) {
      console.error("Unexpected error fetching category IDs:", error);
      return [];
    }
  }

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
      const categoryIds = await getCategoryIds(parentCategoryId);
      categoryIds.push(parentCategoryId);

      const filter = {
        categoryIds: categoryIds,
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        status: status,
      };

      const products = await fetchProducts(limit, filter);
      renderCategory(categoryName, products);
    } else {
      console.error("Invalid category slug provided:", categorySlug);
    }
  } else {
    // 카테고리가 없으면, 모든 대분류에 대해 각 5개씩 가져오기
    const filter = {
      minPrice: minPrice ? parseInt(minPrice) : null,
      maxPrice: maxPrice ? parseInt(maxPrice) : null,
      status: status,
    };

    for (let [categoryName, parentCategoryId] of Object.entries(categories)) {
      const categoryIds = await getCategoryIds(parentCategoryId);
      categoryIds.push(parentCategoryId);

      filter.categoryIds = categoryIds;

      const products = await fetchProducts(limit, filter);
      renderCategory(categoryName, products);
    }
  }

  // 필터링 팝업과 필터 기능
  const filterPopup = document.getElementById("filterPopup");
  const filterBtn = document.getElementById("filterBtn");
  const closeBtn = document.querySelector(".close-btn");

  filterBtn.addEventListener("click", function () {
    filterPopup.style.display = "block";
  });

  closeBtn.addEventListener("click", function () {
    filterPopup.style.display = "none";
  });

  document.getElementById("applyFilter").addEventListener("click", function () {
    const category = document.getElementById("category").value;
    const minPrice = document.getElementById("minPrice").value;
    const maxPrice = document.getElementById("maxPrice").value;
    const status = document.getElementById("status").value;

    const queryString = new URLSearchParams({
      category: category || "",
      minprice: minPrice || "",
      maxprice: maxPrice || "",
      status: status || "",
    }).toString();

    window.location.href = `http://localhost:8080/trade?${queryString}`;
  });
});

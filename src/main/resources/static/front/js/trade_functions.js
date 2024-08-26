document.addEventListener("DOMContentLoaded", async function () {
  // 상품들을 렌더링하는 함수
  function renderCategory(categoryName, products) {
    console.log("renderCategory called with:", categoryName); // 여기서 categoryName이 undefined 인지 확인
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
    console.log("Category Slug generated:", categorySlug); // 여기서 slug 확인

    moreButton.addEventListener("click", () => {
      if (categorySlug) {
        window.location.href = `http://localhost:8080/trade?category=${categorySlug}`;
      } else {
        console.error("Category slug is empty or undefined");
      }
    });

    header.appendChild(categoryTitle);
    header.appendChild(moreButton);

    header.style.display = "flex";
    header.style.justifyContent = "space-between";
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
      </div>
    `;

      productElementArea.appendChild(productElement); // product-item을 product-item-area에 추가
    });

    categorySection.appendChild(productElementArea);
    tradeOffers.appendChild(categorySection);
  }

  // Supabase에서 상품 데이터를 가져오는 함수
  async function fetchProducts(limit = 5, filter = {}) {
    try {
      // Supabase 쿼리 시작
      let query = client.from("product").select("*");

      // 필터 조건이 있으면 쿼리에 추가
      if (filter.categoryIds && filter.categoryIds.length > 0) {
        query = query.in("category_id", filter.categoryIds);
      }

      // 필터 조건이 있다면, 필터에 맞게 데이터 가져옴
      if (filter.status) {
        query = query.eq("status", filter.status);
      }

      // 최신순으로 정렬
      query = query.order("created_at", { ascending: false });

      // 각 카테고리별로 제한된 수의 데이터만 가져오기 위해 동적 쿼리 수행
      if (limit) {
        query = query.limit(limit);
      }

      let { data: products, error } = await query;

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

  // 해당 대분류에 속하는 모든 중분류 ID 가져오기
  async function getCategoryIds(parentId) {
    try {
      let { data: categories, error } = await client
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

  const categorySlugs = {
    기타: "guitar",
    어쿠스틱: "acoustic",
    베이스: "bass",
    이펙터: "effect",
    앰프: "amplifier",
    레코딩: "recording",
    드럼: "drum",
    클래식: "classical",
    // 필요한 다른 카테고리 추가
  };

  function convertToSlug(text) {
    if (!text) {
      console.error("No text provided for slug conversion");
      return null;
    }

    // 한글 카테고리 이름을 영어로 변환
    const englishText = categorySlugs[text] || text;

    return englishText
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  }

  // 대분류별로 5개씩만 가져오도록 설정
  const limit = 5;

  // 대분류별로 데이터를 가져와서 렌더링
  const categories = {
    기타: 1,
    어쿠스틱: 2,
    베이스: 3,
    이펙터: 4,
    앰프: 5,
    레코딩: 6,
    드럼: 7,
    클래식: 8,
    // 필요한 다른 카테고리 추가
  };

  for (let [categoryName, parentCategoryId] of Object.entries(categories)) {
    console.log(
      "Category Name:",
      categoryName,
      "Parent Category ID:",
      parentCategoryId,
    ); // 여기서 categoryName과 parentCategoryId 확인

    const categoryIds = await getCategoryIds(parentCategoryId);
    categoryIds.push(parentCategoryId);

    const products = await fetchProducts(limit, { categoryIds: categoryIds });
    renderCategory(categoryName, products);
  }
});

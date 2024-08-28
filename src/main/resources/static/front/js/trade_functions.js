// Slug 변환 함수
function convertToSlug(text) {
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

  // 더보기 버튼 클릭 시 해당 카테고리 페이지로 이동 (기존 필터 유지)
  const categorySlug = convertToSlug(categoryName);
  moreButton.addEventListener("click", () => {
    if (categorySlug) {
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("category", categorySlug); // 카테고리를 새로운 것으로 설정
      window.location.href = `http://localhost:8080/trade?${urlParams.toString()}`;
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

    if (filter.subCategoryIds && filter.subCategoryIds.length > 0) {
      query = query.in("category_id", filter.subCategoryIds);
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

// 중분류 옵션을 가져오는 함수 (이름과 ID 모두 필요)
async function getSubCategories(parentId) {
  try {
    const { data: categories, error } = await client
      .from("category")
      .select("id, name")
      .eq("parent_id", parentId);

    if (error) {
      console.error("Error fetching subcategories:", error);
      return [];
    }

    return categories; // id와 name을 함께 반환
  } catch (error) {
    console.error("Unexpected error fetching subcategories:", error);
    return [];
  }
}

// 중분류 ID만 가져오는 함수 (쿼리 필터링에 사용)
async function getSubCategoryIds(parentId) {
  try {
    const { data: categories, error } = await client
      .from("category")
      .select("id")
      .eq("parent_id", parentId);

    if (error) {
      console.error("Error fetching category IDs:", error);
      return [];
    }

    return categories.map((category) => category.id); // id만 반환
  } catch (error) {
    console.error("Unexpected error fetching category IDs:", error);
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

function formatPriceInput(inputElement) {
  // 사용자가 입력한 값 가져오기
  let inputValue = inputElement.value;

  // 숫자와 쉼표가 아닌 모든 문자를 제거 (숫자만 남김)
  inputValue = inputValue.replace(/[^\d]/g, "");

  // 입력 값이 있을 경우만 포맷팅 적용
  if (inputValue.length > 0) {
    // 숫자 형식에 맞게 포맷팅
    const formattedValue = new Intl.NumberFormat().format(inputValue);

    // 포맷팅된 값에 "원"을 추가
    inputElement.value = formattedValue + "원";
  }
}

// 가격 값을 포맷팅하는 함수
function formatPriceValue(value) {
  // 숫자 형식에 맞게 포맷팅
  const formattedValue = new Intl.NumberFormat().format(value);

  // 포맷팅된 값에 "원"을 추가
  return formattedValue + "원";
}

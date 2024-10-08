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

    // 상품 클릭 시 리다이렉션
    productElement.addEventListener("click", () => {
      window.location.href = `http://localhost:8080/trade/detail?productId=${product.id}`;
    });

    productElementArea.appendChild(productElement);
  });

  categorySection.appendChild(productElementArea);
  tradeOffers.appendChild(categorySection);
}

// 상품 데이터들을 가져오는 함수
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

// 상품 ID로 상품 정보를 가져오는 함수
async function fetchProductById(productId) {
  try {
    const { data: product, error } = await client
      .from("product")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error.message);
      return null;
    }

    return product;
  } catch (error) {
    console.error("Unexpected error fetching product:", error);
    return null;
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

async function insertProduct(productData) {
  try {
    // 개별 필드의 값 확인
    console.log("Inserting product with ID:", productData.id);
    console.log("User Profile ID:", productData.user_profile_id);

    const { data, error } = await client.from("product").insert([
      {
        id: productData.id, // UUID 형식의 ID
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category_id: productData.category_id,
        thumbnail_image: productData.thumbnail_image,
        detail_images: productData.detail_images,
        status: productData.status,
        user_profile_id: productData.user_profile_id, // UUID 형식의 사용자 프로필 ID
        trade_methods: productData.trade_methods,
      },
    ]);

    if (error) {
      console.error("Error inserting product:", error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Failed to insert product:", err.message);
    throw err;
  }
}

// 카테고리 경로를 렌더링하는 함수
function renderCategoryPath(categoryPath) {
  const breadcrumbContainer = document.querySelector(".product-breadcrumb");

  // 경로를 HTML로 렌더링합니다.
  categoryPath.forEach((category, index) => {
    const categoryLink = document.createElement("a");
    categoryLink.href = category.slug;
    categoryLink.textContent = category.name;

    breadcrumbContainer.appendChild(categoryLink);

    // 마지막 요소가 아니면 ' > '를 추가합니다.
    if (index < categoryPath.length - 1) {
      breadcrumbContainer.appendChild(document.createTextNode(" > "));
    }
  });
}

// 카테고리 경로를 생성하는 함수
async function generateCategoryPath(categoryId) {
  const categoryPath = [];

  try {
    // 대분류 이름 가져오기
    const { data: mainCategory, error: mainCategoryError } = await client
      .from("category")
      .select("id, name, parent_id")
      .eq("id", categoryId)
      .single();

    if (mainCategoryError) {
      console.error("Error fetching main category:", mainCategoryError.message);
      return categoryPath;
    }

    categoryPath.push({ name: "Home", slug: "/trade" });

    if (mainCategory.parent_id) {
      // 중분류가 있는 경우
      const { data: parentCategory, error: parentCategoryError } = await client
        .from("category")
        .select("id, name")
        .eq("id", mainCategory.parent_id)
        .single();

      if (parentCategoryError) {
        console.error(
          "Error fetching parent category:",
          parentCategoryError.message,
        );
        return categoryPath;
      }

      categoryPath.push({
        name: parentCategory.name,
        slug: `/trade?category=${convertToSlug(parentCategory.name)}`,
      });
      categoryPath.push({
        name: mainCategory.name,
        slug: `/trade?category=${convertToSlug(mainCategory.name)}`,
      });
    } else {
      // 중분류가 없는 경우 대분류만 추가
      categoryPath.push({
        name: mainCategory.name,
        slug: `/trade?category=${convertToSlug(mainCategory.name)}`,
      });
    }
  } catch (error) {
    console.error("Error generating category path:", error);
  }

  return categoryPath;
}

// 같은 카테고리에서 판매 중인 상품을 가져오는 함수
async function fetchSimilarProducts(categoryId, excludeProductId) {
  try {
    const { data: products, error } = await client
      .from("product")
      .select("*")
      .eq("category_id", categoryId)
      .neq("id", excludeProductId) // 현재 보고 있는 상품은 제외
      .eq("status", "available") // 판매중인 상품만
      .limit(5); // 5개의 상품만 가져오기

    if (error) {
      console.error("Error fetching similar products:", error.message);
      return [];
    }

    return products;
  } catch (error) {
    console.error("Unexpected error fetching similar products:", error);
    return [];
  }
}

// 비슷한 상품들을 렌더링하는 함수
function renderSimilarProducts(products) {
  const similarProductsList = document.querySelector(".similar-products-list");

  products.forEach(async (product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("similar-product-item");

    const imgSrc = await getProductThumbImg(product);

    productElement.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}">
      <span class="similar-product-item-name">${product.name}</span>
      <span class="similar-product-item-price">${formatPriceValue(product.price)}</span>
    `;

    productElement.addEventListener("click", () => {
      window.location.href = `http://localhost:8080/trade/detail?productId=${product.id}`;
    });

    similarProductsList.appendChild(productElement);
  });
}

// productId를 기반으로 찜 갯수 조회하는 함수
async function getWishCountByProductId(productId) {
  try {
    const { count, error } = await client
      .from("wish")
      .select("wish_uuid", { count: "exact" }) // "exact" 옵션을 사용해 정확한 카운트를 반환
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching wish count:", error.message);
      return 0; // 에러가 발생하면 0으로 반환
    }

    return count || 0; // count 값이 null이면 0 반환
  } catch (error) {
    console.error("Unexpected error fetching wish count:", error);
    return 0; // 에러 발생 시 0 반환
  }
}

// 이미 찜한 상품인지 확인하는 함수
async function isProductWishedByUser(userId, productId) {
  try {
    const { data, error } = await client
      .from("wish")
      .select("wish_uuid")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle(); // 쿼리 결과가 없을 경우 null 반환

    if (error) {
      console.error("Error checking wish status:", error.message);
      return false; // 에러 발생 시 중복 찜이 아니라고 간주
    }

    return !!data; // 데이터가 있으면 true, 없으면 false 반환
  } catch (error) {
    console.error("Unexpected error checking wish status:", error);
    return false;
  }
}

// 찜 추가하기 함수
async function addWish(userId, productId) {
  try {
    // 이미 찜했는지 확인
    const alreadyWished = await isProductWishedByUser(userId, productId);

    if (alreadyWished) {
      alert("이미 찜한 상품입니다.");
      return; // 이미 찜한 상품이면 함수 종료
    }

    // 찜 추가
    const { data, error } = await client.from("wish").insert([
      {
        user_id: userId,
        product_id: productId,
      },
    ]);

    if (error) {
      console.error("Error adding wish:", error.message);
    } else {
      console.log("찜이 성공적으로 추가되었습니다.");
    }
  } catch (error) {
    console.error("Unexpected error adding wish:", error);
  }
}

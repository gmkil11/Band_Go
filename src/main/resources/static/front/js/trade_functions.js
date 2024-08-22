document.addEventListener("DOMContentLoaded", async function () {
  // 상품들을 렌더링하는 함수
  function renderProducts(products) {
    const tradeOffers = document.getElementById("tradeOffers");
    tradeOffers.innerHTML = ""; // 기존 내용을 비움

    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList.add("product-item");
      productElement.innerHTML = `
        <div class="product-image">
          <img src="${product.thumbnail_image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p class="product-price">${product.price.toLocaleString()}원</p>
          <p class="product-status">상태: ${product.status}</p>
        </div>
      `;
      tradeOffers.appendChild(productElement);
    });
  }

  // Supabase에서 상품 데이터를 가져오는 함수
  async function fetchProducts() {
    try {
      let { data: products, error } = await client.from("product").select("*"); // 필요한 필드를 지정할 수도 있습니다. 예: .select('name, price, description, thumbnail_image')

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

  // 페이지 로드 시 상품들을 렌더링합니다.
  const products = await fetchProducts();
  renderProducts(products);
});

document.addEventListener("DOMContentLoaded", async function () {
  const productId = new URLSearchParams(window.location.search).get(
    "productId",
  );
  if (!productId) {
    console.error("Product ID not found in the URL.");
    return;
  }

  try {
    // 상품 정보를 가져오는 함수 호출
    const product = await fetchProductById(productId);
    if (!product) {
      console.error("Product not found.");
      return;
    }

    // 같은 카테고리에서 판매 중인 상품 가져오기
    const similarProducts = await fetchSimilarProducts(
      product.category_id,
      productId,
    );
    renderSimilarProducts(similarProducts);

    // 대분류 및 중분류 이름을 가져오는 함수 호출
    const categoryPath = await generateCategoryPath(product.category_id);

    // 카테고리 경로를 렌더링하는 함수 호출
    if (categoryPath && categoryPath.length > 0) {
      renderCategoryPath(categoryPath);
    } else {
      console.error("Category path is invalid or empty.");
    }
    // 판매자 정보 가져오기
    const user = await getUserById(product.user_profile_id);
    const userNameLink = document.querySelector(".user-name");
    if (user.user_name) {
      userNameLink.textContent = `${user.user_name}`;
    } else {
      document.querySelector(".user-name").textContent =
        "판매자 정보를 가져올 수 없습니다.";
    }
    userNameLink.parentNode.addEventListener("click", function () {
      window.location.href = `http://localhost:8080/mypage?userId=${user.id}`;
    });

    // 상태 변환
    const statusMapping = {
      available: "판매중",
      reserved: "예약중",
      sold: "판매완료",
    };
    const translatedStatus = statusMapping[product.status] || product.status;

    // 거래 방식 변환
    const tradeMethodsMapping = {
      direct: "직거래",
      delivery: "택배",
    };
    const translatedTradeMethods = product.trade_methods
      ? product.trade_methods
          .split(",")
          .map((method) => tradeMethodsMapping[method] || method)
          .join(", ")
      : "거래 방식 정보 없음"; // 혹은 다른 기본 값을 설정할 수 있습니다.

    // 상품 정보 표시
    document.querySelector(".product-detail-name").textContent = product.name;
    document.querySelector(".product-detail-price").textContent =
      `${formatPriceValue(product.price)}`;
    document.querySelector(".product-detail-description").textContent =
      product.description;
    document.querySelector(".product-detail-status").textContent =
      `${translatedStatus}`;
    document.querySelector(".product-detail-location").textContent =
      product.location || "위치 정보 없음";
    document.querySelector(".trade-detail-methods").textContent =
      `${translatedTradeMethods}`;

    // 썸네일 이미지 표시
    const thumbnailImageElement = document.querySelector(
      ".product-detail-thumbnail-image",
    );
    const thumbnailSrc = await getProductThumbImg(product);
    if (thumbnailSrc) {
      thumbnailImageElement.src = thumbnailSrc;
      thumbnailImageElement.alt = product.name;
    } else {
      thumbnailImageElement.src = "/img/default-thumbnail.png"; // 기본 이미지
    }

    // 상품 등록 시간 (UTC를 로컬 시간으로 변환하여 포맷팅)
    const localDate = new Date(product.created_at); // UTC 시간

    // 요일 이름 배열
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
    const day = String(localDate.getDate()).padStart(2, "0");
    const weekday = days[localDate.getDay()]; // 요일 가져오기
    const hours = String(localDate.getHours()).padStart(2, "0"); // 24시간제
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    const formattedDate = `${year}년 ${month}월 ${day}일 (${weekday}) ${hours}시 ${minutes}분`;
    document.querySelector(".product-detail-date").textContent = formattedDate;

    // 현재 시간과 상품 등록 시간의 차이를 계산
    const currentTime = new Date();
    const timeDiff = currentTime - localDate; // 밀리초 단위 차이
    const hoursDiff = timeDiff / (1000 * 60 * 60); // 시간 단위로 변환

    if (hoursDiff <= 24) {
      const timeAgoSpan = document.createElement("span");
      timeAgoSpan.className = "time-ago";
      const timeAgoText =
        hoursDiff >= 1
          ? `(${Math.floor(hoursDiff)}시간 전)`
          : `(${Math.floor(hoursDiff * 60)}분 전)`;
      timeAgoSpan.textContent = timeAgoText;
      document.querySelector(".product-detail-date").appendChild(timeAgoSpan);
    }
  } catch (error) {
    console.error("Failed to load product details:", error);
  }
});

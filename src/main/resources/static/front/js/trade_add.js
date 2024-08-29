document.addEventListener("DOMContentLoaded", async function () {
  // 로그인 확인
  console.log(await getLoggedInUserId());

  const productId = document.querySelector(".group_uuid").innerText;
  console.log(productId);

  // 대분류 변경 시 중분류를 업데이트하는 코드
  document
    .getElementById("category")
    .addEventListener("change", async function () {
      const categorySlug = this.value;
      const categoryName = categorySlugs[categorySlug];
      const parentCategoryId = categories[categoryName];
      const subCategorySelect = document.getElementById("subCategory");

      if (parentCategoryId) {
        const subCategories = await getSubCategories(parentCategoryId);

        // 중분류 옵션 초기화
        subCategorySelect.innerHTML =
          '<option value="">중분류를 선택하세요</option>';

        // 새로운 중분류 옵션 추가
        subCategories.forEach((subCategory) => {
          const option = document.createElement("option");
          option.value = subCategory.id; // 중분류 ID 설정
          option.textContent = subCategory.name;
          subCategorySelect.appendChild(option);
        });
      } else {
        subCategorySelect.innerHTML =
          '<option value="">먼저 대분류를 선택하세요</option>';
      }
    });

  // 이미지 업로드 핸들러
  const imageUploadBox = document.getElementById("imageUploadBox");
  const imageUploadInput = document.getElementById("imageUpload");

  imageUploadBox.addEventListener("click", function () {
    imageUploadInput.click();
  });

  imageUploadInput.addEventListener("change", handleImageUpload);

  // 가격 입력 필드에 formatPriceInput 함수 적용
  const productPriceInput = document.getElementById("productPrice");

  productPriceInput.addEventListener("input", function () {
    formatPriceInput(productPriceInput);
  });

  // 가격 입력 필드에 백스페이스 처리를 위한 이벤트 리스너 추가
  document
    .getElementById("productPrice")
    .addEventListener("keydown", function (e) {
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

  // 가격 값을 초기화하거나 설정할 때 formatPriceValue 함수 적용
  if (productPriceInput.value) {
    productPriceInput.value = formatPriceValue(productPriceInput.value);
  }

  // 거래 방식 버튼 스타일 적용
  const buttons = document.querySelectorAll(".trade-method-button");
  const tradeMethodInput = document.getElementById("tradeMethodValue");

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      // 버튼 활성화 상태 토글
      button.classList.toggle("active");

      // 선택된 값들을 수집
      const selectedMethods = Array.from(buttons)
        .filter((btn) => btn.classList.contains("active"))
        .map((btn) => btn.getAttribute("data-value"));

      // input 필드에 선택된 값을 설정
      tradeMethodInput.value = selectedMethods.join(",");
    });
  });

  // 상품 등록 폼 제출 시
  document
    .getElementById("productUploadForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault(); // 기본 폼 제출 동작 방지

      // 유효성 검사
      const isValid = validateProductForm();
      if (!isValid) {
        return;
      }

      try {
        // 사용자가 입력한 값 수집
        const productName = document.getElementById("productName").value;
        const categoryId = document.getElementById("category").value;
        const subCategoryId = document.getElementById("subCategory").value;
        const productPrice = parseFloat(
          document.getElementById("productPrice").value.replace(/[^0-9]/g, ""),
        );
        const productDescription =
          document.getElementById("productDescription").value;
        const tradeMethods = document
          .getElementById("tradeMethodValue")
          .value.split(",");

        const productId = generateUUID();
        const userProfileId = await getLoggedInUserId();

        console.log("Generated UUID:", productId);
        console.log("User Profile ID:", userProfileId);

        // 이미지 파일 업로드
        const imagePreviews = document.querySelectorAll(".image-preview img");
        const detailImages = [];

        for (let i = 0; i < imagePreviews.length; i++) {
          const dataUrl = imagePreviews[i].src;
          if (dataUrl) {
            const imageFile = dataURLtoFile(dataUrl, `image_${i + 1}.jpg`);
            if (imageFile) {
              if (i === 0) {
                // 첫 번째 이미지는 썸네일로 업로드
                await uploadProductThumbnail(
                  { target: { files: [imageFile] } },
                  productId,
                );
                console.log(`Thumbnail uploaded as: ${productId}_1`);
              } else {
                // 나머지 이미지는 상세 이미지로 업로드
                await uploadProductDetailImages(
                  { target: { files: [imageFile] } },
                  productId,
                  i + 1,
                );
                detailImages.push(`${productId}_${i + 1}`);
                console.log(`Detail image uploaded as: ${productId}_${i + 1}`);
              }
            }
          } else {
            console.error("Image preview source is invalid:", dataUrl);
          }
        }

        // 상세 이미지 파일 이름들을 쉼표로 연결된 문자열로 변환
        const detailImagesString = detailImages.join(",");

        const productData = {
          id: productId,
          name: productName,
          description: productDescription,
          price: productPrice,
          category_id: subCategoryId || categoryId,
          thumbnail_image: `${productId}_1`,
          detail_images: detailImagesString,
          status: "available",
          user_profile_id: userProfileId,
          trade_methods: tradeMethods.join(","),
        };

        await insertProduct(productData);
        console.log("Product inserted successfully");
        window.location.href = "/trade"; // 성공 후 /trade로 리다이렉션
      } catch (error) {
        console.error("Failed to insert product:", error);
        alert("상품 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    });
});

// 상품 등록 폼 유효성 검사 함수
function validateProductForm() {
  let isValid = true;

  // 상품명 유효성 검사
  const productNameInput = document.getElementById("productName");
  const productNameErrorSpan = document.querySelector(
    ".product_name_error_box",
  );
  if (sanitizeInput(productNameInput.value) === "") {
    handleInputError(
      productNameInput.parentElement,
      productNameInput,
      null,
      productNameErrorSpan,
    );
    isValid = false;
  } else {
    resetInputError(
      productNameInput.parentElement,
      productNameInput,
      null,
      productNameErrorSpan,
    );
  }

  // 대분류 유효성 검사
  const categorySelect = document.getElementById("category");
  const categoryErrorSpan = document.querySelector(".category_error_box");
  if (categorySelect.value === "") {
    handleInputError(
      categorySelect.parentElement,
      categorySelect,
      null,
      categoryErrorSpan,
    );
    isValid = false;
  } else {
    resetInputError(
      categorySelect.parentElement,
      categorySelect,
      null,
      categoryErrorSpan,
    );
  }

  // 가격 유효성 검사
  const productPriceInput = document.getElementById("productPrice");
  const productPriceErrorSpan = document.querySelector(".price_error_box");
  if (
    sanitizeInput(productPriceInput.value) === "" ||
    isNaN(productPriceInput.value)
  ) {
    handleInputError(
      productPriceInput.parentElement,
      productPriceInput,
      null,
      productPriceErrorSpan,
    );
    isValid = false;
  } else {
    resetInputError(
      productPriceInput.parentElement,
      productPriceInput,
      null,
      productPriceErrorSpan,
    );
  }

  // 거래 방식 유효성 검사
  const tradeMethods = document.getElementById("tradeMethodValue").value;
  const tradeMethodErrorSpan = document.querySelector(
    ".trade_method_error_box",
  );
  if (!tradeMethods) {
    handleInputError(null, null, null, tradeMethodErrorSpan);
    isValid = false;
  } else {
    resetInputError(null, null, null, tradeMethodErrorSpan);
  }

  // 이미지 유효성 검사
  const imagePreviews = document.querySelectorAll(".image-preview img");
  const imageErrorSpan = document.querySelector(".image_error_box");
  if (imagePreviews.length === 0) {
    handleInputError(
      document.getElementById("imageUploadBox"),
      null,
      null,
      imageErrorSpan,
    );
    isValid = false;
  } else {
    resetInputError(
      document.getElementById("imageUploadBox"),
      null,
      null,
      imageErrorSpan,
    );
  }

  // 상품 상세 설명 유효성 검사 추가
  const productDescriptionInput = document.getElementById("productDescription");
  const descriptionErrorSpan = document.querySelector(".description_error_box");
  if (sanitizeInput(productDescriptionInput.value) === "") {
    handleInputError(
      productDescriptionInput.parentElement,
      productDescriptionInput,
      null,
      descriptionErrorSpan,
    );
    isValid = false;
  } else {
    resetInputError(
      productDescriptionInput.parentElement,
      productDescriptionInput,
      null,
      descriptionErrorSpan,
    );
  }

  return isValid;
}

function generateUUID() {
  // UUID 생성 함수
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// dataURL을 File 객체로 변환하는 함수
function dataURLtoFile(dataurl, filename) {
  if (!dataurl) {
    console.error("Invalid data URL:", dataurl);
    return null;
  }
  const arr = dataurl.split(",");
  if (arr.length < 2) {
    console.error("Invalid data URL format:", dataurl);
    return null;
  }
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function handleImageUpload(event) {
  const files = Array.from(event.target.files); // 파일 리스트를 배열로 변환
  const imagePreviewArea = document.getElementById("image-preview-area");
  files.forEach((file, index) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const div = document.createElement("div");
      div.classList.add("image-preview");
      div.draggable = true;
      div.dataset.index = index; // 파일 인덱스를 data 속성에 저장
      div.innerHTML = `
                    <img src="${e.target.result}" alt="Uploaded Image">
                    <div class="remove-btn" onclick="removeImage(this)">
                        <img src="/img/icons/cancel.svg">
                    </div>
                    <span class="representative-label">대표 이미지</span>
                `;
      imagePreviewArea.appendChild(div);

      // 드래그 앤 드롭 기능 추가
      div.addEventListener("dragstart", handleDragStart);
      div.addEventListener("dragover", handleDragOver);
      div.addEventListener("drop", handleDrop);
    };

    reader.readAsDataURL(file);
  });

  updateRepresentativeLabel(); // 새로 추가된 이미지에 대해 대표 이미지 레이블 업데이트
}

function removeImage(button) {
  const imagePreview = button.parentElement;
  const indexToRemove = parseInt(imagePreview.dataset.index);

  imagePreview.remove();

  // <input>의 파일 리스트를 업데이트
  const inputElement = document.getElementById("imageUpload");
  const dt = new DataTransfer();
  const files = Array.from(inputElement.files);

  files.forEach((file, index) => {
    if (index !== indexToRemove) {
      dt.items.add(file);
    }
  });

  inputElement.files = dt.files; // <input>의 파일 리스트 업데이트
  console.log("Remaining files:", dt.files);

  updateRepresentativeLabel(); // 이미지 삭제 후 대표 이미지 레이블 업데이트

  if (dt.files.length === 0) {
    // 모든 파일이 삭제된 경우 파일 선택 초기화
    inputElement.value = "";
  }
}

let draggedElement = null;

function handleDragStart(event) {
  draggedElement = event.currentTarget;
  event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  event.stopPropagation();

  if (draggedElement !== event.currentTarget) {
    // 드래그한 요소와 드롭 대상이 다를 경우에만 이동
    const imagePreviewArea = document.getElementById("image-preview-area");
    const targetElement = event.currentTarget;
    imagePreviewArea.insertBefore(draggedElement, targetElement);

    // 드롭 후에 다시 대표 이미지 레이블 업데이트
    updateRepresentativeLabel();
    logImageOrder();
  }
}

function updateRepresentativeLabel() {
  const previews = document.querySelectorAll(".image-preview");
  previews.forEach((preview, index) => {
    const label = preview.querySelector(".representative-label");
    label.style.display = index === 0 ? "block" : "none"; // 첫 번째 이미지에만 대표 이미지 레이블 표시
  });
}

function logImageOrder() {
  const previews = document.querySelectorAll(".image-preview img");
  previews.forEach((img, index) => {
    console.log(`Image ${index + 1}: ${img.src}`);
  });
}

// Example of category mapping (you should adjust this based on your actual category data)
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

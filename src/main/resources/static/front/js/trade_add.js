document.addEventListener("DOMContentLoaded", async function () {
    // 로그인 확인
    console.log(await getLoggedInUserId())

    const productId = document.querySelector(".group_uuid").innerText;
    console.log(productId);

    // 대분류 변경 시 중분류를 업데이트하는 코드
    document.getElementById("category").addEventListener("change", async function () {
        const categorySlug = this.value;
        const categoryName = categorySlugs[categorySlug];
        const parentCategoryId = categories[categoryName];
        const subCategorySelect = document.getElementById("subCategory");

        if (parentCategoryId) {
            const subCategories = await getSubCategories(parentCategoryId);

            // 중분류 옵션 초기화
            subCategorySelect.innerHTML = '<option value="">중분류를 선택하세요</option>';

            // 새로운 중분류 옵션 추가
            subCategories.forEach((subCategory) => {
                const option = document.createElement("option");
                option.value = subCategory.id;  // 중분류 ID 설정
                option.textContent = subCategory.name;
                subCategorySelect.appendChild(option);
            });
        } else {
            subCategorySelect.innerHTML = '<option value="">먼저 대분류를 선택하세요</option>';
        }
    });

    // 상품 등록 폼 제출 시
    document.getElementById("productUploadForm").addEventListener("submit", async function(event) {
        event.preventDefault();  // 기본 폼 제출 동작 방지

        try {
            // 사용자가 입력한 값 수집
            const productName = document.getElementById("productName").value;
            const categoryId = document.getElementById("category").value;
            const subCategoryId = document.getElementById("subCategory").value;
            const productPrice = parseFloat(document.getElementById("productPrice").value.replace(/[^0-9]/g, ""));
            const productDescription = document.getElementById("productDescription").value;
            const tradeMethods = Array.from(document.querySelectorAll("input[name='tradeMethod']:checked"))
                .map(input => input.value);

            const productId = generateUUID();
            const userProfileId = await getLoggedInUserId();  // 여기서 await 추가

            console.log("Generated UUID:", productId);
            console.log("User Profile ID:", userProfileId);

            // 썸네일 이미지 파일 업로드
            const thumbnailImageFile = document.getElementById("thumbnailImage").files[0];
            await uploadProductThumbnail({ target: { files: [thumbnailImageFile] } }, productId);
            const thumbnailImageName = `${productId}_1`;

            // 상세 이미지 파일들 업로드
            const detailImageFiles = Array.from(document.getElementById("detailImages").files);
            const detailImages = [];
            for (let i = 0; i < detailImageFiles.length; i++) {
                await uploadProductDetailImages({ target: { files: [detailImageFiles[i]] } }, productId, i + 2);
                detailImages.push(`${productId}_${i + 2}`);
            }

            // 상세 이미지 파일 이름들을 쉼표로 연결된 문자열로 변환
            const detailImagesString = detailImages.join(',');

            const productData = {
                id: productId,  // 생성된 UUID 사용
                name: productName,
                description: productDescription,
                price: productPrice,
                category_id: subCategoryId || categoryId,  // 중분류가 있으면 중분류 ID, 없으면 대분류 ID
                thumbnail_image: thumbnailImageName,
                detail_images: detailImagesString,  // 상세 이미지 파일 이름 문자열
                status: "available",  // 초기 상태는 '판매중'으로 설정
                user_profile_id: userProfileId,  // 현재 로그인한 사용자 ID
                trade_methods: tradeMethods.join(",")  // 직거래 및 택배 방식들
            };

            await insertProduct(productData);
            console.log("Product inserted successfully");
            window.location.href = "/trade";  // 성공 후 /trade로 리다이렉션
        } catch (error) {
            console.error("Failed to insert product:", error);
            alert("상품 등록 중 오류가 발생했습니다. 다시 시도해 주세요.");
        }
    });

});

function generateUUID() {
    // UUID 생성 함수
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
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

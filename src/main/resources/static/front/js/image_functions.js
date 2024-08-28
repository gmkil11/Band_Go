function renderImage(event, elementId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById(elementId).src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

async function uploadProfileImage(event, uuid) {
  const filePath = `public/${uuid}`;
  const file = event.target.files[0];

  // 파일 존재 여부 확인
  const { data: existingFile, error: fetchError } = await client.storage
    .from("user_profile_images")
    .list("", { search: filePath });

  if (fetchError) {
    console.error("Error checking file existence:", fetchError);
    return;
  }

  if (existingFile && existingFile.length > 0) {
    console.log("파일이 존재함으로 업데이트 합니다");
    // 파일이 존재하면 업데이트
    const { data, error } = await client.storage
      .from("user_profile_images")
      .update(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error updating file:", error);
    } else {
      console.log("File updated successfully:", data);
    }
  } else {
    // 파일이 존재하지 않으면 업로드
    console.log("파일이 존재하지 않으므로 업로드 합니다");
    const { data, error } = await client.storage
      .from("user_profile_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
    } else {
      console.log("File uploaded successfully:", data);
    }
  }
}

async function uploadGroupImage(event, groupId) {
  const filePath = `public/${groupId}`;
  const file = event.target.files[0];

  // 파일 존재 여부 확인
  const { data: existingFile, error: fetchError } = await client.storage
    .from("group_profile_images")
    .list("", { search: filePath });

  if (fetchError) {
    console.error("Error checking file existence:", fetchError);
    return;
  }

  if (existingFile && existingFile.length > 0) {
    console.log("파일이 존재함으로 업데이트 합니다");
    // 파일이 존재하면 업데이트
    const { data, error } = await client.storage
      .from("group_profile_images")
      .update(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error updating file:", error);
    } else {
      console.log("File updated successfully:", data);
    }
  } else {
    // 파일이 존재하지 않으면 업로드
    console.log("파일이 존재하지 않으므로 업로드 합니다");
    const { data, error } = await client.storage
      .from("group_profile_images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Error uploading file:", error);
    } else {
      console.log("File uploaded successfully:", data);
    }
  }
}

async function getUserImg(userId) {
  const { data, error } = await client.storage
    .from("user_profile_images")
    .download(`public/${userId}`);

  if (data) {
    const profileImg = document.getElementById("profile_picture_img");
    profileImg.src = URL.createObjectURL(data);
  } else {
    console.error("Error fetching profile image:", error);
  }
}

async function getGroupImg(groupId) {
  const { data, error } = await client.storage
    .from("group_profile_images")
    .download(`public/${groupId}`);

  if (data) {
    const groupImg = document.getElementById("group_picture_img");
    groupImg.src = URL.createObjectURL(data);
  } else {
    console.error("Error fetching group image:", error);
  }
}

async function getProductThumbImg(product) {
  const { data, error } = await client.storage
    .from("trade_thumbnails")
    .download(`public/${product.thumbnail_image}`);

  /*console.log(
    `Requesting thumbnail image from: public/${product.thumbnail_image}`,
  );*/

  if (data) {
    return URL.createObjectURL(data);
  } else {
    console.error("썸네일 이미지를 가져오는데 에러가 발생했습니다:", error);
    return null;
  }
}

async function uploadProductThumbnail(event, productId) {
  const filePath = `public/${productId}_1`;  // 썸네일 파일 이름에 _1을 추가
  const file = event.target.files[0];

  // 파일 존재 여부 확인
  const { data: existingFile, error: fetchError } = await client.storage
      .from("trade_thumbnails")
      .list("", { search: filePath });

  if (fetchError) {
    console.error("Error checking file existence:", fetchError);
    return;
  }

  if (existingFile && existingFile.length > 0) {
    console.log("파일이 존재함으로 업데이트 합니다");
    // 파일이 존재하면 업데이트
    const { data, error } = await client.storage
        .from("trade_thumbnails")
        .update(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
      console.error("Error updating thumbnail image:", error);
    } else {
      console.log("Thumbnail image updated successfully:", data);
    }
  } else {
    // 파일이 존재하지 않으면 업로드
    console.log("파일이 존재하지 않으므로 업로드 합니다");
    const { data, error } = await client.storage
        .from("trade_thumbnails")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

    if (error) {
      console.error("Error uploading thumbnail image:", error);
    } else {
      console.log("Thumbnail image uploaded successfully:", data);
    }
  }
}

async function uploadProductDetailImages(event, productId, index) {
  const file = event.target.files[0];
  const fileName = `${productId}_${index}`;

  // 파일을 항상 새로운 이름으로 업로드하도록 처리
  const { data, error } = await client.storage
      .from("trade_detail_images")
      .upload(`public/${fileName}`, file, {
        cacheControl: "3600",
        upsert: false,  // 덮어쓰지 않도록 설정
      });

  if (error) {
    console.error(`Error uploading detail image (${index}):`, error);
  } else {
    console.log(`Detail image (${index}) uploaded successfully:`, data);
  }
}

